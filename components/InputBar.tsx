import React, { useState } from "react";

export default function InputBar({ onSend, disabled, onClear }: { onSend: (t: string)=>void; disabled?: boolean; onClear?: ()=>void }) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="p-3 border-t flex gap-2 items-center">
      <textarea
        value={text}
        onChange={(e)=>setText(e.target.value)}
        onKeyDown={(e)=>{ if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
        placeholder="Ask about weather (e.g. 'Will it rain tomorrow in Mumbai?')"
        className="flex-1 resize-none rounded-md p-2 border"
        rows={1}
        disabled={disabled}
      />
      <button onClick={submit} disabled={disabled} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">Send</button>
      <button onClick={onClear} className="px-3 py-2 border rounded">Clear</button>
    </div>
  );
}
