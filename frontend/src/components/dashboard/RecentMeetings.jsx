"use client";

import {
  ArrowRight,
  CalendarDays,
  Users,
  Clock3,
} from "lucide-react";

import { dashboardData } from "@/constants/mockData";

const statusStyles = {
  Completed:
    "bg-emerald-50 text-emerald-700",

  Processing:
    "bg-amber-50 text-amber-700",

  "Summary Ready":
    "bg-indigo-50 text-indigo-700",
};

const RecentMeetings = () => {
  return (
    <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Recent Meetings
          </h2>

          <p className="mt-1 text-zinc-500">
            Continue where you left off.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {dashboardData.recentMeetings.map((meeting) => (
          <button
            key={meeting.id}
            className="group flex w-full items-center justify-between rounded-2xl border border-zinc-200 p-5 text-left transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-zinc-800 dark:hover:bg-zinc-800"
          >
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">
                  {meeting.title}
                </h3>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[meeting.status]}`}
                >
                  {meeting.status}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-5 text-sm text-zinc-500">
                <span className="flex items-center gap-2">
                  <Users size={15} />
                  {meeting.participants} Participants
                </span>

                <span className="flex items-center gap-2">
                  <Clock3 size={15} />
                  {meeting.duration}
                </span>

                <span className="flex items-center gap-2">
                  <CalendarDays size={15} />
                  {meeting.date}
                </span>
              </div>
            </div>

            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        ))}
      </div>
    </section>
  );
};

export default RecentMeetings;