"use client";

import {
  Bot,
  BadgeCheck,
  Clock3,
  FileText,
  ListTodo,
  Target,
  AlertTriangle,
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
      label: "AI Provider",
      value: insights.provider || "—",
    },
    {
      label: "AI Model",
      value: insights.model || "—",
    },
    {
      label: "Action Items",
      value: actionItems.length,
    },
    {
      label: "Decisions",
      value: decisions.length,
    },
    {
      label: "Risks Detected",
      value: risks.length,
    },
    {
      label: "Timeline Events",
      value: timeline.length,
    },
  ];

  const generatedAt = insights.generatedAt
    ? new Date(insights.generatedAt).toLocaleString()
    : "Not available";

  const isCompleted =
    insights.status === "completed";

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">
          AI Processing Report
        </h2>

        <p className="mt-2 text-sm text-zinc-500">
          Transparent overview of the AI-generated meeting analysis.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-5 transition-all duration-300 hover:border-indigo-200 hover:bg-white"
          >
            <span className="text-sm font-medium text-zinc-600">
              {item.label}
            </span>

            <span className="max-w-[60%] truncate text-right text-lg font-semibold text-zinc-900">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Generated At */}
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
        <Clock3
          size={20}
          className="shrink-0 text-zinc-500"
        />

        <div>
          <p className="text-sm font-medium text-zinc-600">
            Generated At
          </p>

          <p className="mt-1 text-sm text-zinc-900">
            {generatedAt}
          </p>
        </div>
      </div>

      {/* AI Summary */}
      <div className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-white p-3 shadow-sm">
            <Bot
              size={22}
              className="text-indigo-600"
            />
          </div>

          <div>
            <h3 className="font-semibold text-zinc-900">
              AI Summary
            </h3>

            <p className="mt-2 leading-7 text-zinc-600">
              {insights.summary?.overview ||
                "No AI summary is available for this meeting."}
            </p>
          </div>
        </div>
      </div>

      {/* Generated Content */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 p-5">
          <div className="rounded-xl bg-indigo-100 p-3">
            <FileText
              size={20}
              className="text-indigo-600"
            />
          </div>

          <div>
            <p className="font-semibold">
              Summary
            </p>

            <p className="text-sm text-zinc-500">
              AI-generated overview
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 p-5">
          <div className="rounded-xl bg-emerald-100 p-3">
            <ListTodo
              size={20}
              className="text-emerald-600"
            />
          </div>

          <div>
            <p className="font-semibold">
              Action Items
            </p>

            <p className="text-sm text-zinc-500">
              {actionItems.length} extracted
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 p-5">
          <div className="rounded-xl bg-violet-100 p-3">
            <Target
              size={20}
              className="text-violet-600"
            />
          </div>

          <div>
            <p className="font-semibold">
              Decisions
            </p>

            <p className="text-sm text-zinc-500">
              {decisions.length} detected
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 p-5">
          <div className="rounded-xl bg-amber-100 p-3">
            <AlertTriangle
              size={20}
              className="text-amber-600"
            />
          </div>

          <div>
            <p className="font-semibold">
              Risks
            </p>

            <p className="text-sm text-zinc-500">
              {risks.length} detected
            </p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div
        className={`mt-6 flex items-center gap-3 rounded-2xl border p-5 ${
          isCompleted
            ? "border-emerald-200 bg-emerald-50"
            : "border-amber-200 bg-amber-50"
        }`}
      >
        <BadgeCheck
          size={22}
          className={
            isCompleted
              ? "text-emerald-600"
              : "text-amber-600"
          }
        />

        <div>
          <h4
            className={`font-semibold ${
              isCompleted
                ? "text-emerald-700"
                : "text-amber-700"
            }`}
          >
            {isCompleted
              ? "AI Processing Completed"
              : `AI Processing ${insights.status || "Pending"}`}
          </h4>

          <p
            className={`mt-1 text-sm ${
              isCompleted
                ? "text-emerald-600"
                : "text-amber-600"
            }`}
          >
            {isCompleted
              ? "Meeting insights were generated successfully and are ready for review."
              : "AI analysis is not yet complete."}
          </p>
        </div>
      </div>
    </section>
  );
}