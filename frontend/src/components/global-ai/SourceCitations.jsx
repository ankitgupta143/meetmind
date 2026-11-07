"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, ExternalLink, FileText, User, ChevronDown, ChevronUp } from "lucide-react";

/**
 * Format seconds into HH:MM:SS or MM:SS
 */
function formatTime(seconds) {
  if (typeof seconds !== "number" || isNaN(seconds) || seconds < 0) return null;
  const totalSeconds = Math.floor(seconds);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hrs > 0) {
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function SourceCitations({ sources = [] }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!Array.isArray(sources) || sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-3.5 pt-3 border-t border-white/[0.08]">
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-300 hover:text-indigo-200 transition cursor-pointer"
        >
          <FileText size={13} className="text-indigo-400" />
          <span>
            Referenced Sources ({sources.length})
          </span>
          {isExpanded ? (
            <ChevronUp size={12} className="text-slate-400" />
          ) : (
            <ChevronDown size={12} className="text-slate-400" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-2 mt-2">
          {sources.map((source, idx) => {
            const timeStr = formatTime(source.startTime);
            const meetingHref = `/meetings/${source.meetingId}`;

            return (
              <div
                key={`${source.meetingId}-${idx}`}
                className="group rounded-xl border border-white/[0.06] bg-slate-950/50 p-2.5 transition hover:border-indigo-500/30 hover:bg-slate-950/80"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="shrink-0 flex h-4 w-4 items-center justify-center rounded bg-indigo-500/20 text-[10px] font-bold text-indigo-400">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-200 truncate">
                      {source.meetingTitle || "Meeting Reference"}
                    </span>
                  </div>

                  <Link
                    href={meetingHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-300 hover:bg-indigo-600 hover:text-white transition shrink-0"
                    title="Open meeting workspace in new tab"
                  >
                    <span>Open Meeting</span>
                    <ExternalLink size={10} />
                  </Link>
                </div>

                {source.excerpt && (
                  <p className="border-l-2 border-indigo-500/40 pl-2 text-[11px] leading-relaxed text-slate-300 italic line-clamp-3">
                    "{source.excerpt}"
                  </p>
                )}

                {(timeStr || source.speaker) && (
                  <div className="flex flex-wrap items-center gap-2 mt-2 pt-1.5 border-t border-white/[0.04] text-[10px] text-slate-400">
                    {source.speaker && (
                      <span className="inline-flex items-center gap-1">
                        <User size={10} className="text-slate-400" />
                        <span className="text-slate-300 font-medium">
                          {source.speaker}
                        </span>
                      </span>
                    )}

                    {timeStr && (
                      <span className="inline-flex items-center gap-1">
                        <Clock size={10} className="text-indigo-400" />
                        <span className="text-indigo-300 font-medium">
                          {timeStr}
                        </span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
