"use client";

import { Sparkles } from "lucide-react";
import AIBreakdown from "./analytics/AIBreakdown";
import MeetingTimeline from "./analytics/MeetingTimeline";
import OverviewCards from "./analytics/OverviewCards";
import SentimentTrend from "./analytics/SentimentTrend";
import SpeakerParticipation from "./analytics/SpeakerParticipation";
import TopicsDiscussed from "./analytics/TopicsDiscussed";

export default function Analytics({ insights }) {
  const analytics = insights?.analytics ?? null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5 sm:text-3xl">
          Meeting Analytics
          <Sparkles size={20} className="text-cyan-400" />
        </h1>

        <p className="mt-1 text-xs text-slate-400 sm:text-sm">
          AI-generated insights, acoustic metrics and visual breakdown from your meeting.
        </p>
      </div>

      <OverviewCards analytics={analytics} />

      <SpeakerParticipation analytics={analytics} />

      <MeetingTimeline insights={insights} />

      <SentimentTrend analytics={analytics} insights={insights} />

      <TopicsDiscussed analytics={analytics} insights={insights} />

      <AIBreakdown insights={insights} />
    </div>
  );
}