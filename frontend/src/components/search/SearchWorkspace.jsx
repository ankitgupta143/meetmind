"use client";

import { useState, useCallback } from "react";
import SearchHeader from "./SearchHeader";
import SearchInput from "./SearchInput";
import SearchFilters from "./SearchFilters";
import RecentSearches from "./RecentSearches";
import SearchResults from "./SearchResults";
import { useSearch } from "./hooks/useSearch";

const STORAGE_KEY = "meetmind_recent_searches";
const MAX_RECENT = 6;

function getInitialRecentSearches() {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (_) {}
  return [];
}

export default function SearchWorkspace() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [recentSearches, setRecentSearches] = useState(getInitialRecentSearches);

  const saveRecentSearch = useCallback((searchTerm) => {
    const trimmed = (searchTerm || "").trim();
    if (!trimmed || trimmed.length < 2) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (s) => s.toLowerCase() !== trimmed.toLowerCase()
      );
      const updated = [trimmed, ...filtered].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  }, []);

  const normalizedQuery = query.trim();

  const { results, loading, error } = useSearch({
    query: normalizedQuery,
    filter,
    onSearchSuccess: saveRecentSearch,
  });

  const handleSelectRecent = (term) => {
    setQuery(term);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <SearchHeader />

      <SearchInput value={query} onChange={setQuery} />

      <SearchFilters active={filter} onChange={setFilter} />

      {!normalizedQuery ? (
        <RecentSearches
          searches={recentSearches}
          onSelect={handleSelectRecent}
          onClear={clearRecentSearches}
        />
      ) : (
        <SearchResults
          results={results}
          loading={loading}
          error={error}
          query={normalizedQuery}
        />
      )}
    </div>
  );
}
