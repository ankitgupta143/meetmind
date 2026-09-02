"use client";

import {
  Trophy,
  Clock3,
  Mic,
  User,
  Sparkles,
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

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
];

function formatTalkTime(seconds = 0) {
  const totalSeconds = Math.round(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }
  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }
  return `${minutes}m ${remainingSeconds}s`;
}

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-md">
        <p className="text-xs font-semibold text-slate-200">{label}</p>
        <p className="text-xs font-bold text-indigo-400 mt-0.5">
          {payload[0].value}% Speaking Share
        </p>
      </div>
    );
  }
  return null;
};

export default function SpeakerParticipation({
  analytics,
}) {
  const speakerStats = Array.isArray(
    analytics?.speakerStats
  )
    ? analytics.speakerStats
    : [];

  const speakers = speakerStats.map(
    (speaker, index) => ({
      id: `${speaker.speaker}-${index}`,
      name: speaker.speaker,
      percentage: Number(
        speaker.percentage || 0
      ),
      talkTimeSeconds: Number(
        speaker.talkTimeSeconds || 0
      ),
      speakingTime: formatTalkTime(
        speaker.talkTimeSeconds
      ),
    })
  );

  const topSpeaker = speakers.reduce(
    (top, current) => {
      if (!top) return current;
      return current.percentage > top.percentage ? current : top;
    },
    null
  );

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-6 shadow-xl backdrop-blur-2xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          Speaker Participation
          <Sparkles size={16} className="text-indigo-400" />
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Visual breakdown of speaking time and engagement distribution.
        </p>
      </div>

      {/* Empty State */}
      {speakers.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-slate-900/30 p-10 text-center">
          <Mic size={36} className="mx-auto text-slate-600" />
          <h3 className="mt-3 text-sm font-semibold text-slate-200">
            Speaker data unavailable
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Speaker participation data has not been generated for this meeting yet.
          </p>
        </div>
      ) : (
        <>
          {/* Chart */}
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={speakers}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <YAxis
                  unit="%"
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                  {speakers.map((speaker, index) => (
                    <Cell
                      key={speaker.id}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Speaker Spotlight */}
          {topSpeaker && (
            <div className="mt-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/50 via-slate-900/60 to-violet-950/40 p-5 backdrop-blur-md">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-500/30 shadow-md">
                  <Trophy size={20} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Primary Discussion Lead
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">
                    <span className="font-semibold text-indigo-300">{topSpeaker.name}</span>{" "}
                    contributed{" "}
                    <span className="font-semibold text-white">{topSpeaker.percentage}%</span>{" "}
                    of the total discussion with{" "}
                    <span className="font-mono text-cyan-300">{topSpeaker.speakingTime}</span>{" "}
                    of active talk time.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Participant Breakdown List */}
          <div className="mt-6">
            <h3 className="mb-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              Participant Breakdown
            </h3>

            <div className="space-y-2.5">
              {speakers.map((speaker, index) => (
                <div
                  key={speaker.id}
                  className="group flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-slate-900/40 p-4 transition-all duration-200 hover:border-indigo-500/30 hover:bg-slate-900/70 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold text-white shadow-sm"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    >
                      {getInitials(speaker.name)}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold tracking-tight text-white group-hover:text-indigo-300">
                        {speaker.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Meeting Participant
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Clock3 size={13} className="text-amber-400" />
                        <span>Duration</span>
                      </div>
                      <p className="mt-0.5 font-mono font-semibold text-slate-200 text-xs">
                        {speaker.speakingTime}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <User size={13} className="text-cyan-400" />
                        <span>Share</span>
                      </div>
                      <p className="mt-0.5 font-mono font-semibold text-indigo-300 text-xs">
                        {speaker.percentage}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}