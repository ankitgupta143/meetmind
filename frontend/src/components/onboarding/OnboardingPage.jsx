"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CloudUpload,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { apps, platforms, roles } from "./data/onboarding";

const Card = ({ selected, onClick, children }) => (
  <button
    onClick={onClick}
    className={`relative rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer ${
      selected
        ? "border-indigo-500/60 bg-indigo-500/15 shadow-md shadow-indigo-500/20"
        : "border-white/[0.08] bg-slate-900/50 hover:border-white/20 hover:bg-slate-900/80"
    }`}
  >
    {selected && (
      <span className="absolute right-3 top-3 flex size-4 items-center justify-center rounded-full bg-indigo-600 text-white">
        <Check className="size-2.5 stroke-[3]" />
      </span>
    )}
    {children}
  </button>
);

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [platform, setPlatform] = useState("");
  const [connected, setConnected] = useState([]);
  const [file, setFile] = useState("");
  const router = useRouter();

  const next = () => {
    if (step === 2 && !role)
      return toast.error("Choose the role that best fits you.");
    if (step === 3 && !platform)
      return toast.error("Choose your primary meeting platform.");
    if (step === 5 && !file)
      return toast.error("Upload a meeting or choose Skip for now.");
    if (step === 5) {
      toast.success("Workspace initialized!");
      router.push("/dashboard");
      return;
    }
    setStep((current) => current + 1);
  };

  const toggle = (id) =>
    setConnected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );

  const screens = {
    1: (
      <div className="text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-600/30">
          <Sparkles className="size-7" />
        </span>
        <p className="mt-6 text-xs font-bold uppercase tracking-widest text-indigo-400">
          Welcome to MeetMind AI
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Make every conversation actionable.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-xs sm:text-sm leading-relaxed text-slate-400">
          Let&apos;s personalize your workspace with your preferred tools and AI synthesis workflows.
        </p>
      </div>
    ),
    2: (
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">What is your primary role?</h2>
        <p className="mt-1 text-xs text-slate-400">
          We&apos;ll tailor summaries, prompt templates, and insights to your workflow.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {roles.map((item) => {
            const id = typeof item === "string" ? item.toLowerCase() : item.id;
            const label = typeof item === "string" ? item : item.label;
            const description = typeof item === "object" ? item.description : "";
            return (
              <Card
                key={id}
                selected={role === id}
                onClick={() => setRole(id)}
              >
                <p className="text-xs font-bold text-white">{label}</p>
                {description && (
                  <p className="mt-0.5 text-[11px] text-slate-400">{description}</p>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    ),
    3: (
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Select your meeting platform</h2>
        <p className="mt-1 text-xs text-slate-400">
          Where do most of your team conversations happen?
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {platforms.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.id}
                selected={platform === item.id}
                onClick={() => setPlatform(item.id)}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {Icon && (
                    <span className="flex size-6 items-center justify-center rounded-lg bg-white/5 text-indigo-400 shrink-0">
                      <Icon className="size-3.5" />
                    </span>
                  )}
                  <p className="text-xs font-bold text-white">{item.name}</p>
                </div>
                {item.description && (
                  <p className="text-[11px] text-slate-400">{item.description}</p>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    ),
    4: (
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Connect workspace apps</h2>
        <p className="mt-1 text-xs text-slate-400">
          Sync action items, transcripts, and reports directly to your productivity stack.
        </p>
        <div className="mt-6 space-y-2.5">
          {apps.map((item) => {
            const isConnected = connected.includes(item.id);
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-slate-900/50 p-3.5"
              >
                <div className="flex items-center gap-3">
                  {Icon && (
                    <span className="flex size-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-indigo-400 shrink-0">
                      <Icon className="size-4" />
                    </span>
                  )}
                  <div>
                    <p className="text-xs font-bold text-white">{item.name}</p>
                    {item.description && (
                      <p className="mt-0.5 text-[11px] text-slate-400">{item.description}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    isConnected
                      ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                      : "bg-indigo-600 text-white hover:bg-indigo-500"
                  }`}
                >
                  {isConnected ? "Connected" : "Connect"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    ),
    5: (
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white">Upload your first recording</h2>
        <p className="mt-1 text-xs text-slate-400">
          Upload an audio or video file to test transcription & AI summary generation.
        </p>
        <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-white/15 bg-slate-900/40 p-8 transition hover:border-indigo-500/40 hover:bg-slate-900/70">
          <CloudUpload className="size-10 text-indigo-400 animate-bounce" />
          <span className="mt-3 text-xs font-bold text-white">
            {file || "Choose an audio or video file"}
          </span>
          <span className="mt-0.5 font-mono text-[10px] text-slate-500">
            MP3, MP4, WAV or M4A • Up to 500MB
          </span>
          <input
            type="file"
            className="sr-only"
            onChange={(event) => setFile(event.target.files?.[0]?.name || "")}
          />
        </label>
      </div>
    ),
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#080c14] p-4 sm:p-6 overflow-hidden">
      {/* Ambient lighting auras */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-indigo-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-violet-600/15 blur-[120px]" />

      <div className="relative z-10 w-full max-w-xl rounded-[2.5rem] border border-white/[0.08] bg-slate-950/70 p-6 shadow-2xl backdrop-blur-2xl sm:p-10">
        <div className="mb-8 flex gap-1.5">
          {[1, 2, 3, 4, 5].map((item) => (
            <span
              key={item}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                item <= step ? "bg-gradient-to-r from-indigo-500 to-cyan-400" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
          >
            {screens[step]}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-5">
          <button
            onClick={() => step > 1 && setStep((current) => current - 1)}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white ${
              step === 1 ? "invisible" : ""
            }`}
          >
            <ArrowLeft className="size-3.5" />
            <span>Back</span>
          </button>

          <div className="flex gap-2.5">
            {(step === 4 || step === 5) && (
              <button
                onClick={() =>
                  step === 5 ? router.push("/dashboard") : setStep(5)
                }
                className="px-3 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Skip
              </button>
            )}
            <button
              onClick={next}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40 active:scale-95 cursor-pointer"
            >
              <span>{step === 5 ? "Finish Setup" : "Continue"}</span>
              {step === 5 ? (
                <CheckCircle2 className="size-3.5" />
              ) : (
                <ArrowRight className="size-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
