"use client";

import { Sparkles } from "lucide-react";

export default function EmptyConversation() {
  return (
    <div className="mx-auto max-w-xl text-center py-2 sm:py-3">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-primary shadow-xs">
        <Sparkles size={22} />
      </div>

      <h2 className="mt-3 text-lg font-bold tracking-tight text-foreground sm:text-xl">
        Ask anything about this meeting
      </h2>

      <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground max-w-lg mx-auto">
        MeetMind Copilot can summarize key points, analyze controversial topics, draft follow-up emails, and explain decisions with exact timestamp references.
      </p>
    </div>
  );
}
