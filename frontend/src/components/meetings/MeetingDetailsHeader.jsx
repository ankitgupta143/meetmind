"use client";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Users,
  Share2,
  Download,
  Sparkles,
} from "lucide-react";

export default function MeetingDetailsHeader() {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Left */}
        <div>
          <button className="mb-5 flex items-center gap-2 text-sm text-zinc-500 transition hover:text-indigo-600">
            <ArrowLeft size={18} />
            Back to Meetings
          </button>

          <h1 className="text-4xl font-bold tracking-tight">
            Weekly Engineering Sync
          </h1>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            <Sparkles size={15} />
            AI Summary Ready
          </div>

          <div className="mt-6 flex flex-wrap gap-6 text-sm text-zinc-500">
            <span className="flex items-center gap-2">
              <CalendarDays size={16} />
              Today • 10:30 AM
            </span>

            <span className="flex items-center gap-2">
              <Clock3 size={16} />
              45 Minutes
            </span>

            <span className="flex items-center gap-2">
              <Users size={16} />
              8 Participants
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-wrap gap-3">
          <button className="rounded-xl border border-zinc-200 px-4 py-2 transition hover:bg-zinc-50">
            <Share2 size={18} />
          </button>

          <button className="rounded-xl border border-zinc-200 px-4 py-2 transition hover:bg-zinc-50">
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