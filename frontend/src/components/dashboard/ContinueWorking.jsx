"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Sparkles,
  CheckCircle2,
  ListTodo,
  BrainCircuit,
} from "lucide-react";
import { dashboardData } from "@/constants/mockData";

const ContinueWorking = () => {
  const router = useRouter();
  const meeting = dashboardData.continueWorking;

  return (
    <section className="mt-8 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-6 sm:p-8 shadow-xl backdrop-blur-2xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-3 py-1 text-xs font-bold text-indigo-300">
            <Sparkles size={13} className="text-cyan-400" />
            <span>Active Session</span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {meeting.title}
          </h2>

          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <CalendarDays size={14} className="text-indigo-400" />
            <span>Last accessed {meeting.lastOpened}</span>
          </div>

          {/* Status Chips */}
          <div className="mt-4 flex flex-wrap gap-2.5">
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
              <CheckCircle2 size={13} />
              <span>Summary Ready</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-300">
              <ListTodo size={13} />
              <span>{meeting.actionItems} Action Items</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-300">
              <BrainCircuit size={13} />
              <span>{meeting.decisions} Decisions</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push("/meetings/meeting-1")}
          className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:scale-95"
        >
          <span>Resume Workspace</span>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
};

export default ContinueWorking;