"use client";

import {
  BrainCircuit,
  Clock3,
  MessageSquare,
  Smile,
  Meh,
  Frown,
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
      color: "emerald",
      bgClass: "bg-emerald-50 text-emerald-600",
      badgeClass: "bg-emerald-100/80 text-emerald-700",
      borderHover: "hover:border-emerald-300",
      accentDot: "bg-emerald-500",
    };
  }

  if (normalized === "negative") {
    return {
      icon: Frown,
      color: "rose",
      bgClass: "bg-rose-50 text-rose-600",
      badgeClass: "bg-rose-100/80 text-rose-700",
      borderHover: "hover:border-rose-300",
      accentDot: "bg-rose-500",
    };
  }

  return {
    icon: Meh,
    color: "sky",
    bgClass: "bg-sky-50 text-sky-600",
    badgeClass: "bg-sky-100/80 text-sky-700",
    borderHover: "hover:border-sky-300",
    accentDot: "bg-sky-500",
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
      borderHover: sentimentConfig.borderHover,
      description: "Overall emotional tone detected during the meeting.",
    },
    {
      id: "messages",
      icon: MessageSquare,
      title: "Messages",
      value: (analytics?.messageCount ?? 0).toLocaleString(),
      badge: "Segments",
      bgClass: "bg-indigo-50 text-indigo-600",
      badgeClass: "bg-indigo-100/80 text-indigo-700",
      borderHover: "hover:border-indigo-300",
      description: "Transcript segments identified in the conversation.",
    },
    {
      id: "talk-time",
      icon: Clock3,
      title: "Talk Time",
      value: formatTalkTime(analytics?.totalTalkTimeSeconds ?? 0),
      badge: "Duration",
      bgClass: "bg-amber-50 text-amber-600",
      badgeClass: "bg-amber-100/80 text-amber-700",
      borderHover: "hover:border-amber-300",
      description: "Combined speaking time across all participants.",
    },
    {
      id: "words",
      icon: BrainCircuit,
      title: "Words",
      value: (analytics?.wordCount ?? 0).toLocaleString(),
      badge: "Spoken",
      bgClass: "bg-purple-50 text-purple-600",
      badgeClass: "bg-purple-100/80 text-purple-700",
      borderHover: "hover:border-purple-300",
      description: "Total number of words detected in the transcript.",
    },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">
          Overview
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Quick AI-generated metrics from this meeting.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {cards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className={`group relative flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${item.borderHover}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl transition duration-300 group-hover:scale-105 ${item.bgClass}`}
                  >
                    <Icon size={22} />
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${item.badgeClass}`}
                  >
                    {item.badge}
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    {item.title}
                  </p>

                  <h3 className="mt-1.5 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                    {item.value}
                  </h3>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-zinc-500">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}