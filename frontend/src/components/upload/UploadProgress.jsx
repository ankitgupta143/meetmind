"use client";

import { useEffect, useRef, useState } from "react";
import { UploadCloud, FileAudio, FileVideo, Sparkles } from "lucide-react";
import { UPLOAD_STEPS } from "@/constants/upload";
import api from "@/lib/api";

export default function UploadProgress({
  file,
  setStep,
  setMeeting,
}) {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!file) {
      setError("No recording selected.");
      return;
    }

    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const uploadMeeting = async () => {
      try {
        setError("");
        setProgress(0);

        const formData = new FormData();
        formData.append("recording", file);

        const response = await api.post("/meetings", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (event) => {
            if (!event.total) return;
            const percentage = Math.round(
              (event.loaded * 100) / event.total
            );
            setProgress(percentage);
          },
        });

        const meeting = response.data?.data?.meeting;

        if (!meeting?._id) {
          throw new Error(
            "Meeting was uploaded but no meeting ID was returned."
          );
        }

        setMeeting(meeting);
        setProgress(100);

        setTimeout(() => {
          setStep(UPLOAD_STEPS.PROCESSING);
        }, 500);
      } catch (error) {
        hasStartedRef.current = false;
        console.error("Meeting upload failed:", error);

        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to upload meeting."
        );
      }
    };

    uploadMeeting();
  }, [file, setMeeting, setStep]);

  const isVideo = file?.type?.startsWith("video");

  const formatSize = (bytes) => {
    if (!bytes) return "0 MB";
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="p-6 sm:p-10">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30">
          <UploadCloud size={28} className="animate-pulse" />
        </div>

        <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Uploading Recording
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          Encrypting and securely uploading to MeetMind AI servers.
        </p>
      </div>

      <div className="mt-8 rounded-[2rem] border border-white/[0.08] bg-slate-900/40 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
            {isVideo ? (
              <FileVideo size={20} />
            ) : (
              <FileAudio size={20} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xs font-bold text-white">
              {file?.name}
            </h3>

            <p className="text-[11px] text-slate-400">
              {formatSize(file?.size)}
            </p>
          </div>

          <span className="font-mono text-xs font-bold text-indigo-400">
            {progress}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-800/80 border border-white/[0.06]">
          <div
            style={{ width: `${progress}%` }}
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 transition-all duration-500 ease-out shadow-md"
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>{error ? "Upload Failed" : "Streaming bytes..."}</span>
          <span>
            {((file?.size * progress) / 100 / 1024 / 1024).toFixed(1)} / {formatSize(file?.size)}
          </span>
        </div>

        {error && (
          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-300">
              {error}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(UPLOAD_STEPS.IDLE)}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}