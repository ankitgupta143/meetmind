"use client";

import { Bot, Sparkles, Plus } from "lucide-react";

export default function ChatHeader({ onNewChat }) {
  return (
    <header className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4 sm:px-8">
      <div className="flex items-center gap-3.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-600/30">
          <Bot size={20} />
        </div>

        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            MeetMind Copilot
            <Sparkles size={14} className="text-cyan-400" />
          </h2>

          <p className="text-xs text-slate-400">
            Ask questions, retrieve quotes, or brainstorm action plans
          </p>
        </div>
      </div>

      <button
        onClick={onNewChat}
        className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer"
      >
        <Plus size={14} />
        <span>New Chat</span>
      </button>
    </header>
  );
}