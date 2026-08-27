"use client";

import {
  Hash,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export default function TopicsDiscussed({ insights, analytics }) {
  const topics =
    analytics?.topics ?? insights?.analytics?.topics ?? [];

  const sortedTopics = [...topics].sort(
    (a, b) =>
      (b.percentage || 0) -
      (a.percentage || 0)
  );

  const mostDiscussed = sortedTopics[0];

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

      {/* Empty State */}
      {sortedTopics.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center">
          <Hash
            size={40}
            className="mx-auto text-zinc-400"
          />

          <h3 className="mt-4 font-semibold text-zinc-900">
            No topics detected
          </h3>

          <p className="mt-1 text-sm text-zinc-500">
            No discussion topics were identified for this meeting.
          </p>
        </div>
      ) : (
        <>
          {/* Topic Chips */}
          <div className="flex flex-wrap gap-3">
            {sortedTopics.map(
              (topic, index) => (
                <div
                  key={`${topic.name}-${index}`}
                  className="group flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-3 transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50"
                >
                  <Hash
                    size={16}
                    className="text-indigo-600"
                  />

                  <span className="font-medium">
                    {topic.name}
                  </span>

                  <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-600 group-hover:bg-indigo-100">
                    {topic.percentage}%
                  </span>
                </div>
              )
            )}
          </div>

          {/* Most Discussed */}
          {mostDiscussed && (
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-white p-3">
                  <MessageSquare className="text-amber-600" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Most Discussed Topic
                  </h3>

                  <h4 className="mt-2 text-xl font-bold">
                    {mostDiscussed.name}
                  </h4>

                  <p className="mt-2 text-zinc-600">
                    This topic accounted for approximately{" "}
                    <strong>
                      {mostDiscussed.percentage}%
                    </strong>{" "}
                    of the meeting discussion.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI Insight */}
          <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-white p-3">
                <Sparkles className="text-indigo-600" />
              </div>

              <div>
                <h3 className="font-semibold">
                  AI Topic Analysis
                </h3>

                <p className="mt-2 leading-7 text-zinc-600">
                  The meeting covered{" "}
                  <strong>
                    {sortedTopics.length}
                  </strong>{" "}
                  primary topic
                  {sortedTopics.length !== 1
                    ? "s"
                    : ""}
                  . The most discussed topic was{" "}
                  <strong>
                    {mostDiscussed?.name}
                  </strong>
                  .
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}