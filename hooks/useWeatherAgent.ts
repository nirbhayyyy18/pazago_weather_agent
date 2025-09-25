// hooks/useWeatherAgent.ts
import { useCallback, useRef, useState } from "react";

export type Role = "user" | "agent";
export type Message = { id: string; role: Role; content: string; ts: number; error?: string };

const STREAM_ENDPOINT = process.env.NEXT_PUBLIC_WEATHER_AGENT_ENDPOINT || "";
const PLAYGROUND_HEADER = process.env.NEXT_PUBLIC_PLAYGROUND_HEADER || "true";
const THREAD_ID = process.env.NEXT_PUBLIC_THREAD_ID || "2";

function uuid() {
  return Math.random().toString(36).slice(2, 9);
}

function findMatchingBraceIndex(s: string, startIdx: number) {
  let depth = 0;
  for (let i = startIdx; i < s.length; i++) {
    if (s[i] === "{") depth++;
    else if (s[i] === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

// check if parsed JSON is just a raw tool call info (not useful for user)
function isRawToolCall(parsed: any) {
  return parsed.toolCallId && parsed.toolName && parsed.args;
}

function formatToolResult(parsed: any) {
  const r = parsed.result ?? parsed;
  if (!r || typeof r !== "object") return JSON.stringify(r);

  if ("location" in r && ("temperature" in r || "conditions" in r)) {
    const loc = r.location ?? "location";
    const cond = r.conditions ?? "";
    const temp = r.temperature !== undefined ? `${r.temperature}°C` : "";
    const feels = r.feelsLike !== undefined ? ` (feels like ${r.feelsLike}°C)` : "";
    const hum = r.humidity !== undefined ? `Humidity ${r.humidity}%` : "";
    const wind = r.windSpeed !== undefined ? `Wind ${r.windSpeed} km/h` : "";
    const gust = r.windGust !== undefined ? ` (gusts up to ${r.windGust} km/h)` : "";
    return `🔎 Weather tool — ${loc}: ${cond}${temp ? `, ${temp}` : ""}${feels}${hum ? `, ${hum}` : ""}${wind ? `, ${wind}${gust}` : ""}.`;
  }

  return Object.entries(r).map(([k, v]) => `${k}: ${v}`).join(" • ");
}

export default function useWeatherAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendUserMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: uuid(), role: "user", content: text, ts: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const body = {
      messages: [{ role: "user", content: text }],
      runId: "weatherAgent",
      maxRetries: 2,
      maxSteps: 5,
      temperature: 0.5,
      topP: 1,
      runtimeContext: {},
      threadId: THREAD_ID,
      resourceId: "weatherAgent"
    };

    abortRef.current = new AbortController();
    try {
      const res = await fetch(STREAM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-mastra-dev-playground": PLAYGROUND_HEADER
        },
        body: JSON.stringify(body),
        signal: abortRef.current.signal
      });

      if (!res.ok) {
        const errText = await res.text();
        const errMsg: Message = { id: uuid(), role: "agent", content: "", ts: Date.now(), error: `API error: ${res.status} ${errText}` };
        setMessages(prev => [...prev, errMsg]);
        setLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body stream.");

      const agentId = uuid();
      let agentMsg: Message = { id: agentId, role: "agent", content: "", ts: Date.now() };
      setMessages(prev => [...prev, agentMsg]);

      const decoder = new TextDecoder();
      let buffer = "";

      const tokenRegex = /(\d+):"([^"]*)"/g;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // 1) token fragments
        let foundTokens = false;
        tokenRegex.lastIndex = 0;
        let match;
        while ((match = tokenRegex.exec(buffer)) !== null) {
          const tokenText = match[2];
          agentMsg = { ...agentMsg, content: agentMsg.content + tokenText };
          foundTokens = true;
        }
        if (foundTokens) {
          buffer = buffer.replace(tokenRegex, "");
          setMessages(prev => {
            const c = [...prev];
            const idx = c.findIndex(m => m.id === agentId);
            if (idx >= 0) c[idx] = { ...c[idx], content: agentMsg.content };
            return c;
          });
        }

        // 2) JSON events
        while (true) {
          const evtMatch = /([a-z0-9]):\s*\{/.exec(buffer);
          if (!evtMatch) break;
          const prefix = evtMatch[1];
          const braceStart = evtMatch.index + evtMatch[0].indexOf("{");
          const braceEnd = findMatchingBraceIndex(buffer, braceStart);
          if (braceEnd === -1) break;

          const jsonStr = buffer.slice(braceStart, braceEnd + 1);
          try {
            const parsed = JSON.parse(jsonStr);
            if (prefix === "a" || prefix === "9") {
              if (isRawToolCall(parsed)) {
                // skip raw toolCall bubble
              } else {
                const toolMessageText = formatToolResult(parsed);
                const toolMsg: Message = { id: uuid(), role: "agent", content: toolMessageText, ts: Date.now() };
                setMessages(prev => [...prev, toolMsg]);
              }
            }
          } catch (err) {
            console.warn("Failed to parse JSON chunk", err);
          }
          buffer = buffer.slice(0, evtMatch.index) + buffer.slice(braceEnd + 1);
        }
      }

      setLoading(false);
    } catch (err: any) {
      const errMsg: Message = { id: uuid(), role: "agent", content: "", ts: Date.now(), error: err?.message || "Request aborted" };
      setMessages(prev => [...prev, errMsg]);
      setLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setMessages([]);
    setLoading(false);
  }, []);

  return { messages, loading, sendUserMessage, clearChat };
}
