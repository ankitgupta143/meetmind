"use client";

import { transcriptData } from "@/constants/mockData";

export default function Transcript() {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-zinc-200 p-6">
        <h2 className="text-2xl font-bold">
          Meeting Transcript
        </h2>

        <p className="mt-1 text-zinc-500">
          AI-generated transcript of the conversation.
        </p>
      </div>

      {/* Messages */}
      <div className="divide-y divide-zinc-100">
        {transcriptData.map((item) => (
          <div
            key={item.id}
            className="flex gap-5 p-6 transition hover:bg-zinc-50"
          >
            {/* Avatar */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
              {item.initials}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {item.speaker}
                </h3>

                <span className="text-sm text-zinc-400">
                  {item.time}
                </span>
              </div>

              <p className="mt-3 leading-7 text-zinc-600">
                {item.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}