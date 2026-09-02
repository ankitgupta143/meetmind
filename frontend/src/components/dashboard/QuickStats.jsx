"use client";

import {
  CalendarDays,
  CheckCircle2,
  BrainCircuit,
  Clock3,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    title: "Meetings Analyzed",
    value: "24",
    subtitle: "+3 this week",
    icon: CalendarDays,
    bgClass: "from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400",
    hoverGlow: "group-hover:border-blue-500/40 group-hover:shadow-[0_15px_35px_-10px_rgba(59,130,246,0.25)]",
  },
  {
    title: "Action Items",
    value: "127",
    subtitle: "91 Completed (72%)",
    icon: CheckCircle2,
    bgClass: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
    hoverGlow: "group-hover:border-emerald-500/40 group-hover:shadow-[0_15px_35px_-10px_rgba(16,185,129,0.25)]",
  },
  {
    title: "AI Summaries",
    value: "98%",
    subtitle: "Accuracy Index",
    icon: BrainCircuit,
    bgClass: "from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-400",
    hoverGlow: "group-hover:border-violet-500/40 group-hover:shadow-[0_15px_35px_-10px_rgba(139,92,246,0.25)]",
  },
  {
    title: "Time Saved",
    value: "18h",
    subtitle: "+4.2 hrs this month",
    icon: Clock3,
    bgClass: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
    hoverGlow: "group-hover:border-amber-500/40 group-hover:shadow-[0_15px_35px_-10px_rgba(245,158,11,0.25)]",
  },
];

const QuickStats = () => {
  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`group relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-6 shadow-xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 ${stat.hoverGlow}`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br border shadow-md transition-transform duration-300 group-hover:scale-110 ${stat.bgClass}`}
              >
                <Icon size={20} />
              </div>

              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <TrendingUp size={12} />
                <span>Active</span>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {stat.value}
              </h2>

              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {stat.title}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs text-slate-400">
              <span>{stat.subtitle}</span>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
};

export default QuickStats;