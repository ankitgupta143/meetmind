"use client";

import { useRouter } from "next/navigation";
import { Upload, Search, Sparkles, Bot } from "lucide-react";
import { useUploadModal } from "@/context/UploadModalContext";
import { useAuth } from "@/context/AuthContext";

const HeroSection = ({ description, stats }) => {
  const router = useRouter();
  const { setOpen } = useUploadModal();
  const { user } = useAuth();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.name || "there";

  const heroText =
    description ||
    (stats?.totalMeetings > 0
      ? `Your AI assistant has analyzed ${stats.completedMeetings || 0} meetings, extracted ${stats.totalActionItems || 0} action items, and prepared decision summaries for your review.`
      : "Ready to transform today's conversations into clear decisions, action items, and AI-powered insights.");

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/50 p-6 sm:p-9 md:p-10 shadow-2xl backdrop-blur-2xl">
      {/* Aurora light spots */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-violet-600/15 blur-[100px]" />
      <div className="pointer-events-none absolute right-1/3 bottom-0 h-40 w-40 rounded-full bg-cyan-500/15 blur-[80px]" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-3 py-1 text-xs font-bold text-indigo-300 shadow-sm">
            <Sparkles size={13} className="text-cyan-400 animate-pulse" />
            <span>{today}</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {greeting},{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-violet-200 to-cyan-300 bg-clip-text text-transparent">
              {userName}
            </span>{" "}
            👋
          </h1>

          <p className="mt-3 text-xs leading-relaxed text-slate-300 sm:text-sm md:text-base">
            {heroText}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setOpen(true)}
              className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:scale-95"
            >
              <Upload size={16} className="transition-transform group-hover:scale-110" />
              <span>Upload Meeting</span>
            </button>

            <button
              onClick={() => router.push("/meetings")}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs sm:text-sm font-semibold text-slate-200 backdrop-blur-md transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-95"
            >
              <Search size={16} />
              <span>Browse Meetings</span>
            </button>
          </div>
        </div>

        {/* AI Pulse Badge Card */}
        <div className="relative rounded-2xl border border-white/[0.08] bg-slate-900/60 p-5 backdrop-blur-xl shadow-lg lg:w-72">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">AI Engine</span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </span>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-400">
              <Bot size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Groq & Whisper</p>
              <p className="text-[11px] text-slate-400">Audio Diarization Ready</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
