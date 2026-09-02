"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  Clock3,
  MessageSquare,
  Smile,
  Meh,
  Frown,
  Sparkles,
  TrendingUp,
} from "lucide-react";

function formatTalkTime(seconds = 0) {
  const totalSeconds = Math.round(seconds);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${remainingSeconds}s`;
}

function formatSentiment(score = 0) {
  if (score > 0.2) return "Positive";
  if (score < -0.2) return "Negative";
  return "Neutral";
}

function getSentimentConfig(label, score = 0) {
  const normalized = (label || formatSentiment(score)).toLowerCase();

  if (normalized === "positive") {
    return {
      icon: Smile,
      bgClass: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400 shadow-emerald-500/20",
      badgeClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
      hoverGlow: "group-hover:border-emerald-500/40 group-hover:shadow-[0_15px_35px_-10px_rgba(16,185,129,0.25)]",
      glowSpot: "bg-emerald-500/15",
    };
  }

  if (normalized === "negative") {
    return {
      icon: Frown,
      bgClass: "from-rose-500/20 to-red-500/20 border-rose-500/30 text-rose-400 shadow-rose-500/20",
      badgeClass: "bg-rose-500/15 border-rose-500/30 text-rose-300",
      hoverGlow: "group-hover:border-rose-500/40 group-hover:shadow-[0_15px_35px_-10px_rgba(244,63,94,0.25)]",
      glowSpot: "bg-rose-500/15",
    };
  }

  return {
    icon: Meh,
    bgClass: "from-sky-500/20 to-cyan-500/20 border-sky-500/30 text-sky-400 shadow-sky-500/20",
    badgeClass: "bg-sky-500/15 border-sky-500/30 text-sky-300",
    hoverGlow: "group-hover:border-sky-500/40 group-hover:shadow-[0_15px_35px_-10px_rgba(56,189,248,0.25)]",
    glowSpot: "bg-sky-500/15",
  };
}

export default function OverviewCards({ analytics }) {
  const sentiment = analytics?.sentiment ?? {};
  const sentimentLabel =
    sentiment.overall || formatSentiment(sentiment.score);

  const sentimentConfig = getSentimentConfig(
    sentimentLabel,
    sentiment.score
  );

  const cards = [
    {
      id: "sentiment",
      icon: sentimentConfig.icon,
      title: "Overall Sentiment",
      value:
        sentimentLabel.charAt(0).toUpperCase() +
        sentimentLabel.slice(1),
      badge: "Analyzed",
      bgClass: sentimentConfig.bgClass,
      badgeClass: sentimentConfig.badgeClass,
      hoverGlow: sentimentConfig.hoverGlow,
      glowSpot: sentimentConfig.glowSpot,
      description: "Overall emotional tone detected during the meeting.",
    },
    {
      id: "messages",
      icon: MessageSquare,
      title: "Messages",
      value: (analytics?.messageCount ?? 0).toLocaleString(),
      badge: "Segments",
      bgClass: "from-indigo-500/20 to-violet-500/20 border-indigo-500/30 text-indigo-400 shadow-indigo-500/20",
      badgeClass: "bg-indigo-500/15 border-indigo-500/30 text-indigo-300",
      hoverGlow: "group-hover:border-indigo-500/40 group-hover:shadow-[0_15px_35px_-10px_rgba(99,102,241,0.25)]",
      glowSpot: "bg-indigo-500/15",
      description: "Transcript segments identified in the conversation.",
    },
    {
      id: "talk-time",
      icon: Clock3,
      title: "Talk Time",
      value: formatTalkTime(analytics?.totalTalkTimeSeconds ?? 0),
      badge: "Duration",
      bgClass: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400 shadow-amber-500/20",
      badgeClass: "bg-amber-500/15 border-amber-500/30 text-amber-300",
      hoverGlow: "group-hover:border-amber-500/40 group-hover:shadow-[0_15px_35px_-10px_rgba(245,158,11,0.25)]",
      glowSpot: "bg-amber-500/15",
      description: "Combined speaking time across all participants.",
    },
    {
      id: "words",
      icon: BrainCircuit,
      title: "Words",
      value: (analytics?.wordCount ?? 0).toLocaleString(),
      badge: "Spoken",
      bgClass: "from-purple-500/20 to-fuchsia-500/20 border-purple-500/30 text-purple-400 shadow-purple-500/20",
      badgeClass: "bg-purple-500/15 border-purple-500/30 text-purple-300",
      hoverGlow: "group-hover:border-purple-500/40 group-hover:shadow-[0_15px_35px_-10px_rgba(168,85,247,0.25)]",
      glowSpot: "bg-purple-500/15",
      description: "Total number of words detected in the transcript.",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Overview
            <Sparkles size={16} className="text-indigo-400" />
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Quick AI-generated metrics from this meeting.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950/60 p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${item.hoverGlow}`}
            >
              {/* Subtle ambient light glow spot */}
              <div className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-60 ${item.glowSpot}`} />

              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br border shadow-md transition-transform duration-300 group-hover:scale-105 ${item.bgClass}`}
                    >
                      <Icon size={20} />
                    </div>

                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${item.badgeClass}`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {item.title}
                    </p>

                    <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                      {item.value}
                    </h3>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-400">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}