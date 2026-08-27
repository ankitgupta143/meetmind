"use client";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Users,
  Share2,
  Download,
  Sparkles,
} from "lucide-react";

import { useExportDrawer } from "@/context/ExportDrawerContext";

export default function MeetingDetailsHeader({
  meeting,
}) {
  const router = useRouter();
  const { setOpen } = useExportDrawer();

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    return new Intl.DateTimeFormat(
      "en-US",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    ).format(new Date(date));
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0 Minutes";

    const minutes = Math.round(
      seconds / 60
    );

    if (minutes < 60) {
      return `${minutes} ${
        minutes === 1 ? "Minute" : "Minutes"
      }`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    const remainingMinutes =
      minutes % 60;

    if (!remainingMinutes) {
      return `${hours} ${
        hours === 1 ? "Hour" : "Hours"
      }`;
    }

    return `${hours}h ${remainingMinutes}m`;
  };

  const participantCount =
    meeting.participants?.length || 0;

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <button
            onClick={() =>
              router.push("/meetings")
            }
            className="mb-5 flex items-center gap-2 text-sm text-zinc-500 transition hover:text-indigo-600"
          >
            <ArrowLeft size={18} />
            Back to Meetings
          </button>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {meeting.title}
          </h1>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            <Sparkles size={15} />
            AI Summary Ready
          </div>

          <div className="mt-6 flex flex-wrap gap-6 text-sm text-zinc-500">
            <span className="flex items-center gap-2">
              <CalendarDays size={16} />
              {formatDate(meeting.meetingDate)}
            </span>

            <span className="flex items-center gap-2">
              <Clock3 size={16} />
              {formatDuration(
                meeting.durationSeconds
              )}
            </span>

            <span className="flex items-center gap-2">
              <Users size={16} />
              {participantCount}{" "}
              {participantCount === 1
                ? "Participant"
                : "Participants"}
            </span>
          </div>
        </div>

        <div className="flex w-full flex-wrap gap-3 lg:w-auto">
          <button
            className="rounded-xl border border-zinc-200 px-4 py-2 transition hover:bg-zinc-50"
            title="Share"
          >
            <Share2 size={18} />
          </button>

          <button
            onClick={() => setOpen(true)}
            className="rounded-xl border border-zinc-200 px-4 py-2 transition hover:bg-zinc-50"
            title="Export"
          >
            <Download size={18} />
          </button>

          <button
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 font-medium text-white transition hover:bg-indigo-700"
          >
            <Sparkles size={18} />
            Ask AI
          </button>
        </div>
      </div>
    </div>
  );
}