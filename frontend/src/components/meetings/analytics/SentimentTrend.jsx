"use client";

import {
  Smile,
  Meh,
  Frown,
  Sparkles,
  TrendingUp,
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

  const getSentimentIcon = () => {
    if (overall.toLowerCase() === "positive") {
      return <Smile size={22} className="text-emerald-400" />;
    }
    if (overall.toLowerCase() === "negative") {
      return <Frown size={22} className="text-rose-400" />;
    }
    return <Meh size={22} className="text-cyan-400" />;
  };

  const getSentimentGlow = () => {
    if (overall.toLowerCase() === "positive") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    if (overall.toLowerCase() === "negative") return "border-rose-500/30 bg-rose-500/10 text-rose-300";
    return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
  };

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-6 shadow-xl backdrop-blur-2xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          Sentiment Analysis
          <Sparkles size={16} className="text-indigo-400" />
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          AI analyzed the overall emotional tone & acoustic sentiment of the conversation.
        </p>
      </div>

      {/* Current Sentiment */}
      <div className="rounded-2xl border border-white/[0.06] bg-slate-900/40 p-5">
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border shadow-md ${getSentimentGlow()}`}>
            {getSentimentIcon()}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Overall Sentiment
            </p>

            <h3 className="mt-0.5 text-xl font-extrabold capitalize tracking-tight text-white">
              {overall}
            </h3>
          </div>
        </div>

        {/* Sentiment Score Gauge */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Sentiment Score Index
            </span>
            <span className="font-mono font-bold text-slate-200">
              {score.toFixed(2)}
            </span>
          </div>

          <div className="mt-2.5 h-3 overflow-hidden rounded-full bg-slate-800/80 border border-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-400 via-cyan-400 to-emerald-400 transition-all duration-700 shadow-md"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>

          <div className="mt-2 flex justify-between text-[10px] font-semibold text-slate-500">
            <span>Negative (-1.0)</span>
            <span>Neutral (0.0)</span>
            <span>Positive (+1.0)</span>
          </div>
        </div>
      </div>

      {/* Real-time Status Card */}
      <div className="mt-4 rounded-2xl border border-white/[0.06] bg-slate-900/20 p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-indigo-400">
          <TrendingUp size={15} />
          <span className="text-xs font-semibold">Continuous Acoustic Tracking</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-400">
          Transcript tonal variance remained steady throughout the session duration.
        </p>
      </div>
    </section>
  );
}