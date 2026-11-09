"use client";

import { motion } from "framer-motion";
import MeetingCard from "./MeetingCard";
import { CalendarDays, Sparkles, FilterX } from "lucide-react";
import { useUploadModal } from "@/context/UploadModalContext";

export default function MeetingsList({
  meetings = [],
  loading,
  error,
  isFiltered = false,
  onClearFilters,
}) {
  const { setOpen } = useUploadModal();

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <div className="inline-flex h-10 w-10 animate-spin items-center justify-center rounded-full border-2 border-indigo-500 border-t-transparent" />
        <p className="mt-4 text-xs font-medium text-slate-400">Loading your meeting archive...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-500/20 bg-card p-10 text-center">
        <p className="text-sm font-semibold text-rose-400">{error}</p>
      </div>
    );
  }

  if (!meetings.length) {
    if (isFiltered) {
      return (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <FilterX size={24} />
          </div>
          <h3 className="mt-4 text-base font-bold text-white">
            No matching meetings found
          </h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
            We couldn&apos;t find any meetings matching your search and status filter.
          </p>
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/[0.06] border border-white/10 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer"
            >
              <span>Clear Search & Filters</span>
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
          <CalendarDays size={24} />
        </div>
        <h3 className="mt-4 text-base font-bold text-white">
          No meetings recorded yet
        </h3>
        <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
          Upload an audio or video file to trigger automatic AI diarization, transcription, and action item synthesis.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 active:scale-95 cursor-pointer"
        >
          <Sparkles size={14} />
          <span>Upload First Meeting</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {meetings.map((meeting, index) => (
        <motion.div
          key={meeting.id || index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: index * 0.04 }}
        >
          <MeetingCard meeting={meeting} />
        </motion.div>
      ))}
    </div>
  );
}
