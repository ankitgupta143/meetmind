"use client";

import {
  Bot,
  BadgeCheck,
  CheckCircle2,
} from "lucide-react";

import {
  aiBreakdown,
  aiProcessingInsight,
} from "@/constants/mockData";

export default function AIBreakdown() {
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
      <div className="grid gap-4 sm:grid-cols-2">
        {aiBreakdown.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-5 transition-all duration-300 hover:border-indigo-200 hover:bg-white"
          >
            <span className="text-sm font-medium text-zinc-600">
              {item.label}
            </span>

            <span className="text-lg font-semibold text-zinc-900">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* AI Insight */}
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
              {aiProcessingInsight.description}
            </p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <BadgeCheck
          size={22}
          className="text-emerald-600"
        />

        <div>
          <h4 className="font-semibold text-emerald-700">
            {aiProcessingInsight.title}
          </h4>

          <p className="mt-1 text-sm text-emerald-600">
            All meeting insights were generated successfully and are ready for review.
          </p>
        </div>
      </div>
    </section>
  );
}