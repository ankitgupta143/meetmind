"use client";

import {
  CalendarClock,
  PlayCircle,
  Flag,
  CheckCircle2,
  CircleDot,
  Clock3,
} from "lucide-react";

import { meetingTimeline } from "@/constants/mockData";

const icons = {
  start: PlayCircle,
  topic: CircleDot,
  discussion: CalendarClock,
  decision: CheckCircle2,
  planning: Flag,
  end: Clock3,
};

export default function MeetingTimeline() {
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

      <div className="relative ml-4">
        {/* Vertical Line */}
        <div className="absolute left-5 top-0 h-full w-0.5 bg-zinc-200" />

        <div className="space-y-8">
          {meetingTimeline.map((item) => {
            const Icon = icons[item.type];

            return (
              <div
                key={item.id}
                className="group relative flex gap-5"
              >
                {/* Timeline Icon */}
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm transition-all duration-300 group-hover:border-indigo-500 group-hover:bg-indigo-50">
                  <Icon
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
                        {item.time}
                      </p>
                    </div>

                    <button className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600">
                      <PlayCircle size={16} />
                      {item.duration}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}