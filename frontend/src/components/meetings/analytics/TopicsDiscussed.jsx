"use client";

import {
  Hash,
  MessageSquare,
  Sparkles,
} from "lucide-react";

import {
  topicsDiscussed,
  topicInsight,
} from "@/constants/mockData";

export default function TopicsDiscussed() {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold">
          Topics Discussed
        </h2>

        <p className="mt-2 text-sm text-zinc-500">
          AI identified the primary themes covered during the meeting.
        </p>
      </div>

      {/* Topic Chips */}
      <div className="flex flex-wrap gap-3">
        {topicsDiscussed.map((topic) => (
          <button
            key={topic.id}
            className="group flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-3 transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50"
          >
            <Hash
              size={16}
              className="text-indigo-600"
            />

            <span className="font-medium">
              {topic.topic}
            </span>

            <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-600 group-hover:bg-indigo-100">
              {topic.mentions}
            </span>
          </button>
        ))}
      </div>

      {/* Most Discussed */}
      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-white p-3">
            <MessageSquare
              className="text-amber-600"
            />
          </div>

          <div>
            <h3 className="font-semibold">
              Most Discussed Topic
            </h3>

            <h4 className="mt-2 text-xl font-bold">
              {topicInsight.mostDiscussed}
            </h4>

            <p className="mt-2 text-zinc-600">
              Mentioned{" "}
              <strong>
                {topicInsight.mentions}
              </strong>{" "}
              times and covered approximately{" "}
              <strong>
                {topicInsight.percentage}%
              </strong>{" "}
              of the meeting discussion.
            </p>
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-white p-3">
            <Sparkles className="text-indigo-600" />
          </div>

          <div>
            <h3 className="font-semibold">
              AI Topic Summary
            </h3>

            <p className="mt-2 leading-7 text-zinc-600">
              {topicInsight.summary}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}