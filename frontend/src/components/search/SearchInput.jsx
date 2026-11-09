"use client";

import { Search } from "lucide-react";

export default function SearchInput({
  value,
  onChange,
}) {
  return (
    <div className="relative">
      <Search
        className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
        size={20}
      />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type keywords, speaker names, action items or topics..."
        className="h-14 w-full rounded-xl border border-border bg-surface-raised pl-14 pr-6 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-indigo-300/50 focus:ring-2 focus:ring-indigo-300/10"
      />
    </div>
  );
}
