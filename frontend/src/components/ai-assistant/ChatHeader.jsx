"use client";

import { Bot, Plus } from "lucide-react";

export default function ChatHeader({ onNewChat }) {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4 sm:px-8">
      <div className="flex items-center gap-3.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-primary">
          <Bot size={20} />
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            MeetMind Copilot
          </h2>

          <p className="text-xs text-muted-foreground">
            Ask questions, retrieve quotes, or brainstorm action plans
          </p>
        </div>
      </div>

      <button
        onClick={onNewChat}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-raised px-3.5 py-2 text-xs font-medium text-foreground transition hover:bg-surface-hover active:scale-[0.98] cursor-pointer"
      >
        <Plus size={14} />
        <span>New Chat</span>
      </button>
    </header>
  );
}
