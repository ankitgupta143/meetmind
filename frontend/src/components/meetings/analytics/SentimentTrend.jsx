"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Smile,
  Sparkles,
} from "lucide-react";

export default function SentimentTrend({ insights, analytics }) {
  const sentiment =
    analytics?.sentiment ?? insights?.analytics?.sentiment;

  const overall =
    sentiment?.overall || "neutral";

  const score =
    typeof sentiment?.score === "number"
      ? sentiment.score
      : 0;

  const percentage = Math.round(
    ((score + 1) / 2) * 100
  );

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold">
          Sentiment Analysis
        </h2>

        <p className="mt-2 text-sm text-zinc-500">
          AI analyzed the overall emotional tone of the meeting.
        </p>
      </div>

      {/* Current Sentiment */}
      <div className="rounded-2xl border border-zinc-200 p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-emerald-100 p-3">
            <Smile
              size={22}
              className="text-emerald-600"
            />
          </div>

          <div>
            <p className="text-sm text-zinc-500">
              Overall Sentiment
            </p>

            <h3 className="mt-1 text-2xl font-bold capitalize">
              {overall}
            </h3>
          </div>
        </div>

        {/* Sentiment Score */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">
              Sentiment Score
            </span>

            <span className="font-semibold">
              {score.toFixed(2)}
            </span>
          </div>

          <div className="mt-3 h-3 overflow-hidden rounded-full bg-zinc-200">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>

          <div className="mt-2 flex justify-between text-xs text-zinc-400">
            <span>Negative</span>
            <span>Neutral</span>
            <span>Positive</span>
          </div>
        </div>
      </div>

      {/* Trend unavailable */}
      <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
        <Sparkles
          size={32}
          className="mx-auto text-indigo-500"
        />

        <h3 className="mt-4 font-semibold text-zinc-900">
          Sentiment trend coming next
        </h3>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-500">
          The current AI pipeline provides the overall sentiment
          score. A timeline-based sentiment trend requires
          sentiment data for individual transcript segments.
        </p>
      </div>
    </section>
  );
}