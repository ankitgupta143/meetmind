"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";

const MeetingAudioContext = createContext(null);

export function MeetingAudioProvider({ meeting, children }) {
  const audioRef = useRef(null);
  const syntheticTimerRef = useRef(null);

  const audioUrl = meeting?.recording?.url || null;
  const fallbackDuration = Math.max(
    Number(meeting?.durationSeconds || meeting?.recording?.durationSeconds) || 1680,
    30
  );

  const [audioDuration, setAudioDuration] = useState(0);
  const duration = audioDuration > 0 ? audioDuration : fallbackDuration;

  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [segments, setSegments] = useState([]);

  // Compute active segment based on currentTime
  const activeSegment = useMemo(() => {
    if (!segments || segments.length === 0) return null;
    return (
      segments.find(
        (seg) =>
          currentTime >= (seg.startTime ?? 0) &&
          currentTime < (seg.endTime ?? Infinity)
      ) || null
    );
  }, [segments, currentTime]);

  const currentSpeaker = activeSegment?.speaker || null;

  // Clean up synthetic timer on unmount
  useEffect(() => {
    return () => {
      if (syntheticTimerRef.current) {
        clearInterval(syntheticTimerRef.current);
      }
    };
  }, []);

  // Synthetic timer ticker for meetings without an external audio URL
  useEffect(() => {
    if (!audioUrl) {
      if (isPlaying) {
        const intervalMs = 100;
        const increment = (intervalMs / 1000) * playbackRate;

        syntheticTimerRef.current = setInterval(() => {
          setCurrentTime((prev) => {
            const next = prev + increment;
            if (next >= duration) {
              setIsPlaying(false);
              return 0;
            }
            return next;
          });
        }, intervalMs);
      } else {
        if (syntheticTimerRef.current) {
          clearInterval(syntheticTimerRef.current);
        }
      }

      return () => {
        if (syntheticTimerRef.current) {
          clearInterval(syntheticTimerRef.current);
        }
      };
    }
  }, [audioUrl, isPlaying, playbackRate, duration]);

  // Handle HTML5 Audio element event listeners if audioUrl is present
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        setAudioDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);

  // Play / Pause controls
  const play = useCallback(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.warn("Audio play prevented:", err);
      });
    }
    setIsPlaying(true);
  }, [audioUrl]);

  const pause = useCallback(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  }, [audioUrl]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  // Seek control
  const seek = useCallback(
    (seconds) => {
      const clamped = Math.max(0, Math.min(Number(seconds) || 0, duration));
      setCurrentTime(clamped);
      if (audioUrl && audioRef.current) {
        audioRef.current.currentTime = clamped;
      }
    },
    [audioUrl, duration]
  );

  const seekAndPlay = useCallback(
    (seconds) => {
      seek(seconds);
      play();
    },
    [seek, play]
  );

  // Skip controls (-10s / +10s)
  const skipForward = useCallback(
    (offset = 10) => {
      seek(currentTime + offset);
    },
    [currentTime, seek]
  );

  const skipBackward = useCallback(
    (offset = 10) => {
      seek(currentTime - offset);
    },
    [currentTime, seek]
  );

  // Playback rate
  const changePlaybackRate = useCallback(
    (rate) => {
      setPlaybackRate(rate);
      if (audioUrl && audioRef.current) {
        audioRef.current.playbackRate = rate;
      }
    },
    [audioUrl]
  );

  // Volume & Mute
  const changeVolume = useCallback(
    (newVolume) => {
      const clamped = Math.max(0, Math.min(1, newVolume));
      setVolume(clamped);
      if (clamped === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
      if (audioUrl && audioRef.current) {
        audioRef.current.volume = clamped;
        audioRef.current.muted = clamped === 0;
      }
    },
    [audioUrl, isMuted]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioUrl && audioRef.current) {
        audioRef.current.muted = next;
      }
      return next;
    });
  }, [audioUrl]);

  const value = {
    audioUrl,
    hasRealAudio: Boolean(audioUrl),
    duration,
    currentTime,
    progressPercentage: duration > 0 ? (currentTime / duration) * 100 : 0,
    isPlaying,
    playbackRate,
    volume,
    isMuted,
    autoScroll,
    currentSpeaker,
    activeSegment,
    segments,
    setSegments,
    setAutoScroll,
    play,
    pause,
    togglePlay,
    seek,
    seekAndPlay,
    skipForward,
    skipBackward,
    changePlaybackRate,
    changeVolume,
    toggleMute,
  };

  return (
    <MeetingAudioContext.Provider value={value}>
      {children}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
          className="hidden"
        />
      )}
    </MeetingAudioContext.Provider>
  );
}

export function useMeetingAudio() {
  const context = useContext(MeetingAudioContext);
  return context || {
    duration: 0,
    currentTime: 0,
    progressPercentage: 0,
    isPlaying: false,
    playbackRate: 1,
    volume: 1,
    isMuted: false,
    autoScroll: false,
    currentSpeaker: null,
    activeSegment: null,
    segments: [],
    setSegments: () => {},
    setAutoScroll: () => {},
    play: () => {},
    pause: () => {},
    togglePlay: () => {},
    seek: () => {},
    seekAndPlay: () => {},
    skipForward: () => {},
    skipBackward: () => {},
    changePlaybackRate: () => {},
    changeVolume: () => {},
    toggleMute: () => {},
  };
}
