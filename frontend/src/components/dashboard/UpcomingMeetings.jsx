"use client";

import { dashboardData } from "@/constants/mockData";
import { CalendarDays, Clock3, Users, ChevronRight, Sparkles } from "lucide-react";

const UpcomingMeetings = () => {
  return (
    <section className="mt-8 rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-6 sm:p-8 shadow-xl backdrop-blur-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          Upcoming Schedule
          <Sparkles size={16} className="text-amber-400" />
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Sync with your calendar to automatically dispatch MeetMind AI bot.
        </p>
      </div>

      <div className="space-y-3">
        {dashboardData.upcomingMeetings.map((meeting) => (
          <div
            key={meeting.id}
            className="group flex items-center justify-between rounded-2xl border border-white/[0.06] bg-slate-900/40 p-4 transition-all duration-300 hover:border-indigo-500/30 hover:bg-slate-900/80"
          >
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 text-indigo-400">
                <CalendarDays size={18} />
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {meeting.title}
                </h3>

                <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-mono text-[11px] text-slate-300">
                    <Clock3 size={12} className="text-amber-400" />
                    {meeting.time}
                  </span>

                  <span className="text-[11px]">{meeting.duration}</span>

                  <span className="flex items-center gap-1 text-[11px]">
                    <Users size={12} className="text-cyan-400" />
                    {meeting.participants} Participants
                  </span>
                </div>
              </div>
            </div>

            <ChevronRight size={16} className="text-slate-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default UpcomingMeetings;