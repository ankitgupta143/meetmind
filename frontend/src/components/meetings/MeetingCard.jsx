"use client";

import {
  CalendarDays,
  Clock3,
  Users,
  ChevronRight,
  Sparkles,
  Activity,
} from "lucide-react";
import { useRouter } from "next/navigation";

const statusStyles = {
  Completed: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
  Processing: "bg-amber-500/15 border-amber-500/30 text-amber-300",
  "Summary Ready": "bg-indigo-500/15 border-indigo-500/30 text-indigo-300",
  Failed: "bg-rose-500/15 border-rose-500/30 text-rose-300",
};

export default function MeetingCard({ meeting }) {
  const router = useRouter();

  const handleClick = () => {
    const meetingId = meeting?.id || meeting?._id;
    if (meetingId) {
      router.push(`/meetings/${meetingId}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          handleClick();
        }
      }}
      className="group relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-6 shadow-xl backdrop-blur-2xl transition-all duration-300 hover:border-indigo-500/40 hover:bg-slate-900/80 hover:-translate-y-1 hover:shadow-[0_20px_45px_-15px_rgba(99,102,241,0.25)] cursor-pointer"
    >
      {/* Background ambient glow spot */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-40" />

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
              {meeting.title}
            </h3>

            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${
                statusStyles[meeting.status] || "bg-white/10 text-white"
              }`}
            >
              {meeting.status}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} className="text-indigo-400" />
              {meeting.date}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock3 size={14} className="text-amber-400" />
              {meeting.duration}
            </span>

            <span className="flex items-center gap-1.5">
              <Users size={14} className="text-cyan-400" />
              {meeting.participants} Participants
            </span>

            {/* Audio waveform micro-indicator */}
            <div className="hidden md:flex items-center gap-1 text-[11px] font-mono text-slate-500">
              <div className="flex items-end gap-0.5 h-3.5">
                <span className="w-0.5 h-2 bg-indigo-400 rounded-full wave-bar-1" />
                <span className="w-0.5 h-3.5 bg-indigo-400 rounded-full wave-bar-2" />
                <span className="w-0.5 h-1.5 bg-indigo-400 rounded-full wave-bar-3" />
                <span className="w-0.5 h-3 bg-indigo-400 rounded-full wave-bar-4" />
              </div>
              <span className="ml-1 text-[10px]">AI Diarized</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center text-xs font-semibold text-slate-400 group-hover:text-indigo-300">
          <span className="hidden sm:inline">Open Workspace</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 group-hover:border-transparent">
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}