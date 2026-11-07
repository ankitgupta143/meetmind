"use client";

import { SearchX } from "lucide-react";

export default function EmptySearch({ query }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/10 bg-slate-950/40 p-12 text-center backdrop-blur-xl">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 mb-4">
        <SearchX size={28} />
      </div>

      <h3 className="text-lg font-bold text-white">
        {query ? `No results found for "${query}"` : "No matching results"}
      </h3>

      <p className="mt-2 max-w-sm text-xs sm:text-sm text-slate-400">
        Try adjusting your keywords, switching categories, or searching for broader topics, action items, or speaker names.
      </p>
    </div>
  );
}
