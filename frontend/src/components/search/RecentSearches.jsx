"use client";

import {
  Clock3,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const recent = [
  "Authentication Architecture",
  "Redis Caching Layer",
  "Sprint 14 Planning & Goals",
  "Executive Dashboard Metrics",
  "Backend Audio Processing API",
];

export default function RecentSearches({ onSelect }) {
  return (
    <div className="rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-6 sm:p-8 shadow-xl backdrop-blur-2xl">
      <div className="mb-5 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
          <Clock3 size={16} />
        </div>

        <h3 className="text-sm font-bold text-white">
          Recent Searches
        </h3>
      </div>

      <div className="space-y-2">
        {recent.map((item) => (
          <button
            key={item}
            onClick={() => onSelect(item)}
            className="group flex w-full items-center justify-between rounded-xl border border-white/[0.04] bg-slate-900/40 p-3.5 text-left text-xs font-semibold text-slate-300 transition-all duration-200 hover:border-indigo-500/30 hover:bg-slate-900/80 hover:text-white cursor-pointer"
          >
            <span>{item}</span>

            <ArrowUpRight
              size={15}
              className="text-slate-500 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-indigo-400"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
