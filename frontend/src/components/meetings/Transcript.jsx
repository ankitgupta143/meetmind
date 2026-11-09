"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X, ChevronDown, Sparkles, UserCheck, Pencil, Play } from "lucide-react";
import api from "@/lib/api";
import SpeakerRenameModal from "./modals/SpeakerRenameModal";
import { useMeetingAudio } from "@/context/MeetingAudioContext";

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

/** Stable speaker → hue mapping */
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
    bg: `hsla(${h}, 70%, 55%, 0.15)`,
    text: `hsl(${h}, 85%, 75%)`,
    ring: `hsla(${h}, 75%, 65%, 0.4)`,
  };
}

function useDebounce(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function HighlightedText({ text, query }) {
  if (!query) return <>{text}</>;

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="rounded bg-indigo-500/30 px-1 py-0.5 text-indigo-200 border border-indigo-500/40"
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

const ALL_SPEAKERS = "__all__";
const PAGE_LIMIT = 50;

export default function Transcript({ meetingId, participants = [], onSpeakerUpdated }) {
  const {
    currentTime = 0,
    isPlaying = false,
    seekAndPlay = () => {},
    autoScroll = true,
    setSegments = () => {},
  } = useMeetingAudio();

  const activeSegmentRef = useRef(null);

  const [transcript, setTranscript] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(Boolean(meetingId));
  const [error, setError] = useState("");

  const [rawSearch, setRawSearch] = useState("");
  const [selectedSpeaker, setSelectedSpeaker] = useState(ALL_SPEAKERS);
  const searchQuery = useDebounce(rawSearch, 250);
  const searchInputRef = useRef(null);

  const [page, setPage] = useState(1);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Speaker rename modal state
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameInitialSpeaker, setRenameInitialSpeaker] = useState(null);

  useEffect(() => {
    if (!meetingId) {
      return;
    }

    let isMounted = true;

    const fetchTranscript = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          page,
          limit: PAGE_LIMIT,
          ...(searchQuery && { search: searchQuery }),
          ...(selectedSpeaker !== ALL_SPEAKERS && { speaker: selectedSpeaker }),
        };

        const response = await api.get(
          `/meetings/${meetingId}/transcript`,
          { params }
        );

        const { transcript: td, pagination: pg, speakers: spk } =
          response.data?.data ?? {};

        if (!isMounted) return;

        if (!td) throw new Error("Transcript data was not returned.");

        setTranscript(td);
        if (pg) setPagination(pg);
        if (spk) setSpeakers(spk);
        if (td.segments) {
          setSegments(td.segments);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to fetch transcript:", err);
        setError(
          err.response?.data?.message ?? "Failed to load transcript."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTranscript();

    return () => {
      isMounted = false;
    };
  }, [meetingId, searchQuery, selectedSpeaker, page, reloadTrigger, setSegments]);

  const handleSpeakerRenameSuccess = (result) => {
    if (result?.speakers) {
      setSpeakers(result.speakers);
    }
    setReloadTrigger((prev) => prev + 1);
    if (onSpeakerUpdated) {
      onSpeakerUpdated(result);
    }
  };

  // Auto-scroll active segment into view when playing
  useEffect(() => {
    if (autoScroll && isPlaying && activeSegmentRef.current) {
      activeSegmentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentTime, autoScroll, isPlaying]);

  const visibleSegments = transcript?.segments ?? [];
  const totalMatchingSegments = pagination?.totalSegments ?? visibleSegments.length;
  const totalAllSegments = pagination?.totalUnfilteredSegments ?? totalMatchingSegments;
  const hasMore = pagination?.hasNextPage ?? false;

  const hasActiveFilters =
    rawSearch.trim() !== "" || selectedSpeaker !== ALL_SPEAKERS;

  // Has transcript content in this meeting
  const hasTranscriptContent = totalAllSegments > 0 || (transcript?.rawText && transcript.rawText.length > 0);

  function clearFilters() {
    setRawSearch("");
    setSelectedSpeaker(ALL_SPEAKERS);
    setPage(1);
    searchInputRef.current?.focus();
  }

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-12 text-center shadow-xl backdrop-blur-2xl">
        <div className="inline-flex h-10 w-10 animate-spin items-center justify-center rounded-full border-2 border-indigo-500 border-t-transparent" />
        <p className="mt-4 text-xs font-medium text-slate-400">Loading transcript data…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-rose-500/20 bg-slate-950/60 p-10 text-center shadow-xl backdrop-blur-2xl">
        <h2 className="text-base font-semibold text-rose-400">
          Transcript unavailable
        </h2>
        <p className="mt-2 text-xs text-slate-400">{error}</p>
      </div>
    );
  }

  if (!transcript) return null;

  return (
    <>
      <div className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-slate-950/60 shadow-xl backdrop-blur-2xl">
        {/* Header */}
        <div className="border-b border-white/[0.08] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Meeting Transcript
                <Sparkles size={16} className="text-indigo-400" />
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                AI-diarized timestamped conversation stream.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {totalAllSegments > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-300">
                  {hasActiveFilters
                    ? `${totalMatchingSegments} of ${totalAllSegments} segments`
                    : `${totalAllSegments} segments`}
                </span>
              )}

              {speakers.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setRenameInitialSpeaker(null);
                    setRenameModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-500/20 active:scale-95 cursor-pointer shadow-sm"
                  title="Rename speakers across the transcript"
                >
                  <UserCheck size={14} className="text-indigo-400" />
                  <span>Rename Speakers</span>
                </button>
              )}
            </div>
          </div>

          {/* Controls: Always visible if transcript has content or active filters */}
          {(hasTranscriptContent || hasActiveFilters) && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="relative min-w-[220px] flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={rawSearch}
                  onChange={(e) => {
                    setRawSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search keywords or dialogue…"
                  className="w-full rounded-xl border border-white/[0.08] bg-slate-900/80 py-2.5 pl-10 pr-9 text-xs text-slate-200 placeholder-slate-500 outline-none transition focus:border-indigo-500/50 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                />
                {rawSearch && (
                  <button
                    onClick={() => {
                      setRawSearch("");
                      setPage(1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="relative">
                <select
                  value={selectedSpeaker}
                  onChange={(e) => {
                    setSelectedSpeaker(e.target.value);
                    setPage(1);
                  }}
                  className="appearance-none rounded-xl border border-white/[0.08] bg-slate-900/80 py-2.5 pl-3.5 pr-8 text-xs font-medium text-slate-300 outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                >
                  <option value={ALL_SPEAKERS} className="bg-slate-900 text-slate-200">All speakers</option>
                  {speakers.map((spk) => (
                    <option key={spk} value={spk} className="bg-slate-900 text-slate-200">
                      {spk}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* Body: No transcript available at all in this meeting */}
        {!hasTranscriptContent && !hasActiveFilters && (
          <div className="p-10 text-center">
            <p className="text-xs text-slate-400">
              No transcript segments are available yet.
            </p>
          </div>
        )}

        {/* Body: Active filters with 0 matching results */}
        {hasActiveFilters && visibleSegments.length === 0 && (
          <div className="flex flex-col items-center gap-3 p-10 text-center">
            <p className="font-semibold text-sm text-slate-300">
              No matching dialogue found
              {searchQuery && (
                <span className="text-indigo-400"> for &ldquo;{searchQuery}&rdquo;</span>
              )}
            </p>
            <p className="text-xs text-slate-400">
              Try adjusting your search query or speaker filter.
            </p>
            <button
              onClick={clearFilters}
              className="mt-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}

        {visibleSegments.length > 0 && (
          <>
            <div className="divide-y divide-white/[0.05]">
              {visibleSegments.map((item, index) => {
                const speaker = item.speaker || "Unknown Speaker";
                const { bg, text, ring } = getSpeakerColor(speaker);
                const isActive =
                  currentTime >= (item.startTime ?? 0) &&
                  currentTime < (item.endTime ?? Infinity);

                return (
                  <div
                    key={`${item.startTime}-${index}`}
                    ref={isActive ? activeSegmentRef : null}
                    onClick={(e) => {
                      if (e.target.closest("button")) return;
                      seekAndPlay(item.startTime);
                    }}
                    className={`group flex gap-4 px-5 py-4 transition-all duration-300 border-l-4 cursor-pointer ${
                      isActive
                        ? "border-indigo-400 bg-indigo-500/[0.08] shadow-md shadow-indigo-500/10 pl-6"
                        : "border-transparent hover:bg-white/[0.03] hover:pl-6 hover:border-slate-700"
                    }`}
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-sm transition-transform group-hover:scale-105"
                      style={{
                        background: bg,
                        color: text,
                        border: `1px solid ${ring}`,
                      }}
                    >
                      {getInitials(speaker)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 min-w-0">
                          <h3
                            className={`truncate text-xs font-bold tracking-tight transition ${
                              isActive ? "text-indigo-300" : "text-slate-200 group-hover:text-white"
                            }`}
                          >
                            {speaker}
                          </h3>

                          {/* Sound Equalizer Pill when this speaker is actively talking */}
                          {isActive && isPlaying && (
                            <div className="flex items-end gap-[2px] h-3.5 px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                              <span className="h-1.5 w-0.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="h-3 w-0.5 rounded-full bg-emerald-400 animate-pulse delay-75" />
                              <span className="h-2 w-0.5 rounded-full bg-emerald-400 animate-pulse delay-150" />
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRenameInitialSpeaker(speaker);
                              setRenameModalOpen(true);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition rounded p-1 text-slate-400 hover:text-indigo-300 hover:bg-white/[0.08] cursor-pointer"
                            title={`Rename ${speaker}`}
                          >
                            <Pencil size={11} />
                          </button>
                        </div>

                        {/* Interactive Timestamp Seek Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            seekAndPlay(item.startTime);
                          }}
                          className={`flex items-center gap-1.5 shrink-0 rounded-lg border px-2 py-0.5 font-mono text-[11px] transition cursor-pointer ${
                            isActive
                              ? "border-indigo-400/50 bg-indigo-500/20 text-indigo-300 shadow-sm"
                              : "border-white/[0.06] bg-white/[0.04] text-slate-400 hover:text-white hover:bg-indigo-600/30 hover:border-indigo-500/40"
                          }`}
                          title={`Play from ${formatTranscriptTime(item.startTime)}`}
                        >
                          <Play
                            size={10}
                            className={isActive ? "fill-indigo-400 text-indigo-400" : "fill-current"}
                          />
                          <span>{formatTranscriptTime(item.startTime)}</span>
                        </button>
                      </div>

                      <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
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

            {hasMore && (
              <div className="border-t border-white/[0.08] p-4 text-center">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-xl border border-indigo-500/30 bg-indigo-500/15 px-6 py-2 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-500/25 active:scale-95 cursor-pointer"
                >
                  Load more segments
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Speaker Rename Modal */}
      <SpeakerRenameModal
        isOpen={renameModalOpen}
        onClose={() => setRenameModalOpen(false)}
        meetingId={meetingId}
        speakers={speakers}
        initialSpeaker={renameInitialSpeaker}
        participants={participants}
        onSuccess={handleSpeakerRenameSuccess}
      />
    </>
  );
}
