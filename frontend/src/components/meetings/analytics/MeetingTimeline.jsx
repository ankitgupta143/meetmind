"use client";

import {
  CalendarClock,
  CircleDot,
  Clock3,
  Sparkles,
} from "lucide-react";

function formatTimestamp(seconds = 0) {
  const totalSeconds = Math.max(
    0,
    Math.floor(Number(seconds) || 0)
  );

  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

export default function MeetingTimeline({ insights }) {
  const timeline = insights?.timeline ?? [];

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-6 shadow-xl backdrop-blur-2xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          Meeting Timeline
          <Sparkles size={16} className="text-violet-400" />
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Key discussion milestones and transitions detected in chronological order.
        </p>
      </div>

      {/* Empty State */}
      {timeline.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-slate-900/30 p-10 text-center">
          <CalendarClock size={36} className="mx-auto text-slate-600" />
          <h3 className="mt-3 text-sm font-semibold text-slate-200">
            No timeline events
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            No key milestones were detected for this meeting.
          </p>
        </div>
      ) : (
        <div className="relative ml-2 sm:ml-4">
          {/* Vertical Neon Line */}
          <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-indigo-500 via-violet-500 to-cyan-500/30" />

          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div
                key={`${item.timestamp}-${index}`}
                className="group relative flex items-start gap-4"
              >
                {/* Timeline Icon */}
                <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-indigo-500/40 bg-slate-900 text-indigo-400 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:border-indigo-400 group-hover:bg-indigo-500 group-hover:text-white">
                  <CircleDot size={15} />
                </div>

                {/* Content */}
                <div className="flex-1 rounded-2xl border border-white/[0.06] bg-slate-900/40 p-4 transition-all duration-300 hover:border-indigo-500/30 hover:bg-slate-900/70">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="text-xs font-bold text-slate-100 group-hover:text-white">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] font-medium text-slate-300">
                      <Clock3 size={13} className="text-indigo-400" />
                      {formatTimestamp(item.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}