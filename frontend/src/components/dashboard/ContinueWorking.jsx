"use client";

import {
  ArrowRight,
  CalendarDays,
  Sparkles,
  CheckCircle2,
  ListTodo,
  BrainCircuit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { dashboardData } from "@/constants/mockData";

const ContinueWorking = () => {
  const meeting = dashboardData.continueWorking;

  return (
    <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-indigo-600">
            <Sparkles size={16} />
            Continue Working
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {meeting.title}
          </h2>

          <div className="mt-3 flex items-center gap-2 text-sm text-zinc-500">
            <CalendarDays size={16} />
            Last opened {meeting.lastOpened}
          </div>

          {/* Status Chips */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              <CheckCircle2 size={16} />
              Summary Ready
            </div>

            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <ListTodo size={16} />
              {meeting.actionItems} Action Items
            </div>

            <div className="flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
              <BrainCircuit size={16} />
              {meeting.decisions} Decisions
            </div>
          </div>
        </div>

        <Button className="h-11 rounded-2xl px-6">
          Continue Meeting
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
};

export default ContinueWorking;