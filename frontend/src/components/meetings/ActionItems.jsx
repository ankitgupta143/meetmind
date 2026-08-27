"use client";

import {
  CheckCircle2,
  Circle,
  CalendarDays,
  User,
} from "lucide-react";

const priorityClasses = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700",
};

const statusLabels = {
  pending: "Pending",
  "in-progress": "In Progress",
  completed: "Completed",
};

function formatDueDate(date) {
  if (!date) return "No due date";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export default function ActionItems({ insights }) {
  const actionItems = Array.isArray(
    insights?.actionItems
  )
    ? insights.actionItems
    : [];

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

      {/* Empty state */}
      {actionItems.length === 0 ? (
        <div className="p-10 text-center">
          <CheckCircle2
            size={40}
            className="mx-auto text-emerald-500"
          />

          <h3 className="mt-4 font-semibold text-zinc-900">
            No action items found
          </h3>

          <p className="mt-1 text-sm text-zinc-500">
            No actionable tasks were identified in this meeting.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-100">
          {actionItems.map((task, index) => {
            const isCompleted =
              task.status === "completed";

            const priority =
              task.priority?.toLowerCase() || "medium";

            return (
              <div
                key={`${task.title}-${index}`}
                className="flex items-start justify-between gap-6 p-6 transition hover:bg-zinc-50"
              >
                <div className="flex gap-4">
                  <div className="mt-1">
                    {isCompleted ? (
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

                  <div className="min-w-0">
                    <h3
                      className={`font-semibold ${
                        isCompleted
                          ? "text-zinc-400 line-through"
                          : "text-zinc-900"
                      }`}
                    >
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-5 text-sm text-zinc-500">
                      {task.assignee && (
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {task.assignee}
                        </span>
                      )}

                      <span className="flex items-center gap-1">
                        <CalendarDays size={14} />
                        {formatDueDate(task.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      priorityClasses[priority] ||
                      priorityClasses.medium
                    }`}
                  >
                    {priority}
                  </span>

                  <span
                    className={`text-sm ${
                      isCompleted
                        ? "text-emerald-600"
                        : "text-zinc-500"
                    }`}
                  >
                    {statusLabels[task.status] ||
                      "Pending"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}