"use client";

import { Search } from "lucide-react";

export default function SearchInput({
  value,
  onChange,
}) {
  return (
    <div className="relative">
      <Search
        className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400"
        size={20}
      />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search anything..."
        className="h-16 w-full rounded-3xl border border-zinc-200 bg-white pl-14 pr-6 text-lg shadow-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}