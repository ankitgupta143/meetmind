"use client";

import {
  Target,
  Clock3,
  Users,
} from "lucide-react";

import { decisionsData } from "@/constants/mockData";

export default function Decisions() {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-zinc-200 p-6">
        <h2 className="text-2xl font-bold">
          Decisions
        </h2>

        <p className="mt-1 text-zinc-500">
          AI-detected decisions from this meeting.
        </p>
      </div>

      <div className="divide-y divide-zinc-100">
        {decisionsData.map((decision) => (
          <div
            key={decision.id}
            className="p-6 transition hover:bg-zinc-50"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
                <Target size={20} />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {decision.title}
                </h3>

                <p className="mt-3 leading-7 text-zinc-600">
                  {decision.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-6 text-sm text-zinc-500">
                  <span className="flex items-center gap-2">
                    <Users size={15} />
                    {decision.owner}
                  </span>

                  <span className="flex items-center gap-2">
                    <Clock3 size={15} />
                    {decision.timestamp}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}