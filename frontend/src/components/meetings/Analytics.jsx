"use client";

import AIBreakdown from "./analytics/AIBreakdown";
import MeetingTimeline from "./analytics/MeetingTimeline";
import OverviewCards from "./analytics/OverviewCards";
import SentimentTrend from "./analytics/SentimentTrend";
import SpeakerParticipation from "./analytics/SpeakerParticipation";
import TopicsDiscussed from "./analytics/TopicsDiscussed";

export default function Analytics() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Meeting Analytics</h1>

        <p className="mt-2 text-zinc-500">
          AI-generated insights and visual analysis from your meeting.
        </p>
      </div>

      <OverviewCards />

      <SpeakerParticipation />

      <MeetingTimeline />

      <SentimentTrend />

      <TopicsDiscussed />

      <AIBreakdown />
    </div>
  );
}
