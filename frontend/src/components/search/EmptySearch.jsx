"use client";

import { SearchX } from "lucide-react";

export default function EmptySearch() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 py-20">
      <SearchX
        size={60}
        className="text-zinc-400"
      />

      <h3 className="mt-6 text-xl font-semibold">
        No results found
      </h3>

      <p className="mt-2 text-zinc-500">
        Try searching for meetings, speakers,
        transcripts or action items.
      </p>
    </div>
  );
}