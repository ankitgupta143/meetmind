"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileAudio, Sparkles, FileVideo, ShieldCheck } from "lucide-react";

import {
  MAX_UPLOAD_SIZE,
  SUPPORTED_FILE_TYPES,
  UPLOAD_STEPS,
} from "@/constants/upload";

export default function UploadDropzone({ setStep, setSelectedFile }) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;

    if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
      setError(
        "Unsupported file format. Please upload MP3, WAV, M4A, MP4 or MOV."
      );
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      setError("Maximum upload size is 500 MB.");
      return;
    }

    setError("");
    setSelectedFile(file);
    setStep(UPLOAD_STEPS.UPLOADING);
  };

  const handleBrowse = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  return (
    <div className="p-6 sm:p-10">
      {/* Header */}
      <div className="text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-3 py-1 text-xs font-bold text-indigo-300">
          <Sparkles size={13} className="text-cyan-400" />
          <span>AI Audio & Video Ingestion</span>
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Upload Meeting Recording
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          MeetMind automatically extracts transcripts, speaker diarization, executive summaries, decisions, and action items.
        </p>
      </div>

      {/* Feature highlights */}
      <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[
          "Automated Diarization",
          "Executive Summary",
          "Action Items & Tasks",
          "Acoustic Sentiment",
        ].map((item) => (
          <div
            key={item}
            className="rounded-xl border border-white/[0.06] bg-slate-900/40 p-2.5 text-center text-[11px] font-semibold text-slate-300"
          >
            ✓ {item}
          </div>
        ))}
      </div>

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`mt-6 rounded-[2rem] border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 ${
          isDragging
            ? "border-indigo-400 bg-indigo-500/10 scale-[0.99]"
            : "border-white/10 bg-slate-900/30 hover:border-indigo-500/40 hover:bg-slate-900/60"
        }`}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30">
          <UploadCloud size={30} className="animate-bounce" />
        </div>

        <h3 className="mt-5 text-base font-bold text-white sm:text-lg">
          Drag & Drop recording here
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          or click below to choose a file from your device
        </p>

        <button
          onClick={() => inputRef.current?.click()}
          className="mt-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40 active:scale-95"
        >
          Browse Files
        </button>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-medium text-rose-300">
            {error}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          hidden
          accept=".mp3,.wav,.m4a,.mp4,.mov"
          onChange={handleBrowse}
        />

        <div className="mt-6 flex flex-wrap justify-center gap-5 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <FileAudio size={14} className="text-cyan-400" />
            <span>MP3 / WAV / M4A</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <FileVideo size={14} className="text-indigo-400" />
            <span>MP4 / MOV</span>
          </div>
        </div>

        <p className="mt-4 text-[11px] text-slate-500">
          Maximum file size: <strong className="text-slate-400">500 MB</strong> • Privacy preserved
        </p>
      </div>
    </div>
  );
}
