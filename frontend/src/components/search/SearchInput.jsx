"use client";

import { Search, Sparkles } from "lucide-react";

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
        className="h-14 w-full rounded-2xl border border-white/[0.08] bg-slate-900/80 pl-14 pr-6 text-sm text-slate-100 placeholder-slate-500 shadow-xl outline-none transition-all focus:border-indigo-500/50 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20"
      />
    </div>
  );
}