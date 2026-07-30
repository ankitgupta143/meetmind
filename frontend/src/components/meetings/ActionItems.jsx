"use client";

import {
  CheckCircle2,
  Circle,
  CalendarDays,
  User,
} from "lucide-react";

import { actionItemsData } from "@/constants/mockData";

const priorityClasses = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-emerald-100 text-emerald-700",
};

export default function ActionItems() {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-zinc-200 p-6">
        <h2 className="text-2xl font-bold">
          Action Items
        </h2>

        <p className="mt-1 text-zinc-500">
          AI-extracted tasks from this meeting.
        </p>
      </div>

      <div className="divide-y divide-zinc-100">
        {actionItemsData.map((task) => (
          <div
            key={task.id}
            className="flex items-start justify-between gap-6 p-6 transition hover:bg-zinc-50"
          >
            <div className="flex gap-4">
              <div className="mt-1">
                {task.completed ? (
                  <CheckCircle2
                    className="text-emerald-600"
                    size={22}
                  />
                ) : (
                  <Circle
                    className="text-zinc-400"
                    size={22}
                  />
                )}
              </div>

              <div>
                <h3
                  className={`font-semibold ${
                    task.completed
                      ? "line-through text-zinc-400"
                      : "text-zinc-900"
                  }`}
                >
                  {task.title}
                </h3>

                <div className="mt-3 flex flex-wrap gap-5 text-sm text-zinc-500">
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    {task.assignee}
                  </span>

                  <span className="flex items-center gap-1">
                    <CalendarDays size={14} />
                    {task.dueDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  priorityClasses[task.priority]
                }`}
              >
                {task.priority}
              </span>

              <span
                className={`text-sm ${
                  task.completed
                    ? "text-emerald-600"
                    : "text-zinc-500"
                }`}
              >
                {task.completed ? "Completed" : "Pending"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}