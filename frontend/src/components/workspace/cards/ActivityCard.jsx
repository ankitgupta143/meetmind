"use client";

import { CheckCircle2, MessageSquare, Video, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

const icons = {
  meeting: Video,
  chat: MessageSquare,
  task: CheckCircle2,
};

export default function ActivityCard({ activity }) {
  const router = useRouter();
  const Icon = icons[activity.type] || Video;

  const handleClick = () => {
    if (activity.link) {
      router.push(activity.link);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group flex items-center justify-between gap-3.5 rounded-2xl border border-white/[0.06] bg-slate-900/40 p-3.5 transition hover:border-indigo-500/30 hover:bg-slate-900/70 cursor-pointer"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          <Icon size={14} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
            {activity.title}
          </p>
          <div className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-400">
            <span>{activity.time}</span>
            {activity.meta && (
              <>
                <span>•</span>
                <span className="truncate max-w-[200px] text-slate-500 font-mono">
                  {activity.meta}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <ArrowUpRight
        size={14}
        className="text-slate-500 group-hover:text-indigo-400 transition shrink-0"
      />
    </div>
  );
}
