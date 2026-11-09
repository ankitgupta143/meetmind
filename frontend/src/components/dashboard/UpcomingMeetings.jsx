"use client";

import { useRouter } from "next/navigation";
import { CalendarDays, Clock3, Users, ChevronRight, Sparkles, Link2 } from "lucide-react";

const UpcomingMeetings = ({ meetings = [] }) => {
  const router = useRouter();

  return (
    <section className="dashboard-panel mt-6 rounded-xl border border-white/[0.08] bg-slate-950/60 p-6 sm:p-7 shadow-xl backdrop-blur-2xl">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Upcoming Schedule
            <Sparkles size={16} className="text-amber-400" />
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Sync with your calendar to automatically dispatch MeetMind AI bot.
          </p>
        </div>

        <button
          onClick={() => router.push("/integrations")}
          className="self-start sm:self-auto flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
        >
          <Link2 size={13} />
          <span>Sync Calendar</span>
        </button>
      </div>

      {meetings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/30 p-8 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/20 text-amber-400 mb-3">
            <CalendarDays size={20} />
          </div>
          <h3 className="text-sm font-bold text-white">No upcoming meetings scheduled</h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm">
            Connect Google Calendar, Zoom, or Microsoft Teams to view upcoming sessions and schedule automatic transcription.
          </p>
          <button
            onClick={() => router.push("/integrations")}
            className="mt-4 flex items-center gap-2 rounded-xl bg-white/[0.06] border border-white/10 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition"
          >
            <Link2 size={13} />
            <span>Connect Integrations</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              onClick={() => router.push(`/meetings/${meeting.id}`)}
              className="dashboard-row group flex items-center justify-between rounded-xl border border-white/[0.06] bg-slate-900/40 p-4 transition-all duration-300 hover:border-indigo-500/30 hover:bg-slate-900/80 cursor-pointer"
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
                      {meeting.participants} Participant{meeting.participants === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
              </div>

              <ChevronRight size={16} className="text-slate-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default UpcomingMeetings;
