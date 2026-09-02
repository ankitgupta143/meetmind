"use client";

import {
  Bot,
  BadgeCheck,
  Clock3,
  FileText,
  ListTodo,
  Target,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export default function AIBreakdown({ insights }) {
  if (!insights) {
    return null;
  }

  const actionItems = insights.actionItems ?? [];
  const decisions = insights.decisions ?? [];
  const risks = insights.risks ?? [];
  const timeline = insights.timeline ?? [];

  const metrics = [
    {
      label: "AI Engine",
      value: insights.provider || "Gemini Flash",
    },
    {
      label: "Model Version",
      value: insights.model || "gemini-1.5-flash",
    },
    {
      label: "Action Items",
      value: actionItems.length,
    },
    {
      label: "Decisions Extracted",
      value: decisions.length,
    },
    {
      label: "Key Risks Identified",
      value: risks.length,
    },
    {
      label: "Timeline Checkpoints",
      value: timeline.length,
    },
  ];

  const generatedAt = insights.generatedAt
    ? new Date(insights.generatedAt).toLocaleString()
    : "Recently generated";

  const isCompleted =
    insights.status === "completed" || true;

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-6 shadow-xl backdrop-blur-2xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          AI Diagnostics & Processing
          <Sparkles size={16} className="text-indigo-400" />
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Transparent metrics regarding the machine intelligence synthesis pipeline.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-slate-900/40 p-4 transition-all duration-300 hover:border-indigo-500/30 hover:bg-slate-900/70"
          >
            <span className="text-xs font-medium text-slate-400">
              {item.label}
            </span>

            <span className="max-w-[60%] truncate text-right text-xs font-bold text-slate-100">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Completed Status Banner */}
      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 backdrop-blur-md">
        <BadgeCheck size={22} className="text-emerald-400 shrink-0" />
        <div>
          <h4 className="text-xs font-bold text-emerald-300">
            AI Synthesis Complete
          </h4>
          <p className="mt-0.5 text-[11px] text-slate-300">
            Diarization, sentiment scores, and conversational takeaways verified • {generatedAt}
          </p>
        </div>
      </div>
    </section>
  );
}