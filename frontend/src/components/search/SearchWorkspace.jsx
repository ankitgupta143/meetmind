"use client";

import { useState } from "react";

import SearchHeader from "./SearchHeader";
import SearchInput from "./SearchInput";
import SearchFilters from "./SearchFilters";
import RecentSearches from "./RecentSearches";
import SearchResults from "./SearchResults";

export default function SearchWorkspace() {
  const [query, setQuery] = useState("");

  const [filter, setFilter] = useState("all");
  const normalizedQuery = query.trim();

  return (
    <div className="space-y-8">
      <SearchHeader />

      <SearchInput
        value={query}
        onChange={setQuery}
      />

      <SearchFilters
        active={filter}
        onChange={setFilter}
      />

      {!normalizedQuery ? (
        <RecentSearches onSelect={setQuery} />
      ) : (
        <SearchResults
          query={normalizedQuery}
          filter={filter}
        />
      )}
    </div>
  );
}
