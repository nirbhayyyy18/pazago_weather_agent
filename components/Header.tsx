import React from "react";

export default function Header() {
  return (
    <header className="p-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <h1 className="text-lg font-semibold">Weather Agent Chat</h1>
        <div className="text-sm opacity-90">Pazago Assignment</div>
      </div>
    </header>
  );
}
