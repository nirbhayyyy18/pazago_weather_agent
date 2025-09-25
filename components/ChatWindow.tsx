import React, { useEffect, useRef } from "react";
import useWeatherAgent from "../hooks/useWeatherAgent";
import MessageBubble from "./MessageBubble";
import InputBar from "./InputBar";

export default function ChatWindow() {
  const { messages, loading, sendUserMessage, clearChat } = useWeatherAgent();
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(()=>{
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="max-w-3xl mx-auto h-[80vh] flex flex-col border rounded shadow">
      <div className="flex-1 overflow-auto p-4">
        {messages.length === 0 && <div className="text-center text-gray-500 mt-8">Say hi 👋 — try "What's the weather in London?"</div>}
        {messages.map(m => <MessageBubble key={m.id} m={m} />)}
        <div ref={endRef} />
      </div>

      <div>
        <InputBar onSend={sendUserMessage} disabled={loading} onClear={clearChat}/>
      </div>
    </div>
  );
}
