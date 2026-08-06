"use client";

import {
  Calendar,
  CheckSquare,
  FileText,
  Target,
  User,
} from "lucide-react";

const icons = {
  meeting: Calendar,
  action: CheckSquare,
  decision: Target,
  speaker: User,
  transcript: FileText,
};

export default function SearchCard({
  item,
}) {
  const Icon = icons[item.icon];

  return (
    <button className="flex w-full items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-all duration-200 hover:border-indigo-300 hover:shadow-lg">
      <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
        <Icon size={20} />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-zinc-900">
            {item.title}
          </h3>

          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs capitalize">
            {item.type}
          </span>
        </div>

        <p className="mt-2 text-sm text-zinc-500">
          {item.description}
        </p>
      </div>
    </button>
  );
}