"use client";

import {
  Calendar,
  CheckSquare,
  FileText,
  Target,
  User,
  ArrowRight,
} from "lucide-react";

const icons = {
  meeting: Calendar,
  action: CheckSquare,
  decision: Target,
  speaker: User,
  transcript: FileText,
};

const typeColors = {
  meeting: "bg-indigo-500/15 border-indigo-500/30 text-indigo-400",
  action: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
  decision: "bg-violet-500/15 border-violet-500/30 text-violet-400",
  speaker: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400",
  transcript: "bg-amber-500/15 border-amber-500/30 text-amber-400",
};

export default function SearchCard({
  item,
}) {
  const Icon = icons[item.icon] || FileText;
  const colorClass = typeColors[item.icon] || "bg-white/10 text-white";

  return (
    <button className="group flex w-full items-start gap-4 rounded-2xl border border-white/[0.08] bg-slate-950/60 p-4 sm:p-5 text-left transition-all duration-300 hover:border-indigo-500/40 hover:bg-slate-900/80 hover:-translate-y-0.5 cursor-pointer shadow-sm">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${colorClass}`}>
        <Icon size={18} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-xs sm:text-sm font-bold text-slate-100 group-hover:text-white">
            {item.title}
          </h3>

          <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-semibold capitalize text-slate-400">
            {item.type}
          </span>
        </div>

        <p className="mt-1 text-xs leading-relaxed text-slate-400 line-clamp-2">
          {item.description}
        </p>
      </div>
    </button>
  );
}