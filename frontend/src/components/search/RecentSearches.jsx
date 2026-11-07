"use client";

import { Clock3, ArrowUpRight, Sparkles, Trash2 } from "lucide-react";

const suggested = [
  "Action Items",
  "Sprint Planning",
  "Roadmap",
  "Decisions",
  "Deployment",
];

export default function RecentSearches({
  searches = [],
  onSelect,
  onClear,
}) {
  const hasHistory = Array.isArray(searches) && searches.length > 0;
  const items = hasHistory ? searches : suggested;

  return (
    <div className="rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-6 sm:p-8 shadow-xl backdrop-blur-2xl">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            {hasHistory ? <Clock3 size={16} /> : <Sparkles size={16} />}
          </div>

          <h3 className="text-sm font-bold text-white">
            {hasHistory ? "Recent Searches" : "Suggested Topics"}
          </h3>
        </div>

        {hasHistory && onClear && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-rose-400 transition cursor-pointer"
            title="Clear search history"
          >
            <Trash2 size={12} />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="space-y-2">
        {items.map((item) => (
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
