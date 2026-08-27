"use client";

import { Sparkles, Lightbulb, Target, CheckCircle2 } from "lucide-react";

export default function AISummary({ insights }) {
  const overview =
    insights?.summary?.overview?.trim() ||
    "No meeting overview is available yet.";

  const keyTakeaways = Array.isArray(insights?.summary?.keyTakeaways)
    ? insights.summary.keyTakeaways
    : [];

  const decisions = Array.isArray(insights?.decisions)
    ? insights.decisions
    : [];

  const actionItems = Array.isArray(insights?.actionItems)
    ? insights.actionItems
    : [];
  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600">
            <Sparkles size={18} />
          </div>

          <h2 className="text-xl font-semibold">Meeting Overview</h2>
        </div>

        <p className="leading-7 text-zinc-600">{overview}</p>
      </div>

      {/* Key Takeaways */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-amber-100 p-2 text-amber-600">
            <Lightbulb size={18} />
          </div>

          <h2 className="text-xl font-semibold">Key Takeaways</h2>
        </div>

        {keyTakeaways.length > 0 ? (
          <ul className="space-y-3 text-zinc-600">
            {keyTakeaways.map((takeaway, index) => (
              <li key={`${takeaway} - ${index}`} className="flex gap-3">
                <span className="text-amber-500">•</span>

                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500">
            No key takeaways were identified.
          </p>
        )}
      </div>

      {/* Decisions */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-violet-100 p-2 text-violet-600">
            <Target size={18} />
          </div>

          <h2 className="text-xl font-semibold">Decisions Made</h2>
        </div>

        {decisions.length > 0 ? (
          <ul className="space-y-4 text-zinc-600">
            {decisions.map((decision, index) => (
              <li
                key={`${decision.title}-${index}`}
                className="rounded-xl bg-zinc-50 p-4"
              >
                <p className="font-medium text-zinc-900">{decision.title}</p>

                {decision.description && (
                  <p className="mt-1 text-sm leading-6 text-zinc-500">
                    {decision.description}
                  </p>
                )}

                {decision.owner && (
                  <p className="mt-2 text-xs font-medium text-zinc-400">
                    Owner: {decision.owner}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500">No decisions were identified.</p>
        )}
      </div>

      {/* Actions */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
            <CheckCircle2 size={18} />
          </div>

          <h2 className="text-xl font-semibold">Next Actions</h2>
        </div>

        {actionItems.length > 0 ? (
          <ul className="space-y-4 text-zinc-600">
            {actionItems.map((item, index) => (
              <li
                key={`${item.title}-${index}`}
                className="rounded-xl bg-zinc-50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="font-medium text-zinc-900">
                    {item.title}
                  </p>

                  {item.priority && (
                    <span className="shrink-0 rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium capitalize text-indigo-700">
                      {item.priority}
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="mt-1 text-sm leading-6 text-zinc-500">
                    {item.description}
                  </p>
                )}

                {item.assignee && (
                  <p className="mt-2 text-xs font-medium text-zinc-400">
                    Assigned to: {item.assignee}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500">
            No action items were identified.
          </p>
        )}
      </div>
    </div>
  );
}
