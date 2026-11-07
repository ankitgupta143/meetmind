"use client";

import SearchCard from "./SearchCard";
import EmptySearch from "./EmptySearch";
import { AlertCircle, Loader2 } from "lucide-react";

function SearchSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-28 rounded-2xl border border-white/[0.06] bg-slate-900/30"
        />
      ))}
    </div>
  );
}

export default function SearchResults({
  results = [],
  loading = false,
  error = null,
  query = "",
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Loader2 size={14} className="animate-spin text-indigo-400" />
          <span>Searching workspace transcripts, meetings, and insights...</span>
        </div>
        <SearchSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs sm:text-sm text-rose-300">
        <AlertCircle size={18} className="shrink-0 text-rose-400" />
        <span>{error}</span>
      </div>
    );
  }

  if (!results.length) {
    return <EmptySearch query={query} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Found <strong className="text-white font-semibold">{results.length}</strong> result{results.length === 1 ? "" : "s"} for &ldquo;<span className="text-indigo-300">{query}</span>&rdquo;
        </span>
      </div>

      <div className="space-y-3">
        {results.map((item) => (
          <SearchCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
