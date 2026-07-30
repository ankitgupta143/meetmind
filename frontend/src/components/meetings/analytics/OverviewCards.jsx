"use client";

import {
  BrainCircuit,
  Clock3,
  MessageSquare,
  Smile,
} from "lucide-react";

import { analyticsOverview } from "@/constants/mockData";

const icons = {
  sentiment: Smile,
  brain: BrainCircuit,
  clock: Clock3,
  message: MessageSquare,
};

export default function OverviewCards() {
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
        {analyticsOverview.map((item) => {
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

                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
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