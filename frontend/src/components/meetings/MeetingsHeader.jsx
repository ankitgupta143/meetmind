"use client";

import { Upload, Sparkles } from "lucide-react";
import { useUploadModal } from "@/context/UploadModalContext";

export default function MeetingsHeader() {
  const { setOpen } = useUploadModal();

  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5 sm:text-3xl">
          Meetings
          <Sparkles size={20} className="text-indigo-400" />
        </h1>
        <p className="mt-1 text-xs text-slate-400 sm:text-sm">
          Browse, search and deep-dive into AI-processed conversation intelligence.
        </p>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:scale-95"
      >
        <Upload size={16} className="transition-transform group-hover:scale-110" />
        <span>Upload Meeting</span>
      </button>
    </div>
  );
}