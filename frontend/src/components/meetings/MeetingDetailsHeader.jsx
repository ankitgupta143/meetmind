"use client";

import { useExportDrawer } from "@/context/ExportDrawerContext";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Users,
  Share2,
  Download,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function MeetingDetailsHeader({ meeting }) {
  const router = useRouter();
  const { setOpen } = useExportDrawer();

  const participantCount = meeting?.participants?.length ?? 0;
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Left */}
        <div>
          <button
            onClick={() => router.push("/meetings")}
            className="mb-5 flex items-center gap-2 text-sm text-zinc-500 transition hover:text-indigo-600"
          >
            <ArrowLeft size={18} />
            Back to Meetings
          </button>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {meeting.title}
          </h1>

          {meeting.processingStatus === "completed" && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              <Sparkles size={15} />
              AI Summary Ready
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-6 text-sm text-zinc-500">
            <span className="flex items-center gap-2">
              <CalendarDays size={16} />
              {formatMeetingDate(meeting.meetingDate)}
            </span>

            <span className="flex items-center gap-2">
              <Clock3 size={16} />
              {formatMeetingDuration(meeting.durationSeconds)}
            </span>

            <span className="flex items-center gap-2">
              <Users size={16} />
              {participantCount} Participants
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex w-full flex-wrap gap-3 lg:w-auto">
          <button className="rounded-xl border border-zinc-200 px-4 py-2 transition hover:bg-zinc-50">
            <Share2 size={18} />
          </button>

          <button
            className="rounded-xl border border-zinc-200 px-4 py-2 transition hover:bg-zinc-50"
            onClick={() => setOpen(true)}
          >
            <Download size={18} />
          </button>

          <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 font-medium text-white transition hover:bg-indigo-700">
            <Sparkles size={18} />
            Ask AI
          </button>
        </div>
      </div>
    </div>
  );
}
