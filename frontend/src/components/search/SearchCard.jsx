"use client";

import { useRouter } from "next/navigation";
import {
  Calendar,
  CheckSquare,
  FileText,
  Target,
  User,
  Clock3,
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

const typeLabels = {
  meeting: "Meeting",
  action: "Action Item",
  decision: "Decision",
  speaker: "Speaker",
  transcript: "Transcript",
};

export default function SearchCard({ item }) {
  const router = useRouter();
  const Icon = icons[item.type] || icons[item.icon] || FileText;
  const colorClass =
    typeColors[item.type] || typeColors[item.icon] || "bg-white/10 text-white border-white/20";
  const typeLabel =
    typeLabels[item.type] || typeLabels[item.icon] || item.type;

  const handleClick = () => {
    if (item.targetUrl) {
      router.push(item.targetUrl);
    } else if (item.meetingId) {
      router.push(`/meetings/${item.meetingId}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="group flex w-full items-start gap-4 rounded-2xl border border-white/[0.08] bg-slate-950/60 p-4 sm:p-5 text-left transition-all duration-300 hover:border-indigo-500/40 hover:bg-slate-900/80 hover:-translate-y-0.5 cursor-pointer shadow-sm backdrop-blur-xl"
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-sm transition-transform duration-300 group-hover:scale-105 ${colorClass}`}
      >
        <Icon size={18} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-xs sm:text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
            {item.title}
          </h3>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-semibold text-slate-300 capitalize">
              {typeLabel}
            </span>
            <ArrowRight
              size={14}
              className="text-slate-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white"
            />
          </div>
        </div>

        <p className="mt-1.5 text-xs leading-relaxed text-slate-400 line-clamp-2">
          {item.description}
        </p>

        {/* Metadata Badges */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.04] text-[11px] text-slate-400">
          {item.type !== "meeting" && item.meetingTitle && (
            <span className="inline-flex items-center gap-1 rounded-md bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 text-[10px] text-slate-300">
              <Calendar size={10} className="text-indigo-400" />
              <span className="truncate max-w-[160px]">{item.meetingTitle}</span>
            </span>
          )}

          {item.metadata?.timestamp && (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300 font-mono">
              <Clock3 size={10} />
              <span>{item.metadata.timestamp}</span>
            </span>
          )}

          {item.metadata?.speaker && (
            <span className="inline-flex items-center gap-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[10px] text-cyan-300">
              <User size={10} />
              <span>{item.metadata.speaker}</span>
            </span>
          )}

          {item.metadata?.assignee && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300">
              <CheckSquare size={10} />
              <span>Assigned: {item.metadata.assignee}</span>
            </span>
          )}

          {item.metadata?.status && (
            <span className="rounded-md bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              {item.metadata.status}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
