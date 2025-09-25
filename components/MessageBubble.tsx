import React from "react";
import type { Message } from "../hooks/useWeatherAgent";

export default function MessageBubble({ m }: { m: Message }) {
  const isUser = m.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`${isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"} max-w-[85%] p-3 rounded-lg`}>
        <div className="whitespace-pre-wrap break-words">{m.error ? <span className="text-red-500">Error: {m.error}</span> : m.content || (m.error ? "" : "…")}</div>
        <div className="text-xs opacity-60 mt-1 text-right">{new Date(m.ts).toLocaleTimeString()}</div>
      </div>
    </div>
  );
}
