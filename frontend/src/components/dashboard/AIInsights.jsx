"use client";

import { dashboardData } from "@/constants/mockData";
import {
  BrainCircuit,
  CheckCircle2,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const icons = [
  BrainCircuit,
  CheckCircle2,
  TrendingUp,
];

const AIInsights = () => {
  return (
    <section className="relative mt-8 overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-gradient-to-b from-slate-900/70 via-slate-900/40 to-slate-950/80 p-6 sm:p-8 shadow-xl backdrop-blur-2xl">
      {/* Top highlight line */}
      <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />

      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          Global AI Discoveries
          <Sparkles size={16} className="text-cyan-400 animate-pulse" />
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Cross-meeting intelligence, recurring discussion themes, and execution velocity.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {dashboardData.aiInsights.map((item, index) => {
          const Icon = icons[index];

          return (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-900/40 p-5 transition-all duration-300 hover:border-indigo-500/30 hover:bg-slate-900/80 hover:-translate-y-1"
            >
              {/* Subtle card top highlight */}
              <div className="pointer-events-none absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-opacity group-hover:via-indigo-400/40" />

              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 text-indigo-400 shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:text-cyan-300">
                <Icon
                  size={18}
                />
              </div>

              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {item.title}
              </h3>

              <h2 className="mt-1 text-xl font-bold text-white">
                {item.value}
              </h2>

              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AIInsights;