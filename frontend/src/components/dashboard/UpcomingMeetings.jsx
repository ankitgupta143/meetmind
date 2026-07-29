"use client";

import { dashboardData } from "@/constants/mockData";
import { CalendarDays, Clock3, Users, ChevronRight } from "lucide-react";

const UpcomingMeetings = () => {
  return (
    <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Upcoming Meetings</h2>
        <p className="mt-1 text-zinc-500">
          Stay prepared for what's coming next.
        </p>
      </div>

      <div className="space-y-4">
        {dashboardData.upcomingMeetings.map((meeting) => (
          <div
            key={meeting.id}
            className="group flex items-center justify-between rounded-2xl border border-zinc-200 p-5 transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50/30 dark:border-zinc-800 dark:hover:bg-zinc-800"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10">
                <CalendarDays size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  {meeting.title}
                </h3>

                <div className="mt-2 flex flex-wrap gap-4 text-sm text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Clock3 size={14} />
                    {meeting.time}
                  </span>

                  <span>{meeting.duration}</span>

                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    {meeting.participants} Participants
                  </span>
                </div>
              </div>
            </div>

            <ChevronRight className="text-zinc-400 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default UpcomingMeetings;