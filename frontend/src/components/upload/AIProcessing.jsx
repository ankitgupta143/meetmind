"use client";

import { useEffect, useState } from "react";
import { BrainCircuit, CheckCircle2, LoaderCircle } from "lucide-react";
import { UPLOAD_STEPS } from "@/constants/upload";

const STEPS = [
  "Upload Complete",
  "Transcribing Audio",
  "Detecting Speakers",
  "Generating Summary",
  "Finding Action Items",
  "Sentiment Analysis",
];

export default function AIProcessing({ setStep }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= STEPS.length) {
      const timer = setTimeout(() => {
        setStep(UPLOAD_STEPS.SUCCESS);
      }, 700);

      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 1200);

    return () => clearTimeout(timer);
  }, [currentStep, setStep]);

  return (
    <div className="p-10">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
          <BrainCircuit className="text-indigo-600" size={38} />
        </div>

        <h2 className="mt-6 text-3xl font-bold">
          AI is analyzing your meeting
        </h2>

        <p className="mt-3 text-zinc-500">
          Please wait while MeetMind generates your transcript,
          summary, action items and analytics.
        </p>
      </div>

      <div className="mt-10 space-y-5">
        {STEPS.map((item, index) => {
          const completed = index < currentStep;
          const active = index === currentStep;

          return (
            <div
              key={item}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{item}</span>

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
    </div>
  );
}