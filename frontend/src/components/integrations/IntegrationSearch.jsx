"use client";

import { Search, X } from "lucide-react";

const IntegrationSearch = ({ value, onChange }) => (
  <div className="relative max-w-xl">
    <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-400" />
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search integrations..."
      className="h-12 w-full rounded-2xl border border-zinc-200 bg-white pl-12 pr-11 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-indigo-950"
    />
    {value && (
      <button
        onClick={() => onChange("")}
        aria-label="Clear search"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
      >
        <X className="size-4" />
      </button>
    )}
  </div>
);

export default IntegrationSearch;
