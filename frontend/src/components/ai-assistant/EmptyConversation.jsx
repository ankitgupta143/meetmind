"use client";

import { Sparkles } from "lucide-react";

export default function EmptyConversation() {
  return (
    <div className="mx-auto max-w-xl text-center py-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-xl shadow-indigo-600/30">
        <Sparkles size={28} className="animate-pulse" />
      </div>

      <h2 className="mt-5 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
        Ask anything about this meeting
      </h2>

      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-400">
        MeetMind Copilot can summarize key points, analyze controversial topics, draft follow-up emails, and explain decisions with exact timestamp references.
      </p>
    </div>
  );
}