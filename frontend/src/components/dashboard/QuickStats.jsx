"use client";

import {
  CalendarDays,
  CheckCircle2,
  BrainCircuit,
  Clock3,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Meetings",
    value: "24",
    subtitle: "+3 this week",
    icon: CalendarDays,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Action Items",
    value: "127",
    subtitle: "91 Completed",
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "AI Summaries",
    value: "98%",
    subtitle: "Ready",
    icon: BrainCircuit,
    color: "bg-violet-50 text-violet-600",
  },
  {
    title: "Time Saved",
    value: "18 hrs",
    subtitle: "This Month",
    icon: Clock3,
    color: "bg-amber-50 text-amber-600",
  },
];

const QuickStats = () => {
  return (
    <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="group rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
          >
            {/* Icon */}
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color}`}
            >
              <Icon
                size={22}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* Value */}
            <h2 className="mt-8 text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {stat.value}
            </h2>

            {/* Title */}
            <p className="mt-2 text-base font-semibold text-zinc-800 dark:text-zinc-200">
              {stat.title}
            </p>

            {/* Footer */}
            <div className="mt-6 flex items-center gap-2 text-sm text-zinc-500">
              <TrendingUp size={16} />
              <span>{stat.subtitle}</span>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default QuickStats;