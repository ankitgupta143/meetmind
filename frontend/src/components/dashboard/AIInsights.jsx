"use client";

import { dashboardData } from "@/constants/mockData";
import {
  BrainCircuit,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

const icons = [
  BrainCircuit,
  CheckCircle2,
  TrendingUp,
];

const AIInsights = () => {
  return (
    <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">
          AI Insights
        </h2>

        <p className="mt-1 text-zinc-500">
          Here what your AI discovered across recent meetings.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {dashboardData.aiInsights.map((item, index) => {
          const Icon = icons[index];

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-zinc-200 p-6 transition-all duration-300 hover:border-indigo-300 hover:shadow-md"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">
                <Icon
                  className="text-indigo-600"
                  size={22}
                />
              </div>

              <h3 className="text-sm font-medium text-zinc-500">
                {item.title}
              </h3>

              <h2 className="mt-2 text-2xl font-bold">
                {item.value}
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
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