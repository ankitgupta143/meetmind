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
  TrendingUp,
  TrendingDown,
  Smile,
  Sparkles,
} from "lucide-react";

import {
  sentimentTrend,
  sentimentInsight,
} from "@/constants/mockData";

export default function SentimentTrend() {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold">
          Sentiment Trend
        </h2>

        <p className="mt-2 text-sm text-zinc-500">
          AI analyzed how the emotional tone changed during the meeting.
        </p>
      </div>

      {/* Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sentimentTrend}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              domain={[60, 100]}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="sentiment"
              stroke="#4F46E5"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 p-5">
          <div className="flex items-center gap-2">
            <Smile
              size={18}
              className="text-emerald-600"
            />

            <h3 className="font-semibold">
              Overall
            </h3>
          </div>

          <p className="mt-4 text-2xl font-bold">
            {sentimentInsight.overall}
          </p>

          <p className="text-zinc-500">
            {sentimentInsight.score}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 p-5">
          <div className="flex items-center gap-2">
            <TrendingUp
              size={18}
              className="text-emerald-600"
            />

            <h3 className="font-semibold">
              Highest Moment
            </h3>
          </div>

          <p className="mt-4 font-semibold">
            {sentimentInsight.highestMoment}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 p-5">
          <div className="flex items-center gap-2">
            <TrendingDown
              size={18}
              className="text-red-500"
            />

            <h3 className="font-semibold">
              Lowest Moment
            </h3>
          </div>

          <p className="mt-4 font-semibold">
            {sentimentInsight.lowestMoment}
          </p>
        </div>
      </div>

      {/* AI Insight */}
      <div className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-white p-3">
            <Sparkles className="text-indigo-600" />
          </div>

          <div>
            <h3 className="font-semibold">
              AI Insight
            </h3>

            <p className="mt-2 leading-7 text-zinc-600">
              {sentimentInsight.summary}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}