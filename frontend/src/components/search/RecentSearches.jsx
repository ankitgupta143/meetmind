"use client";

import {
  Clock3,
  ArrowUpRight,
} from "lucide-react";

const recent = [
  "Authentication",
  "Redis",
  "Sprint Planning",
  "Dashboard",
  "Backend API",
];

export default function RecentSearches({ onSelect }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Clock3
          size={18}
          className="text-indigo-600"
        />

        <h3 className="font-semibold text-zinc-900">
          Recent Searches
        </h3>
      </div>

      <div className="space-y-3">
        {recent.map((item) => (
          <button
            key={item}
            onClick={() => onSelect(item)}
            className="group flex w-full items-center justify-between rounded-xl p-3 transition hover:bg-zinc-50"
          >
            <span>{item}</span>

            <ArrowUpRight
              size={16}
              className="opacity-0 transition group-hover:opacity-100"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
