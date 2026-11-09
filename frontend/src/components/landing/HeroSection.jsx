"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, CheckCircle2, Play, Sparkles, TrendingUp, Users } from "lucide-react";

const DashboardPreview = () => (
  <motion.div
    initial={{ opacity: 0, y: 25 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.25, duration: 0.6 }}
    className="relative rounded-[2rem] sm:rounded-[2.5rem] border border-white/[0.12] bg-gradient-to-b from-slate-900/85 via-slate-950/90 to-[#0b0f19] p-3.5 sm:p-5 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
  >
    {/* Top specular highlight line */}
    <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />

    {/* Window Controls */}
    <div className="flex h-9 items-center justify-between border-b border-white/[0.08] px-2 sm:px-3 pb-2">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="size-2 sm:size-2.5 rounded-full bg-rose-500/80" />
        <span className="size-2 sm:size-2.5 rounded-full bg-amber-500/80" />
        <span className="size-2 sm:size-2.5 rounded-full bg-emerald-500/80" />
        <span className="ml-2 sm:ml-3 h-2.5 sm:h-3 w-16 sm:w-28 rounded-full bg-white/[0.06]" />
      </div>
      <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 sm:px-2.5 py-0.5 rounded-full">
        <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
        <span>Live Diarization</span>
      </div>
    </div>

    {/* Mockup Body */}
    <div className="grid grid-cols-1 sm:grid-cols-[90px_1fr] md:grid-cols-[105px_1fr] gap-3 sm:gap-4 p-1.5 sm:p-4">
      {/* Mock Sidebar (Desktop/Tablet) */}
      <div className="hidden sm:block space-y-3 border-r border-white/[0.06] pr-3">
        <div className="h-7 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-indigo-600/30" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 rounded-lg bg-white/[0.05]" />
        ))}
      </div>

      {/* Mock Content */}
      <div className="min-w-0">
        <div className="flex items-start sm:items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs sm:text-sm font-bold text-white">Sprint Planning & Architecture</p>
            <p className="mt-0.5 text-[10px] sm:text-[11px] text-slate-400">42 mins • 6 participants</p>
          </div>
          {/* Animated Waveform */}
          <div className="flex shrink-0 items-center gap-1 h-5 px-2 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/20">
            <div className="w-1 rounded-full bg-cyan-400 wave-bar-1" />
            <div className="w-1 rounded-full bg-indigo-400 wave-bar-2" />
            <div className="w-1 rounded-full bg-violet-400 wave-bar-3" />
            <div className="w-1 rounded-full bg-cyan-400 wave-bar-4" />
          </div>
        </div>

        {/* Quick Stat Tiles with linear gradients */}
        <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-1.5 sm:gap-3">
          {[
            { label: "Decisions", val: "4 Key", color: "from-indigo-500/20 to-blue-500/10 border-indigo-500/30 text-indigo-300" },
            { label: "Action Items", val: "12 Tasks", color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300" },
            { label: "Sentiment", val: "94% Pos", color: "from-violet-500/20 to-purple-500/10 border-violet-500/30 text-violet-300" },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-xl border bg-gradient-to-br p-2 sm:p-3 ${item.color} backdrop-blur-md`}
            >
              <p className="text-xs sm:text-sm font-bold text-white whitespace-nowrap">{item.val}</p>
              <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 truncate">{item.label}</p>
            </div>
          ))}
        </div>

        {/* AI Key Insights Snippet */}
        <div className="mt-3 sm:mt-3.5 rounded-xl border border-white/[0.08] bg-slate-900/60 p-2.5 sm:p-3 backdrop-blur-md">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-cyan-300">
            <Bot size={14} className="text-cyan-400 shrink-0" />
            <span>AI Executive Synthesis</span>
          </div>
          <p className="mt-1.5 text-[10px] sm:text-[11px] leading-relaxed text-slate-300">
            Database migration approved for Friday 10 PM. Frontend onboarding flow sprint locked with team consensus.
          </p>
          <div className="mt-2.5 h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400" />
          </div>
        </div>
      </div>
    </div>

    {/* Floating Badge */}
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="mt-3 sm:mt-0 sm:absolute sm:-bottom-5 sm:-left-6 rounded-2xl border border-emerald-500/30 bg-slate-900/95 p-2.5 sm:px-4 sm:py-3 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
          <CheckCircle2 size={16} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-bold text-emerald-400 truncate">✦ AI Action Summary Ready</p>
          <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">12 tasks auto-assigned & synced</p>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 lg:pt-28 lg:pb-36">
      {/* Background Gradient Mesh */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-[550px] w-full max-w-5xl bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <div>
          {/* AI Pill Badge with Linear Gradient Border */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-cyan-500/15 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 shadow-lg shadow-indigo-500/10 backdrop-blur-md">
            <Sparkles className="size-3.5 text-cyan-400 animate-pulse" />
            <span>Next-Gen AI Meeting Intelligence</span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.08]">
            Meetings that{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              remember
            </span>{" "}
            everything.
          </h1>

          <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-slate-300">
            Transform chaotic meetings into instant searchable knowledge, action items, executive summaries, and decisions—without lifting a finger.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-6 py-4 text-sm sm:text-base font-semibold text-white shadow-xl shadow-indigo-600/30 transition-all duration-300 hover:shadow-indigo-600/50 hover:-translate-y-0.5 active:scale-95"
            >
              <span>Get Started Free</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.12] bg-white/[0.04] px-6 py-4 text-sm sm:text-base font-semibold text-slate-200 backdrop-blur-xl transition-all duration-200 hover:bg-white/[0.08] hover:border-indigo-500/40 hover:text-white active:scale-95"
            >
              <Play className="size-4 fill-current text-indigo-400" />
              <span>Watch Product Tour</span>
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-4 text-xs sm:text-sm text-slate-400">
            <div className="flex -space-x-2">
              {["bg-indigo-600", "bg-violet-600", "bg-cyan-600", "bg-emerald-600"].map((bg, idx) => (
                <div
                  key={idx}
                  className={`flex size-7 items-center justify-center rounded-full border-2 border-[#070a13] ${bg} text-[10px] font-bold text-white shadow-sm`}
                >
                  {["AK", "SL", "MR", "JD"][idx]}
                </div>
              ))}
            </div>
            <p>
              <span className="font-semibold text-white">4.9/5</span> from 10,000+ meeting leaders worldwide
            </p>
          </div>
        </div>

        <div className="relative mt-4 lg:mt-0">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}

