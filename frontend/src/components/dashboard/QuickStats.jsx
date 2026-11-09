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
    bgClass: "bg-indigo-300/10 border-indigo-300/20 text-indigo-200",
    topLine: "group-hover:via-blue-400/60",
    hoverGlow: "hover:border-indigo-300/30",
  },
  {
    key: "actionItems",
    title: "Action Items",
    defaultVal: "0",
    defaultSub: "0 Completed (0%)",
    icon: CheckCircle2,
    bgClass: "bg-emerald-400/10 border-emerald-400/20 text-emerald-300",
    topLine: "group-hover:via-emerald-400/60",
    hoverGlow: "hover:border-emerald-400/30",
  },
  {
    key: "aiSummaries",
    title: "AI Summaries",
    defaultVal: "98%",
    defaultSub: "Accuracy Index",
    icon: BrainCircuit,
    bgClass: "bg-violet-400/10 border-violet-400/20 text-violet-300",
    topLine: "group-hover:via-violet-400/60",
    hoverGlow: "hover:border-violet-400/30",
  },
  {
    key: "timeSaved",
    title: "Time Saved",
    defaultVal: "0h",
    defaultSub: "+0 hrs this month",
    icon: Clock3,
    bgClass: "bg-amber-400/10 border-amber-400/20 text-amber-300",
    topLine: "group-hover:via-amber-400/60",
    hoverGlow: "hover:border-amber-400/30",
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
            className={`dashboard-stat-card group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors duration-200 ${stat.hoverGlow}`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${stat.bgClass}`}
              >
                <Icon size={20} />
              </div>

              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                <TrendingUp size={12} />
                <span>Active</span>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                {stat.value}
              </h2>

              <p className="mt-1 text-xs font-medium text-muted-foreground">
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
