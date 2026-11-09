"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  ChevronUp,
} from "lucide-react";
import { useMeetingAudio } from "@/context/MeetingAudioContext";

function formatPlayerTime(seconds = 0) {
  const totalSeconds = Math.max(Math.floor(Number(seconds) || 0), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2];

// Deterministic waveform heights (50 bars)
const WAVEFORM_BARS = [
  30, 45, 60, 40, 75, 90, 65, 80, 50, 40, 70, 85, 95, 60, 40, 75, 90, 80, 55,
  65, 85, 100, 70, 50, 45, 65, 80, 95, 60, 40, 70, 85, 90, 50, 65, 80, 75, 60,
  45, 85, 95, 70, 55, 65, 80, 50, 40, 60, 75, 45,
];

export default function MeetingAudioPlayer() {
  const {
    duration,
    currentTime,
    progressPercentage,
    isPlaying,
    playbackRate,
    volume,
    isMuted,
    autoScroll,
    currentSpeaker,
    togglePlay,
    seek,
    skipForward,
    skipBackward,
    changePlaybackRate,
    changeVolume,
    toggleMute,
    setAutoScroll,
  } = useMeetingAudio();

  const [hoverTime, setHoverTime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(0);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const [volumeSliderOpen, setVolumeSliderOpen] = useState(false);
  const scrubberRef = useRef(null);
  const speedMenuRef = useRef(null);

  // Close speed dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (speedMenuRef.current && !speedMenuRef.current.contains(event.target)) {
        setSpeedMenuOpen(false);
      }
    }
    if (speedMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [speedMenuOpen]);

  const handleScrubberMouseMove = (e) => {
    if (!scrubberRef.current || duration <= 0) return;
    const rect = scrubberRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    setHoverPosition(percentage * 100);
    setHoverTime(percentage * duration);
  };

  const handleScrubberMouseLeave = () => {
    setHoverTime(null);
  };

  const handleScrubberClick = (e) => {
    if (!scrubberRef.current || duration <= 0) return;
    const rect = scrubberRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    seek(percentage * duration);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-5xl">
      <div className="relative rounded-[2rem] border border-white/10 bg-slate-950/85 p-3.5 shadow-2xl backdrop-blur-2xl sm:px-6 sm:py-3.5">
        {/* Glow ambient background spot (clipped inside its own container) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-32 w-96 rounded-full bg-gradient-to-t from-indigo-500/20 via-violet-500/10 to-transparent blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Controls & Current Speaker Pill */}
          <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => skipBackward(10)}
                className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer"
                title="Rewind 10 seconds"
              >
                <RotateCcw size={15} />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-600/30 transition hover:scale-105 active:scale-95 cursor-pointer"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause size={18} className="fill-white" />
                ) : (
                  <Play size={18} className="fill-white ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => skipForward(10)}
                className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer"
                title="Forward 10 seconds"
              >
                <RotateCw size={15} />
              </button>
            </div>

            {/* Speaker Indicator */}
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 min-w-0">
              <Radio
                size={14}
                className={
                  isPlaying
                    ? "text-emerald-400 animate-pulse"
                    : "text-slate-500"
                }
              />
              <div className="truncate text-xs">
                {currentSpeaker ? (
                  <span className="font-semibold text-slate-200">
                    <span className="text-slate-400 font-normal">Speaker: </span>
                    {currentSpeaker}
                  </span>
                ) : (
                  <span className="text-slate-400">Audio Sync Ready</span>
                )}
              </div>
            </div>
          </div>

          {/* Center: Waveform Scrubber & Timestamps */}
          <div className="flex flex-1 items-center gap-3 px-1 sm:px-4">
            <span className="w-12 text-right font-mono text-xs text-slate-300 shrink-0">
              {formatPlayerTime(currentTime)}
            </span>

            {/* Interactive Waveform Scrubber */}
            <div
              ref={scrubberRef}
              onClick={handleScrubberClick}
              onMouseMove={handleScrubberMouseMove}
              onMouseLeave={handleScrubberMouseLeave}
              className="group relative flex h-10 flex-1 items-center cursor-pointer select-none"
            >
              {/* Waveform Bars Container */}
              <div className="flex h-7 w-full items-center justify-between gap-[2px]">
                {WAVEFORM_BARS.map((heightPercent, index) => {
                  const barProgress = (index / (WAVEFORM_BARS.length - 1)) * 100;
                  const isPast = barProgress <= progressPercentage;

                  return (
                    <div
                      key={index}
                      className="relative flex h-full flex-1 items-center justify-center"
                    >
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-full transition-all duration-100 ${
                          isPast
                            ? "bg-gradient-to-t from-indigo-500 to-violet-400 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                            : "bg-white/[0.12] group-hover:bg-white/[0.2]"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Scrubber Playhead / Handle */}
              <div
                style={{ left: `${progressPercentage}%` }}
                className="pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              >
                <div className="size-3.5 rounded-full border-2 border-white bg-indigo-500 shadow-md shadow-indigo-500/50" />
              </div>

              {/* Hover Tooltip */}
              {hoverTime !== null && (
                <div
                  style={{ left: `${hoverPosition}%` }}
                  className="pointer-events-none absolute -top-7 -translate-x-1/2 rounded-md bg-slate-900 border border-white/20 px-1.5 py-0.5 text-[10px] font-mono text-slate-200 shadow-lg"
                >
                  {formatPlayerTime(hoverTime)}
                </div>
              )}
            </div>

            <span className="w-12 text-left font-mono text-xs text-slate-400 shrink-0">
              {formatPlayerTime(duration)}
            </span>
          </div>

          {/* Right: Speed, Volume & Auto-Scroll Controls */}
          <div className="flex items-center justify-end gap-2 shrink-0">
            {/* Auto-scroll toggle */}
            <button
              type="button"
              onClick={() => setAutoScroll(!autoScroll)}
              className={`flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                autoScroll
                  ? "border-indigo-500/40 bg-indigo-500/15 text-indigo-300"
                  : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
              }`}
              title={
                autoScroll
                  ? "Auto-scroll transcript enabled"
                  : "Auto-scroll transcript disabled"
              }
            >
              <Sparkles size={13} />
              <span className="hidden sm:inline">Auto-scroll</span>
            </button>

            {/* Playback Speed Menu */}
            <div className="relative" ref={speedMenuRef}>
              <button
                type="button"
                onClick={() => setSpeedMenuOpen(!speedMenuOpen)}
                className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
                title="Playback speed"
              >
                <span>{playbackRate}x</span>
                <ChevronUp
                  size={12}
                  className={`transition-transform duration-200 ${
                    speedMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {speedMenuOpen && (
                <div className="absolute bottom-full right-0 mb-3 w-28 rounded-2xl border border-white/15 bg-slate-950/95 p-1.5 shadow-2xl backdrop-blur-2xl z-50">
                  {SPEED_OPTIONS.map((speed) => (
                    <button
                      key={speed}
                      type="button"
                      onClick={() => {
                        changePlaybackRate(speed);
                        setSpeedMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                        playbackRate === speed
                          ? "bg-indigo-600 text-white font-semibold"
                          : "text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      <span>{speed}x</span>
                      {playbackRate === speed && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Volume Control */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => setVolumeSliderOpen(true)}
              onMouseLeave={() => setVolumeSliderOpen(false)}
            >
              <button
                type="button"
                onClick={toggleMute}
                className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/10 hover:text-white cursor-pointer"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={15} className="text-rose-400" />
                ) : (
                  <Volume2 size={15} />
                )}
              </button>

              {/* Volume Slider Popover */}
              {volumeSliderOpen && (
                <div className="absolute bottom-full right-0 mb-3 flex h-28 w-10 flex-col items-center justify-center rounded-2xl border border-white/15 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-2xl z-50">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => changeVolume(parseFloat(e.target.value))}
                    className="h-20 w-1.5 appearance-none rounded-full bg-slate-800 accent-indigo-500 cursor-pointer [writing-mode:bt-lr] [-webkit-appearance:slider-vertical]"
                  />
                  <span className="mt-1 text-[10px] font-mono text-slate-400">
                    {Math.round((isMuted ? 0 : volume) * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
