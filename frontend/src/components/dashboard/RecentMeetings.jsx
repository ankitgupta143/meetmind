"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Users,
  Clock3,
  Sparkles,
} from "lucide-react";

import { dashboardData } from "@/constants/mockData";

const statusStyles = {
  Completed:
    "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
  Processing:
    "bg-amber-500/15 border-amber-500/30 text-amber-300",
  "Summary Ready":
    "bg-indigo-500/15 border-indigo-500/30 text-indigo-300",
  Failed:
    "bg-rose-500/15 border-rose-500/30 text-rose-300",
};

const RecentMeetings = () => {
  const router = useRouter();

  return (
    <section className="mt-8 rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-6 sm:p-8 shadow-xl backdrop-blur-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Recent Meetings
            <Sparkles size={16} className="text-indigo-400" />
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Pick up where you left off or review AI synthesis dossiers.
          </p>
        </div>

        <button
          onClick={() => router.push("/meetings")}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
        >
          View all
        </button>
      </div>

      <div className="space-y-3">
        {dashboardData.recentMeetings.map((meeting) => (
          <div
            key={meeting.id}
            onClick={() => router.push(`/meetings/${meeting.id}`)}
            className="group flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-slate-900/40 p-5 text-left transition-all duration-300 hover:border-indigo-500/30 hover:bg-slate-900/80 hover:-translate-y-0.5 cursor-pointer sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {meeting.title}
                </h3>

                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${
                    statusStyles[meeting.status] || "bg-white/10 text-white"
                  }`}
                >
                  {meeting.status}
                </span>
              </div>

              <div className="mt-2.5 flex flex-wrap gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Users size={13} className="text-cyan-400" />
                  {meeting.participants} Participants
                </span>

                <span className="flex items-center gap-1.5">
                  <Clock3 size={13} className="text-amber-400" />
                  {meeting.duration}
                </span>

                <span className="flex items-center gap-1.5">
                  <CalendarDays size={13} className="text-indigo-400" />
                  {meeting.date}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center text-xs font-semibold text-slate-400 group-hover:text-indigo-300">
              <span className="hidden sm:inline">Workspace</span>
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentMeetings;