"use client";

import {
  CalendarDays,
  Clock3,
  Users,
  ChevronRight,
} from "lucide-react";

const statusStyles = {
  Completed:
    "bg-emerald-100 text-emerald-700",
  Processing:
    "bg-amber-100 text-amber-700",
  "Summary Ready":
    "bg-indigo-100 text-indigo-700",
};

export default function MeetingCard({ meeting }) {
  return (
    <div className="group cursor-pointer rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">
            {meeting.title}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-5 text-sm text-zinc-500">
            <span className="flex items-center gap-1">
              <CalendarDays size={15} />
              {meeting.date}
            </span>

            <span className="flex items-center gap-1">
              <Clock3 size={15} />
              {meeting.duration}
            </span>

            <span className="flex items-center gap-1">
              <Users size={15} />
              {meeting.participants} Participants
            </span>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            statusStyles[meeting.status]
          }`}
        >
          {meeting.status}
        </span>
      </div>

      <div className="mt-6 flex items-center justify-end">
        <ChevronRight className="text-zinc-400 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </div>
  );
}