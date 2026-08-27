"use client";

import {
  CalendarClock,
  PlayCircle,
  CheckCircle2,
  CircleDot,
  Clock3,
} from "lucide-react";

export default function MeetingTimeline({ insights }) {
  const timeline = insights?.timeline ?? [];

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold">
          Meeting Timeline
        </h2>

        <p className="mt-2 text-sm text-zinc-500">
          Key milestones detected throughout the meeting.
        </p>
      </div>

      {/* Empty State */}
      {timeline.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center">
          <CalendarClock
            size={40}
            className="mx-auto text-zinc-400"
          />

          <h3 className="mt-4 font-semibold text-zinc-900">
            No timeline events
          </h3>

          <p className="mt-1 text-sm text-zinc-500">
            No key milestones were detected for this meeting.
          </p>
        </div>
      ) : (
        <div className="relative ml-4">
          {/* Vertical Line */}
          <div className="absolute left-5 top-0 h-full w-0.5 bg-zinc-200" />

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div
                key={`${item.timestamp}-${index}`}
                className="group relative flex gap-5"
              >
                {/* Timeline Icon */}
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm transition-all duration-300 group-hover:border-indigo-500 group-hover:bg-indigo-50">
                  <CircleDot
                    size={18}
                    className="text-indigo-600"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 rounded-2xl border border-zinc-200 p-5 transition-all duration-300 hover:border-indigo-200 hover:bg-zinc-50">
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                    <div>
                      <h3 className="font-semibold text-zinc-900">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-500">
                        {formatTimestamp(item.timestamp)}
                      </p>

                      {item.description && (
                        <p className="mt-3 text-sm leading-6 text-zinc-600">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-500">
                      <Clock3 size={16} />

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