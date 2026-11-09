"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Users,
  Clock3,
  Sparkles,
  Upload,
} from "lucide-react";
import { useUploadModal } from "@/context/UploadModalContext";

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

const RecentMeetings = ({ meetings = [] }) => {
  const router = useRouter();
  const { setOpen } = useUploadModal();

  return (
    <section className="dashboard-panel mt-6 rounded-xl border border-white/[0.08] bg-slate-950/60 p-6 sm:p-7 shadow-xl backdrop-blur-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Recent Meetings
            <Sparkles size={16} className="text-indigo-400" />
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Pick up where you left off or review AI synthesis reports.
          </p>
        </div>

        <button
          onClick={() => router.push("/meetings")}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
        >
          View all
        </button>
      </div>

      {meetings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/30 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 mb-3">
            <CalendarDays size={22} />
          </div>
          <h3 className="text-sm font-bold text-white">No meetings recorded yet</h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm">
            Upload your audio or video file to start generating automated summaries, action items, and transcripts.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="mt-4 flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition hover:bg-indigo-500 active:scale-95"
          >
            <Upload size={14} />
            <span>Upload Your First Meeting</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <div
              key={meeting.id || meeting._id}
              onClick={() => router.push(`/meetings/${meeting.id || meeting._id}`)}
              className="dashboard-row group flex flex-col gap-4 rounded-xl border border-white/[0.06] bg-slate-900/40 p-4 text-left transition-all duration-300 hover:border-indigo-500/30 hover:bg-slate-900/80 hover:-translate-y-0.5 cursor-pointer sm:flex-row sm:items-center sm:justify-between"
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
                    {meeting.participants} Participant{meeting.participants === 1 ? "" : "s"}
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
      )}
    </section>
  );
};

export default RecentMeetings;
