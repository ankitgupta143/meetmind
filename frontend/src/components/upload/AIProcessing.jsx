"use client";

import { useEffect, useState } from "react";
import {
  BrainCircuit,
  CheckCircle2,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import api from "@/lib/api";
import { UPLOAD_STEPS } from "@/constants/upload";

const STEPS = [
  "Upload Complete",
  "Transcribing Audio",
  "Generating Summary",
  "Finding Action Items",
  "Analyzing Meeting Insights",
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

        // Backend is still processing.
        // Move the visual progress forward based
        // on elapsed polling cycles.
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

        // Don't immediately fail because of a
        // temporary network error.
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
    <div className="p-10">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
          {error ? (
            <AlertCircle
              className="text-red-600"
              size={38}
            />
          ) : (
            <BrainCircuit
              className="text-indigo-600"
              size={38}
            />
          )}
        </div>

        <h2 className="mt-6 text-3xl font-bold">
          {error
            ? "Processing Failed"
            : "AI is analyzing your meeting"}
        </h2>

        <p className="mt-3 text-zinc-500">
          {error
            ? error
            : "Please wait while MeetMind generates your transcript, summary, action items and analytics."}
        </p>
      </div>

      {!error && (
        <div className="mt-10 space-y-5">
          {STEPS.map((item, index) => {
            const completed =
              index < currentStep;

            const active =
              index === currentStep;

            return (
              <div
                key={item}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {item}
                  </span>

                  {completed && (
                    <CheckCircle2
                      className="text-emerald-600"
                      size={22}
                    />
                  )}

                  {active && (
                    <LoaderCircle
                      className="animate-spin text-indigo-600"
                      size={22}
                    />
                  )}
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-200">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      completed
                        ? "w-full bg-emerald-500"
                        : active
                        ? "w-2/3 bg-indigo-600"
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
        <div className="mt-8 flex justify-end">
          <button
            onClick={() =>
              setStep(UPLOAD_STEPS.IDLE)
            }
            className="rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}