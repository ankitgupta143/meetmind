"use client";

import {
  Target,
  Users,
} from "lucide-react";

export default function Decisions({ insights }) {
  const decisions = Array.isArray(
    insights?.decisions
  )
    ? insights.decisions
    : [];

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

      {/* Empty State */}
      {decisions.length === 0 ? (
        <div className="p-10 text-center">
          <Target
            size={40}
            className="mx-auto text-violet-400"
          />

          <h3 className="mt-4 font-semibold text-zinc-900">
            No decisions found
          </h3>

          <p className="mt-1 text-sm text-zinc-500">
            No significant decisions were identified
            in this meeting.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-100">
          {decisions.map((decision, index) => (
            <div
              key={`${decision.title}-${index}`}
              className="p-6 transition hover:bg-zinc-50"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
                  <Target size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {decision.title}
                  </h3>

                  {decision.description && (
                    <p className="mt-3 leading-7 text-zinc-600">
                      {decision.description}
                    </p>
                  )}

                  {decision.owner && (
                    <div className="mt-5 flex flex-wrap gap-6 text-sm text-zinc-500">
                      <span className="flex items-center gap-2">
                        <Users size={15} />
                        {decision.owner}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}