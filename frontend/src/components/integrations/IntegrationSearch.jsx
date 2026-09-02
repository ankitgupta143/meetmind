"use client";

import { Search, X } from "lucide-react";

const IntegrationSearch = ({ value, onChange }) => (
  <div className="relative max-w-xl">
    <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search integrations by name or platform..."
      className="h-11 w-full rounded-2xl border border-white/[0.08] bg-slate-900/80 pl-11 pr-10 text-xs text-slate-100 placeholder-slate-500 shadow-xl outline-none transition focus:border-indigo-500/50 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20"
    />
    {value && (
      <button
        onClick={() => onChange("")}
        aria-label="Clear search"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
      >
        <X className="size-3.5" />
      </button>
    )}
  </div>
);

export default IntegrationSearch;
