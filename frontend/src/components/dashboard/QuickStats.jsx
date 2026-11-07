"use client";

import {
  CalendarDays,
  CheckCircle2,
  BrainCircuit,
  Clock3,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

const defaultCardsConfig = [
  {
    key: "meetings",
    title: "Meetings Analyzed",
    defaultVal: "0",
    defaultSub: "0 this week",
    icon: CalendarDays,
    bgClass: "from-blue-500/20 via-indigo-500/15 to-transparent border-blue-500/30 text-blue-400",
    topLine: "group-hover:via-blue-400/60",
    hoverGlow: "group-hover:border-blue-500/40 group-hover:shadow-[0_15px_35px_-10px_rgba(59,130,246,0.25)]",
  },
  {
    key: "actionItems",
    title: "Action Items",
    defaultVal: "0",
    defaultSub: "0 Completed (0%)",
    icon: CheckCircle2,
    bgClass: "from-emerald-500/20 via-teal-500/15 to-transparent border-emerald-500/30 text-emerald-400",
    topLine: "group-hover:via-emerald-400/60",
    hoverGlow: "group-hover:border-emerald-500/40 group-hover:shadow-[0_15px_35px_-10px_rgba(16,185,129,0.25)]",
  },
  {
    key: "aiSummaries",
    title: "AI Summaries",
    defaultVal: "98%",
    defaultSub: "Accuracy Index",
    icon: BrainCircuit,
    bgClass: "from-violet-500/20 via-purple-500/15 to-transparent border-violet-500/30 text-violet-400",
    topLine: "group-hover:via-violet-400/60",
    hoverGlow: "group-hover:border-violet-500/40 group-hover:shadow-[0_15px_35px_-10px_rgba(139,92,246,0.25)]",
  },
  {
    key: "timeSaved",
    title: "Time Saved",
    defaultVal: "0h",
    defaultSub: "+0 hrs this month",
    icon: Clock3,
    bgClass: "from-amber-500/20 via-orange-500/15 to-transparent border-amber-500/30 text-amber-400",
    topLine: "group-hover:via-amber-400/60",
    hoverGlow: "group-hover:border-amber-500/40 group-hover:shadow-[0_15px_35px_-10px_rgba(245,158,11,0.25)]",
  },
];

const QuickStats = ({ stats, quickStats }) => {
  // If backend provided pre-formatted quickStats array, map values into styled cards
  const cards = defaultCardsConfig.map((config, index) => {
    let value = config.defaultVal;
    let subtitle = config.defaultSub;

    if (Array.isArray(quickStats) && quickStats[index]) {
      value = quickStats[index].value ?? value;
      subtitle = quickStats[index].subtitle ?? subtitle;
    } else if (stats) {
      if (config.key === "meetings") {
        value = String(stats.completedMeetings ?? 0);
        subtitle = `+${stats.newMeetingsThisWeek ?? 0} this week`;
      } else if (config.key === "actionItems") {
        value = String(stats.totalActionItems ?? 0);
        subtitle = `${stats.completedActionItems ?? 0} Completed (${stats.actionItemsCompletionRate ?? 0}%)`;
      } else if (config.key === "aiSummaries") {
        value = (stats.completedMeetings ?? 0) > 0 ? "98%" : "Ready";
        subtitle = "Accuracy Index";
      } else if (config.key === "timeSaved") {
        value = `${stats.timeSavedHours ?? 0}h`;
        subtitle = `+${stats.recentTimeSavedHours ?? 0} hrs this month`;
      }
    }

    return {
      ...config,
      value,
      subtitle,
    };
  });

  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`group relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-b from-slate-900/70 via-slate-900/40 to-slate-950/80 p-6 shadow-xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 ${stat.hoverGlow}`}
          >
            {/* Top specular highlight line with linear gradient */}
            <div className={`pointer-events-none absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-opacity duration-300 ${stat.topLine}`} />

            <div className="flex items-center justify-between">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br border shadow-md transition-transform duration-300 group-hover:scale-110 ${stat.bgClass}`}
              >
                <Icon size={20} />
              </div>

              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
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
