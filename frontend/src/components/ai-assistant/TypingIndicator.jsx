"use client";

import { Bot } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="mb-6 flex gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
        <Bot size={18} />
      </div>

      <div className="rounded-2xl rounded-tl-none border border-border bg-surface-raised px-5 py-4 shadow-xs">
        <p className="mb-3 text-sm font-medium text-foreground">
          MeetMind is analyzing your meeting...
        </p>

        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}
