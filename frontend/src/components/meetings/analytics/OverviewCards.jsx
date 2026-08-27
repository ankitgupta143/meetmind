"use client";

import {
  BrainCircuit,
  Clock3,
  MessageSquare,
  Smile,
} from "lucide-react";

const icons = {
  sentiment: Smile,
  brain: BrainCircuit,
  clock: Clock3,
  message: MessageSquare,
};

function formatDuration(seconds = 0) {
  if (!seconds) return "0 min";

  const totalMinutes = Math.round(seconds / 60);

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return minutes
    ? `${hours}h ${minutes}m`
    : `${hours}h`;
}

function formatSentiment(score = 0) {
  if (score > 0.2) return "Positive";
  if (score < -0.2) return "Negative";

  return "Neutral";
}

export default function OverviewCards({ analytics }) {
  const totalDuration =
    analytics?.totalDurationSeconds ?? 0;

  const speakerStats =
    Array.isArray(analytics?.speakerStats)
      ? analytics.speakerStats
      : [];

  const topics =
    Array.isArray(analytics?.topics)
      ? analytics.topics
      : [];

  const sentiment =
    analytics?.sentiment ?? {};

  const sentimentLabel =
    sentiment.overall ||
    formatSentiment(sentiment.score);

 const cards = [
  {
    id: "sentiment",
    icon: "sentiment",
    title: "Overall Sentiment",
    value:
      sentimentLabel.charAt(0).toUpperCase() +
      sentimentLabel.slice(1),
    secondary: `${sentiment.score ?? 0}`,
    description:
      "Overall emotional tone detected during the meeting.",
  },
  {
    id: "messages",
    icon: "message",
    title: "Messages",
    value: analytics?.messageCount ?? 0,
    secondary: "Detected",
    description:
      "Transcript segments identified in the conversation.",
  },
  {
    id: "talk-time",
    icon: "clock",
    title: "Talk Time",
    value: formatTalkTime(
      analytics?.totalTalkTimeSeconds ?? 0
    ),
    secondary: "Total",
    description:
      "Combined speaking time across all participants.",
  },
  {
    id: "words",
    icon: "brain",
    title: "Words",
    value: (
      analytics?.wordCount ?? 0
    ).toLocaleString(),
    secondary: "Spoken",
    description:
      "Total number of words detected in the transcript.",
  },
];

function formatTalkTime(seconds = 0) {
  const totalSeconds = Math.round(seconds);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );
  const remainingSeconds =
    totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${remainingSeconds}s`;
}

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">
          Overview
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Quick AI-generated metrics from this meeting.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((item) => {
          const Icon = icons[item.icon];

          return (
            <div
              key={item.id}
              className="group rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-2xl bg-indigo-50 p-3 transition group-hover:scale-105">
                  <Icon
                    size={22}
                    className="text-indigo-600"
                  />
                </div>

                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium capitalize text-zinc-600">
                  {item.secondary}
                </span>
              </div>

              <div className="mt-6">
                <p className="text-sm text-zinc-500">
                  {item.title}
                </p>

                <h3 className="mt-2 text-3xl font-bold text-zinc-900">
                  {item.value}
                </h3>

                <p className="mt-4 text-sm leading-6 text-zinc-500">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}