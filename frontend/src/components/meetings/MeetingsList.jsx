"use client";

import { motion } from "framer-motion";
import MeetingCard from "./MeetingCard";
import { CalendarDays, Sparkles } from "lucide-react";
import { useUploadModal } from "@/context/UploadModalContext";

export default function MeetingsList({ meetings = [], loading, error }) {
  const { setOpen } = useUploadModal();

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-12 text-center shadow-xl backdrop-blur-2xl">
        <div className="inline-flex h-10 w-10 animate-spin items-center justify-center rounded-full border-2 border-indigo-500 border-t-transparent" />
        <p className="mt-4 text-xs font-medium text-slate-400">Loading your meeting archive...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-rose-500/20 bg-slate-950/60 p-10 text-center shadow-xl backdrop-blur-2xl">
        <p className="text-sm font-semibold text-rose-400">{error}</p>
      </div>
    );
  }

  if (!meetings.length) {
    return (
      <div className="rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-12 text-center shadow-xl backdrop-blur-2xl">
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
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 active:scale-95"
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