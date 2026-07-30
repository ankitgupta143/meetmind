"use client";

import {
  Trophy,
  Clock3,
  Mic,
  User,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

import { speakerParticipation } from "@/constants/mockData";

const COLORS = [
  "#4F46E5",
  "#818CF8",
  "#C7D2FE",
];

export default function SpeakerParticipation() {
  const topSpeaker = speakerParticipation.reduce((prev, current) =>
    current.percentage > prev.percentage ? current : prev
  );

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">
          Speaker Participation
        </h2>

        <p className="mt-2 text-sm text-zinc-500">
          Visual breakdown of speaking time and engagement during the meeting.
        </p>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={speakerParticipation}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              unit="%"
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              cursor={{ fill: "#F4F4F5" }}
              formatter={(value) => [`${value}%`, "Speaking Time"]}
            />

            <Bar
              dataKey="percentage"
              radius={[8, 8, 0, 0]}
            >
              {speakerParticipation.map((entry, index) => (
                <Cell
                  key={entry.id}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Speaker */}
      <div className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-white p-3 shadow-sm">
            <Trophy
              size={22}
              className="text-indigo-600"
            />
          </div>

          <div>
            <h3 className="font-semibold text-zinc-900">
              Most Active Speaker
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-600">
              <span className="font-semibold text-zinc-900">
                {topSpeaker.name}
              </span>{" "}
              contributed{" "}
              <span className="font-semibold text-indigo-600">
                {topSpeaker.percentage}%
              </span>{" "}
              of the discussion with{" "}
              <span className="font-semibold">
                {topSpeaker.turns}
              </span>{" "}
              speaking turns over{" "}
              <span className="font-semibold">
                {topSpeaker.speakingTime}
              </span>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Participant Breakdown */}
      <div className="mt-8">
        <h3 className="mb-5 text-lg font-semibold text-zinc-900">
          Participant Breakdown
        </h3>

        <div className="space-y-4">
          {speakerParticipation.map((speaker, index) => (
            <div
              key={speaker.id}
              className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-5 transition-all hover:border-indigo-200 hover:bg-zinc-50 md:flex-row md:items-center md:justify-between"
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-white font-semibold"
                  style={{
                    backgroundColor:
                      COLORS[index % COLORS.length],
                  }}
                >
                  {speaker.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <div>
                  <h4 className="font-semibold text-zinc-900">
                    {speaker.name}
                  </h4>

                  <p className="text-sm text-zinc-500">
                    Meeting Participant
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 md:gap-10">
                <div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Clock3 size={16} />
                    <span className="text-sm">
                      Time
                    </span>
                  </div>

                  <p className="mt-2 font-semibold">
                    {speaker.speakingTime}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <User size={16} />
                    <span className="text-sm">
                      Share
                    </span>
                  </div>

                  <p className="mt-2 font-semibold">
                    {speaker.percentage}%
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Mic size={16} />
                    <span className="text-sm">
                      Turns
                    </span>
                  </div>

                  <p className="mt-2 font-semibold">
                    {speaker.turns}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}