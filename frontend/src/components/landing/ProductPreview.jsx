"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Bot, Calendar, CheckSquare, Sparkles, TrendingUp, Users } from "lucide-react";

const views = {
  Dashboard: {
    title: "Executive overview & live intelligence",
    badge: "Live Workspace",
    items: [
      { label: "Today's Agenda", val: "4 scheduled meetings", icon: Calendar, color: "from-blue-500/20 to-indigo-500/20 text-blue-400" },
      { label: "Pending Decisions", val: "3 summaries ready for signoff", icon: CheckSquare, color: "from-emerald-500/20 to-teal-500/20 text-emerald-400" },
      { label: "Team Velocity", val: "94% commitment score", icon: TrendingUp, color: "from-violet-500/20 to-purple-500/20 text-violet-400" },
    ],
  },
  Workspace: {
    title: "Centralized meeting knowledge graph",
    badge: "Connected Knowledge",
    items: [
      { label: "Product Roadmap", val: "18 meetings indexed", icon: Sparkles, color: "from-indigo-500/20 to-cyan-500/20 text-cyan-400" },
      { label: "Customer Discovery", val: "42 user interviews transcribed", icon: Users, color: "from-pink-500/20 to-rose-500/20 text-pink-400" },
      { label: "Sprint Retrospectives", val: "100% action item tracking", icon: CheckSquare, color: "from-amber-500/20 to-orange-500/20 text-amber-400" },
    ],
  },
  "AI Assistant": {
    title: "Ask anything across months of discussions",
    badge: "Contextual Copilot",
    items: [
      { label: "Architecture Sync", val: "Extracted API schema decisions", icon: Bot, color: "from-cyan-500/20 to-blue-500/20 text-cyan-300" },
      { label: "Executive Synthesis", val: "Generated board update briefing", icon: Sparkles, color: "from-violet-500/20 to-indigo-500/20 text-violet-400" },
      { label: "Risk Radar", val: "Flagged 2 blocker dependencies", icon: TrendingUp, color: "from-rose-500/20 to-pink-500/20 text-rose-400" },
    ],
  },
};

export default function ProductPreview() {
  const [tab, setTab] = useState("Dashboard");

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 h-[350px] w-3/4 max-w-3xl bg-indigo-600/10 blur-[130px]" />

      <div className="relative text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full inline-block">
          One intelligent command center
        </p>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          A crystal clear view of{" "}
          <span className="bg-gradient-to-r from-indigo-300 via-violet-200 to-cyan-300 bg-clip-text text-transparent">
            your momentum
          </span>
          .
        </h2>
      </div>

      <div className="relative mt-12 overflow-hidden rounded-[2.5rem] border border-white/[0.1] bg-gradient-to-b from-slate-900/80 via-slate-950/85 to-[#080c14] p-3 sm:p-5 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        {/* Specular highlight */}
        <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 border-b border-white/[0.08] p-2">
          {Object.keys(views).map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`relative rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                tab === item
                  ? "text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {tab === item && (
                <motion.div
                  layoutId="productTabActive"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 shadow-md shadow-indigo-600/30"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-72 p-5 sm:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                {views[tab].badge}
              </span>
              <h3 className="mt-1 text-xl sm:text-2xl font-bold text-white">
                {views[tab].title}
              </h3>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {views[tab].items.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="group rounded-2xl border border-white/[0.08] bg-slate-900/60 p-5 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/30 hover:bg-slate-900/80"
                >
                  <div className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br border border-white/10 ${item.color}`}>
                    <Icon size={18} />
                  </div>
                  <p className="mt-4 text-xs font-medium text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm sm:text-base font-bold text-white">
                    {item.val}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

