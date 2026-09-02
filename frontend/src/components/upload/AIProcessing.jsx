"use client";

import { useEffect, useState } from "react";
import {
  BrainCircuit,
  CheckCircle2,
  LoaderCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";

import api from "@/lib/api";
import { UPLOAD_STEPS } from "@/constants/upload";

const STEPS = [
  "Upload Encrypted & Stored",
  "Transcribing Acoustic Audio Stream",
  "Generating Executive AI Summary",
  "Extracting Action Items & Tasks",
  "Computing Tonal Sentiment & Topics",
];

export default function AIProcessing({
  meeting,
  setStep,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!meeting?._id) {
      setError("Meeting information is missing.");
      return;
    }

    let cancelled = false;
    let timer;

    const checkProcessingStatus = async () => {
      try {
        const response = await api.get(
          `/meetings/${meeting._id}`
        );

        const currentMeeting =
          response.data?.data?.meeting;

        if (!currentMeeting) {
          throw new Error(
            "Meeting information could not be loaded."
          );
        }

        if (cancelled) return;

        const status =
          currentMeeting.processingStatus;

        if (status === "failed") {
          setError(
            currentMeeting.processingError ||
              "Meeting processing failed."
          );
          return;
        }

        if (status === "completed") {
          setCurrentStep(STEPS.length);

          timer = setTimeout(() => {
            if (!cancelled) {
              setStep(UPLOAD_STEPS.SUCCESS);
            }
          }, 700);

          return;
        }

        setCurrentStep((previous) => {
          if (previous >= STEPS.length - 1) {
            return previous;
          }
          return previous + 1;
        });

        timer = setTimeout(
          checkProcessingStatus,
          2000
        );
      } catch (error) {
        if (cancelled) return;
        console.error(
          "Failed to check meeting processing status:",
          error
        );
        timer = setTimeout(
          checkProcessingStatus,
          3000
        );
      }
    };

    checkProcessingStatus();

    return () => {
      cancelled = true;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [meeting, setStep]);

  return (
    <div className="p-6 sm:p-10">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-600/30">
          {error ? (
            <AlertCircle size={28} className="text-rose-300" />
          ) : (
            <BrainCircuit size={28} className="animate-pulse text-cyan-200" />
          )}
        </div>

        <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          {error ? "Processing Failed" : "AI Intelligence Synthesis"}
        </h2>

        <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          {error
            ? error
            : "MeetMind is analyzing speech frequencies, speaker identities, and conversational takeaways."}
        </p>
      </div>

      {!error && (
        <div className="mt-8 space-y-3">
          {STEPS.map((item, index) => {
            const completed = index < currentStep;
            const active = index === currentStep;

            return (
              <div
                key={item}
                className={`rounded-2xl border p-4 transition-all duration-300 ${
                  completed
                    ? "border-emerald-500/30 bg-emerald-500/[0.04]"
                    : active
                    ? "border-indigo-500/40 bg-slate-900/80 shadow-md shadow-indigo-500/10"
                    : "border-white/[0.04] bg-slate-900/20 opacity-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">
                    {item}
                  </span>

                  {completed && (
                    <CheckCircle2
                      className="text-emerald-400"
                      size={18}
                    />
                  )}

                  {active && (
                    <LoaderCircle
                      className="animate-spin text-indigo-400"
                      size={18}
                    />
                  )}
                </div>

                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      completed
                        ? "w-full bg-emerald-400"
                        : active
                        ? "w-2/3 bg-gradient-to-r from-indigo-500 to-cyan-400"
                        : "w-0"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {error && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setStep(UPLOAD_STEPS.IDLE)}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-500"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}