"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/api";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatTranscriptTime(seconds = 0) {
  const totalSeconds = Math.max(Math.floor(Number(seconds) || 0), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  return [hours, minutes, remainingSeconds]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
}

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

/** Stable speaker → hue mapping so colours don't jump on re-render */
const speakerHues = {};
const PALETTE = [221, 262, 340, 24, 160, 45, 190, 300];
let hueIndex = 0;

function getSpeakerColor(name) {
  if (!speakerHues[name]) {
    speakerHues[name] = PALETTE[hueIndex % PALETTE.length];
    hueIndex++;
  }
  const h = speakerHues[name];
  return {
    bg: `hsl(${h} 80% 92%)`,
    text: `hsl(${h} 60% 35%)`,
    ring: `hsl(${h} 70% 75%)`,
  };
}

/** Debounce hook — avoids filtering on every keystroke */
function useDebounce(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// ─── inline SVG icons ────────────────────────────────────────────────────────

function SearchIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// ─── HighlightedText ─────────────────────────────────────────────────────────

function HighlightedText({ text, query }) {
  if (!query) return <>{text}</>;

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="rounded-sm bg-amber-200 px-0.5 text-amber-900"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

// ─── constants ───────────────────────────────────────────────────────────────

const ALL_SPEAKERS = "__all__";

/**
 * Segments shown per page.
 * Matches the eventual backend ?limit=50 default.
 */
const PAGE_LIMIT = 50;

// ─── Transcript ──────────────────────────────────────────────────────────────

export default function Transcript({ meetingId }) {
  // ── server data ──
  const [transcript, setTranscript] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [speakers, setSpeakers] = useState([]);   // all speakers, unfiltered
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── filter state ──
  const [rawSearch, setRawSearch] = useState("");
  const [selectedSpeaker, setSelectedSpeaker] = useState(ALL_SPEAKERS);
  const searchQuery = useDebounce(rawSearch, 250);
  const searchInputRef = useRef(null);

  // ── pagination state ──
  const [page, setPage] = useState(1);

  // ── fetch — re-runs whenever meetingId, filters, or page changes ──────────
  useEffect(() => {
    if (!meetingId) {
      setLoading(false);
      return;
    }

    const fetchTranscript = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          page,
          limit: PAGE_LIMIT,
          ...(searchQuery  && { search:  searchQuery }),
          ...(selectedSpeaker !== ALL_SPEAKERS && { speaker: selectedSpeaker }),
        };

        const response = await api.get(
          `/meetings/${meetingId}/transcript`,
          { params }
        );

        const { transcript: td, pagination: pg, speakers: spk } =
          response.data?.data ?? {};

        if (!td) throw new Error("Transcript data was not returned.");

        setTranscript(td);
        if (pg)  setPagination(pg);
        if (spk) setSpeakers(spk);
      } catch (err) {
        console.error("Failed to fetch transcript:", err);
        setError(
          err.response?.data?.message ?? "Failed to load transcript."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTranscript();
  }, [meetingId, searchQuery, selectedSpeaker, page]);

  // Reset to page 1 when filters change (the fetch effect handles the re-fetch)
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedSpeaker]);

  // ── derived data (all from server) ───────────────────────────────────────
  const visibleSegments = transcript?.segments ?? [];
  const totalSegments   = pagination?.totalSegments ?? visibleSegments.length;
  const hasMore         = pagination?.hasNextPage ?? false;

  const hasActiveFilters =
    rawSearch.trim() !== "" || selectedSpeaker !== ALL_SPEAKERS;

  function clearFilters() {
    setRawSearch("");
    setSelectedSpeaker(ALL_SPEAKERS);
    setPage(1);
    searchInputRef.current?.focus();
  }

  // ── render guards ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-zinc-500">Loading transcript…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">
          Transcript unavailable
        </h2>
        <p className="mt-2 text-sm text-zinc-500">{error}</p>
      </div>
    );
  }

  if (!transcript) return null;

  // ── main render ───────────────────────────────────────────────────────────

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm">
      {/* ── Header ── */}
      <div className="border-b border-zinc-100 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">
              Meeting Transcript
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              AI-generated transcript of the conversation.
            </p>
          </div>

          {/* Segment count badge */}
          {totalSegments > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-500">
              {hasActiveFilters
                ? `${visibleSegments.length} of ${totalSegments} segments`
                : `${totalSegments} segments`}
            </span>
          )}
        </div>

        {/* ── Controls: search + speaker filter ── */}
        {totalSegments > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {/* Search input */}
            <div className="relative min-w-[220px] flex-1">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <SearchIcon />
              </span>
              <input
                ref={searchInputRef}
                id="transcript-search"
                type="search"
                value={rawSearch}
                onChange={(e) => setRawSearch(e.target.value)}
                placeholder="Search transcript…"
                aria-label="Search transcript text and speakers"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-9 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
              {rawSearch && (
                <button
                  onClick={() => setRawSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-zinc-700"
                >
                  <ClearIcon />
                </button>
              )}
            </div>

            {/* Speaker filter dropdown */}
            <div className="relative">
              <select
                id="transcript-speaker-filter"
                value={selectedSpeaker}
                onChange={(e) => setSelectedSpeaker(e.target.value)}
                aria-label="Filter by speaker"
                className="appearance-none rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-4 pr-9 text-sm text-zinc-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              >
                <option value={ALL_SPEAKERS}>All speakers</option>
                {speakers.map((spk) => (
                  <option key={spk} value={spk}>
                    {spk}
                  </option>
                ))}
              </select>
              <ChevronIcon />
            </div>

            {/* Clear all filters — only visible when something is active */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Body ── */}

      {/* No segments at all */}
      {totalSegments === 0 && (
        <div className="p-10 text-center">
          <p className="text-sm text-zinc-500">
            No transcript segments are available yet.
          </p>
        </div>
      )}

      {/* Filters active but nothing matched */}
      {totalSegments > 0 && visibleSegments.length === 0 && (
        <div className="flex flex-col items-center gap-3 p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
            <SearchIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-zinc-700">No results found</p>
            <p className="mt-1 text-sm text-zinc-500">
              Try adjusting your search or removing the speaker filter.
            </p>
          </div>
          <button
            onClick={clearFilters}
            className="mt-1 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Segment list */}
      {visibleSegments.length > 0 && (
        <>
          <div className="divide-y divide-zinc-100">
            {visibleSegments.map((item, index) => {
              const speaker = item.speaker || "Unknown Speaker";
              const { bg, text, ring } = getSpeakerColor(speaker);

              return (
                <div
                  key={`${item.startTime}-${index}`}
                  className="flex gap-5 px-6 py-5 transition hover:bg-zinc-50/60"
                >
                  {/* Color-coded avatar */}
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                    style={{
                      background: bg,
                      color: text,
                      boxShadow: `0 0 0 2px ${ring}`,
                    }}
                    aria-hidden="true"
                  >
                    {getInitials(speaker)}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="truncate text-sm font-semibold text-zinc-900">
                        {speaker}
                      </h3>
                      <span className="shrink-0 font-mono text-xs text-zinc-400">
                        {formatTranscriptTime(item.startTime)}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-7 text-zinc-600">
                      <HighlightedText
                        text={item.text ?? ""}
                        query={searchQuery}
                      />
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Load more (pagination) ── */}
          {hasMore && (
            <div className="border-t border-zinc-100 p-5 text-center">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-medium text-zinc-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
              >
                Load more{" "}
                <span className="text-zinc-400">
                  ({(pagination?.totalSegments ?? totalSegments) - (page * PAGE_LIMIT)} remaining)
                </span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}