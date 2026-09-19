"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  ArrowRight,
  FileText,
  BrainCircuit,
  ListTodo,
  BarChart3,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

const TOTAL_WAIT_SECONDS = 30;

export default function UploadSuccess({ meeting, setOpen }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_WAIT_SECONDS);

  const generatedItems = [
    {
      icon: FileText,
      title: "Audio Diarization & Transcript",
    },
    {
      icon: BrainCircuit,
      title: "Executive AI Summary",
    },
    {
      icon: ListTodo,
      title: "Action Items & Assigned Tasks",
    },
    {
      icon: BarChart3,
      title: "Sentiment & Topic Analytics",
    },
  ];

  const meetingId = meeting?._id || meeting?.id;

  const handleOpenWorkspace = () => {
    if (!meetingId) {
      console.error("Cannot open workspace: meeting ID is missing.");
      return;
    }
    setIsProcessing(true);
    setTimeLeft(TOTAL_WAIT_SECONDS);
  };

  useEffect(() => {
    if (!isProcessing) return;

    if (timeLeft <= 0) {
      setOpen(false);
      router.push(`/meetings/${meetingId}`);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isProcessing, timeLeft, meetingId, router, setOpen]);

  const progressPercentage = Math.min(
    100,
    Math.round(((TOTAL_WAIT_SECONDS - timeLeft) / TOTAL_WAIT_SECONDS) * 100)
  );

  const getStatusMessage = () => {
    if (timeLeft > 20) {
      return "Processing diarization & resetting AI rate limit headroom...";
    }
    if (timeLeft > 10) {
      return "Synthesizing executive AI summary & key takeaways...";
    }
    if (timeLeft > 2) {
      return "Extracting action items, decisions & participant analytics...";
    }
    return "Finalizing workspace & preparing your dashboard...";
  };

  return (
    <div className="p-6 sm:p-10">
      <div className="text-center">
        <div
          className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border shadow-xl transition-all duration-500 ${
            isProcessing
              ? "border-indigo-500/30 bg-indigo-500/20 text-indigo-400 shadow-indigo-500/20"
              : "border-emerald-500/30 bg-emerald-500/20 text-emerald-400 shadow-emerald-500/20"
          }`}
        >
          {isProcessing ? (
            <BrainCircuit size={36} className="animate-pulse drop-shadow-md text-indigo-400" />
          ) : (
            <CheckCircle2 size={36} className="drop-shadow-md" />
          )}
        </div>

        <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          {isProcessing ? "Finalizing AI Insights..." : "Meeting Intelligence Ready!"}
        </h2>

        <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
          {isProcessing
            ? getStatusMessage()
            : "All audio streams, decisions and action items have been indexed."}
        </p>
      </div>

      {isProcessing && (
        <div className="mt-6 rounded-2xl border border-indigo-500/20 bg-indigo-950/30 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-indigo-300">
              <Sparkles size={14} className="animate-spin text-cyan-400" />
              <span>Generating AI Intelligence</span>
            </span>
            <span className="font-mono text-cyan-300">
              Opening in {timeLeft}s
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              style={{ width: `${progressPercentage}%` }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-1000 ease-linear shadow-lg"
            />
          </div>

          <p className="mt-2.5 text-[11px] text-slate-400 text-center">
            Allowing AI rate-limit buffer before loading full workspace.
          </p>
        </div>
      )}

      <div className="mt-6 rounded-[2rem] border border-white/[0.08] bg-slate-900/40 p-5 backdrop-blur-xl">
        <div className="space-y-2.5">
          {generatedItems.map((item, idx) => {
            const Icon = item.icon;
            // Determine active/done status during processing
            const isItemDone = !isProcessing || timeLeft < TOTAL_WAIT_SECONDS - (idx * 7);

            return (
              <div
                key={item.title}
                className={`flex items-center gap-3.5 rounded-xl border p-3.5 transition-colors duration-300 ${
                  isItemDone
                    ? "border-white/[0.04] bg-slate-900/60"
                    : "border-indigo-500/20 bg-indigo-950/20"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                    isItemDone
                      ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                      : "border-indigo-500/30 bg-indigo-500/20 text-indigo-400"
                  }`}
                >
                  <Icon size={16} />
                </div>

                <span className="flex-1 text-xs font-semibold text-slate-200">
                  {item.title}
                </span>

                {isItemDone ? (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                ) : (
                  <Loader2 size={16} className="animate-spin text-indigo-400" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleOpenWorkspace}
          disabled={!meetingId || isProcessing}
          className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg transition active:scale-95 ${
            isProcessing
              ? "cursor-not-allowed bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 shadow-none"
              : "bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 shadow-indigo-600/25 hover:shadow-indigo-600/40"
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 size={16} className="animate-spin text-cyan-300" />
              <span>Processing Insights ({timeLeft}s)...</span>
            </>
          ) : (
            <>
              <span>Open Meeting Workspace</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}