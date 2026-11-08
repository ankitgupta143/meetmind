"use client";

import { CalendarDays, CheckCircle2, MessageSquare, Star } from "lucide-react";

export default function WorkspaceStats({ stats }) {
  const statItems = [
    {
      label: "Saved Meetings",
      value: stats?.totalMeetings ?? 0,
      sublabel: `${stats?.totalHoursRecorded ?? "0 hr"} recorded`,
      icon: CalendarDays,
      color: "bg-indigo-500/15 border-indigo-500/30 text-indigo-400",
    },
    {
      label: "Favorite Meetings",
      value: stats?.favoriteMeetings ?? 0,
      sublabel: "Starred discussions",
      icon: Star,
      color: "bg-amber-500/15 border-amber-500/30 text-amber-400",
    },
    {
      label: "AI Conversations",
      value: stats?.savedConversations ?? 0,
      sublabel: "Saved research sessions",
      icon: MessageSquare,
      color: "bg-violet-500/15 border-violet-500/30 text-violet-400",
    },
    {
      label: "Pending Deliverables",
      value: stats?.pendingActionItems ?? 0,
      sublabel: "Action items to complete",
      icon: CheckCircle2,
      color: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statItems.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="group rounded-2xl border border-white/[0.08] bg-slate-950/60 p-5 shadow-xl backdrop-blur-2xl transition-all duration-300 hover:border-indigo-500/30 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border ${stat.color}`}
              >
                <Icon size={18} />
              </div>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                Live Data
              </span>
            </div>
            <p className="mt-4 text-2xl sm:text-3xl font-extrabold text-white">
              {stat.value}
            </p>
            <p className="mt-0.5 text-xs font-semibold text-slate-300">
              {stat.label}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              {stat.sublabel}
            </p>
          </div>
        );
      })}
    </section>
  );
}
