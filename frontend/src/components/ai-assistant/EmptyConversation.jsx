"use client";

import { Sparkles } from "lucide-react";

export default function EmptyConversation() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xl">
        <Sparkles size={34} />
      </div>

      <h2 className="mt-8 text-3xl font-bold text-zinc-900">
        Ask anything about this meeting
      </h2>

      <p className="mt-4 text-lg text-zinc-500">
        MeetMind can summarize discussions, extract action items,
        explain decisions, generate follow-up emails and answer
        questions using your meeting transcript.
      </p>
    </div>
  );
}