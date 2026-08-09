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
    className={`relative rounded-2xl border p-5 text-left transition hover:border-indigo-300 ${selected ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100" : "border-zinc-200 bg-white hover:shadow-md"}`}
  >
    {selected && (
      <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-indigo-600 text-white">
        <Check className="size-3" />
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
      toast.success("You are all set!");
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
        <span className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-200">
          <Sparkles className="size-8" />
        </span>
        <p className="mt-8 text-sm font-bold uppercase tracking-widest text-indigo-600">
          Welcome to MeetMind
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Let&apos;s make every meeting count.
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-7 text-zinc-600">
          We&apos;ll take less than a minute to personalize your workspace.
        </p>
      </div>
    ),
    2: (
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
          Step 2 of 5
        </p>
        <h1 className="mt-3 text-3xl font-bold">What is your role?</h1>
        <p className="mt-2 text-zinc-500">
          We&apos;ll tailor MeetMind to how you work.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4">
          {roles.map((item) => (
            <Card
              key={item}
              selected={role === item}
              onClick={() => setRole(item)}
            >
              <p className="font-semibold">{item}</p>
            </Card>
          ))}
        </div>
      </div>
    ),
    3: (
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
          Step 3 of 5
        </p>
        <h1 className="mt-3 text-3xl font-bold">Where do you meet?</h1>
        <p className="mt-2 text-zinc-500">
          Choose your primary meeting platform.
        </p>
        <div className="mt-8 grid gap-4">
          {platforms.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.id}
                selected={platform === item.id}
                onClick={() => setPlatform(item.id)}
              >
                <span
                  className={`flex size-10 items-center justify-center rounded-xl ${item.color}`}
                >
                  <Icon className="size-5" />
                </span>
                <p className="mt-3 font-semibold">{item.name}</p>
              </Card>
            );
          })}
        </div>
      </div>
    ),
    4: (
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
          Step 4 of 5
        </p>
        <h1 className="mt-3 text-3xl font-bold">Connect your apps.</h1>
        <p className="mt-2 text-zinc-500">
          Bring your work context into MeetMind. You can change this later.
        </p>
        <div className="mt-8 grid gap-4">
          {apps.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.id}
                selected={connected.includes(item.id)}
                onClick={() => toggle(item.id)}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex size-10 items-center justify-center rounded-xl ${item.color}`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <p className="font-semibold">{item.name}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    ),
    5: (
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
          Step 5 of 5
        </p>
        <h1 className="mt-3 text-3xl font-bold">Upload your first meeting.</h1>
        <p className="mx-auto mt-2 max-w-md text-zinc-500">
          Start with a recording and discover what MeetMind can do.
        </p>
        <label className="mt-8 flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-10 transition hover:border-indigo-400">
          <CloudUpload className="size-9 text-indigo-600" />
          <span className="mt-3 font-semibold text-zinc-800">
            {file || "Drop a file here or browse"}
          </span>
          <span className="mt-1 text-sm text-zinc-500">
            MP3, MP4, WAV or M4A
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
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6">
      <div className="w-full max-w-xl rounded-3xl border border-zinc-200 bg-white p-7 shadow-2xl shadow-indigo-100 sm:p-10">
        <div className="mb-10 flex gap-2">
          {[1, 2, 3, 4, 5].map((item) => (
            <span
              key={item}
              className={`h-1.5 flex-1 rounded-full ${item <= step ? "bg-indigo-600" : "bg-zinc-200"}`}
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
        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={() => step > 1 && setStep((current) => current - 1)}
            className={`inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 ${step === 1 ? "invisible" : ""}`}
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
          <div className="flex gap-3">
            {(step === 4 || step === 5) && (
              <button
                onClick={() =>
                  step === 5 ? router.push("/dashboard") : setStep(5)
                }
                className="px-3 text-sm font-semibold text-zinc-500"
              >
                Skip
              </button>
            )}
            <button
              onClick={next}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
            >
              {step === 5 ? "Finish" : "Continue"}
              {step === 5 ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <ArrowRight className="size-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
