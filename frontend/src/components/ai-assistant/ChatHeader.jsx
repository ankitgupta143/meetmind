"use client";

import { Bot, Sparkles, Plus } from "lucide-react";

export default function ChatHeader({ onNewChat }) {
  return (
    <header className="flex items-center justify-between border-b border-zinc-200 px-8 py-5">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg">
          <Bot size={24} />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-zinc-900">
            MeetMind AI
          </h2>

          <p className="text-sm text-zinc-500">
            Ask questions about this meeting
          </p>
        </div>
      </div>

      <button
        onClick={onNewChat}
        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100 cursor-pointer"
      >
        <Plus size={16} />
        New Chat
      </button>
    </header>
  );
}