"use client";

import SearchCard from "./SearchCard";
import EmptySearch from "./EmptySearch";

import { searchData } from "./data/searchData";

export default function SearchResults({
  query,
  filter,
}) {
  const results = searchData.filter((item) => {
    const matchesQuery =
      item.title
        .toLowerCase()
        .includes(query.toLowerCase()) ||
      item.description
        .toLowerCase()
        .includes(query.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      item.type === filter;

    return matchesQuery && matchesFilter;
  });

  if (!results.length) {
    return <EmptySearch />;
  }

  return (
    <div className="space-y-4">
      {results.map((item) => (
        <SearchCard
          key={item.id}
          item={item}
        />
      ))}
    </div>
  );
}