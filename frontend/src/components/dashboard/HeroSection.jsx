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
    <section className="dashboard-hero relative overflow-hidden rounded-xl border border-border bg-card p-6 sm:p-8">
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="dashboard-date inline-flex items-center gap-2 rounded-md border border-border bg-surface-raised px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles size={13} className="text-indigo-300" />
            <span>{today}</span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {greeting},{" "}
            <span className="text-indigo-200">
              {userName}
            </span>{" "}
            👋
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            {heroText}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setOpen(true)}
              className="group flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-indigo-200 active:scale-[0.98]"
            >
              <Upload size={16} className="transition-transform group-hover:scale-110" />
              <span>Upload Meeting</span>
            </button>

            <button
              onClick={() => router.push("/meetings")}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-5 py-3 text-sm font-medium text-foreground transition hover:bg-surface-hover active:scale-[0.98]"
            >
              <Search size={16} />
              <span>Browse Meetings</span>
            </button>
          </div>
        </div>

        {/* AI Pulse Badge Card */}
        <div className="dashboard-engine relative rounded-xl border border-border bg-surface-raised p-5 lg:w-72">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">AI Engine</span>
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
