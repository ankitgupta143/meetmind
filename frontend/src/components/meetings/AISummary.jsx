"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Lightbulb, Target, CheckCircle2, Copy, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function AISummary({ insights }) {
  const [copied, setCopied] = useState(false);

  const overview =
    insights?.summary?.overview?.trim() ||
    "No meeting overview is available yet. Once the transcript is processed, AI will generate a concise executive summary.";

  const keyTakeaways = Array.isArray(insights?.summary?.keyTakeaways)
    ? insights.summary.keyTakeaways
    : [];

  const decisions = Array.isArray(insights?.decisions)
    ? insights.decisions
    : [];

  const actionItems = Array.isArray(insights?.actionItems)
    ? insights.actionItems
    : [];

  const handleCopyOverview = () => {
    if (!overview) return;
    navigator.clipboard.writeText(overview);
    setCopied(true);
    toast.success("Executive summary copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-6 shadow-xl backdrop-blur-2xl transition-all duration-300 hover:border-indigo-500/25"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30">
                <Sparkles size={18} />
              </div>

              <div>
                <h2 className="text-lg font-bold tracking-tight text-white">
                  Executive AI Overview
                </h2>
                <p className="text-xs text-slate-400">
                  Synthesized high-level summary of all topics
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyOverview}
              className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white active:scale-95"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-slate-900/40 p-5 leading-relaxed text-slate-200">
            <p className="text-sm leading-7 sm:text-[15px]">{overview}</p>
          </div>
        </div>
      </motion.div>

      {/* Key Takeaways */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-6 shadow-xl backdrop-blur-2xl"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 shadow-md shadow-amber-500/10">
            <Lightbulb size={18} />
          </div>

          <div>
            <h2 className="text-lg font-bold tracking-tight text-white">
              Key Takeaways
            </h2>
            <p className="text-xs text-slate-400">
              Crucial discussion points & highlights
            </p>
          </div>
        </div>

        {keyTakeaways.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {keyTakeaways.map((takeaway, index) => (
              <div
                key={`${takeaway}-${index}`}
                className="group flex gap-3 rounded-2xl border border-white/[0.06] bg-slate-900/40 p-4 transition-all duration-200 hover:border-amber-500/30 hover:bg-slate-900/70"
              >
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-slate-300 group-hover:text-white">
                  {takeaway}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.04] bg-slate-900/20 p-6 text-center text-xs text-slate-500">
            No key takeaways were identified.
          </div>
        )}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Decisions Made */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-6 shadow-xl backdrop-blur-2xl"
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-500/20 to-purple-500/20 border border-violet-500/30 text-violet-400 shadow-md">
                <Target size={18} />
              </div>

              <div>
                <h2 className="text-lg font-bold tracking-tight text-white">
                  Decisions Made
                </h2>
                <p className="text-xs text-slate-400">
                  Agreed conclusions
                </p>
              </div>
            </div>

            <span className="rounded-full bg-violet-500/15 border border-violet-500/30 px-2.5 py-0.5 text-xs font-semibold text-violet-300">
              {decisions.length}
            </span>
          </div>

          {decisions.length > 0 ? (
            <div className="space-y-3">
              {decisions.map((decision, index) => (
                <div
                  key={`${decision.title}-${index}`}
                  className="rounded-2xl border border-white/[0.06] bg-slate-900/40 p-4 transition hover:border-violet-500/30"
                >
                  <p className="font-semibold text-sm text-slate-100">{decision.title}</p>

                  {decision.description && (
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      {decision.description}
                    </p>
                  )}

                  {decision.owner && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-violet-400">
                      <span>Owner:</span>
                      <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-slate-300">
                        {decision.owner}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/[0.04] bg-slate-900/20 p-6 text-center text-xs text-slate-500">
              No decisions recorded yet.
            </div>
          )}
        </motion.div>

        {/* Next Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-6 shadow-xl backdrop-blur-2xl"
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 shadow-md">
                <CheckCircle2 size={18} />
              </div>

              <div>
                <h2 className="text-lg font-bold tracking-tight text-white">
                  Next Actions
                </h2>
                <p className="text-xs text-slate-400">
                  Extracted follow-up tasks
                </p>
              </div>
            </div>

            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
              {actionItems.length}
            </span>
          </div>

          {actionItems.length > 0 ? (
            <div className="space-y-3">
              {actionItems.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="rounded-2xl border border-white/[0.06] bg-slate-900/40 p-4 transition hover:border-emerald-500/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-sm text-slate-100">
                      {item.title}
                    </p>

                    {item.priority && (
                      <span className="shrink-0 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                        {item.priority}
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      {item.description}
                    </p>
                  )}

                  {item.assignee && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                      <span>Assigned to:</span>
                      <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-slate-200">
                        {item.assignee}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/[0.04] bg-slate-900/20 p-6 text-center text-xs text-slate-500">
              No action items recorded yet.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
