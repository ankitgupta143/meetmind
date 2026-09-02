"use client";

import {
  Hash,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export default function TopicsDiscussed({ insights, analytics }) {
  const topics =
    analytics?.topics ?? insights?.analytics?.topics ?? [];

  const sortedTopics = [...topics].sort(
    (a, b) =>
      (b.percentage || 0) -
      (a.percentage || 0)
  );

  const mostDiscussed = sortedTopics[0];

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-6 shadow-xl backdrop-blur-2xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          Topics Discussed
          <Sparkles size={16} className="text-cyan-400" />
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          AI identified the primary themes and subject density covered in the meeting.
        </p>
      </div>

      {/* Empty State */}
      {sortedTopics.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-slate-900/30 p-10 text-center">
          <Hash size={36} className="mx-auto text-slate-600" />
          <h3 className="mt-3 text-sm font-semibold text-slate-200">
            No topics detected
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            No discussion topics were identified for this meeting.
          </p>
        </div>
      ) : (
        <>
          {/* Topic Chips */}
          <div className="flex flex-wrap gap-2.5">
            {sortedTopics.map((topic, index) => (
              <div
                key={`${topic.name}-${index}`}
                className="group flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-slate-900/50 px-3.5 py-2 transition-all duration-300 hover:border-indigo-500/40 hover:bg-slate-900/80"
              >
                <Hash size={14} className="text-indigo-400" />
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                  {topic.name}
                </span>
                <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                  {topic.percentage}%
                </span>
              </div>
            ))}
          </div>

          {/* Most Discussed Card */}
          {mostDiscussed && (
            <div className="mt-6 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-slate-900/60 to-orange-950/20 p-5 backdrop-blur-md">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 shadow-md">
                  <MessageSquare size={18} />
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Dominant Discussion Topic
                  </h3>
                  <h4 className="mt-1 text-base font-extrabold tracking-tight text-white">
                    {mostDiscussed.name}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">
                    This subject represented approximately{" "}
                    <span className="font-bold text-amber-300">
                      {mostDiscussed.percentage}%
                    </span>{" "}
                    of total speaking segments and focus during the conversation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}