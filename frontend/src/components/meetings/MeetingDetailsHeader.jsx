"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Users,
  Share2,
  Download,
  Check,
  Star,
  Pin,
  Hash,
} from "lucide-react";
import { toast } from "sonner";
import { useExportDrawer } from "@/context/ExportDrawerContext";
import api from "@/lib/api";
import PostToSlackModal from "./modals/PostToSlackModal";

export default function MeetingDetailsHeader({
  meeting,
  insights,
}) {
  const router = useRouter();
  const { setOpen, openExport } = useExportDrawer();
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFavorite, setIsFavorite] = useState(Boolean(meeting?.isFavorite));
  const [isPinned, setIsPinned] = useState(Boolean(meeting?.isPinned));
  const [slackModalOpen, setSlackModalOpen] = useState(false);

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    return new Intl.DateTimeFormat(
      "en-US",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    ).format(new Date(date));
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0 Minutes";

    const minutes = Math.round(
      seconds / 60
    );

    if (minutes < 60) {
      return `${minutes} ${
        minutes === 1 ? "Min" : "Mins"
      }`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    const remainingMinutes =
      minutes % 60;

    if (!remainingMinutes) {
      return `${hours} ${
        hours === 1 ? "Hour" : "Hours"
      }`;
    }

    return `${hours}h ${remainingMinutes}m`;
  };

  const participantCount =
    meeting?.participants?.length ||
    insights?.analytics?.speakerStats?.length ||
    0;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toast.success("Meeting workspace URL copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleToggleFavorite = async () => {
    const meetingId = meeting?._id || meeting?.id;
    if (!meetingId) return;

    const nextState = !isFavorite;
    setIsFavorite(nextState);

    if (nextState) {
      toast.success(`"${meeting.title || "Meeting"}" added to favorites! ⭐`);
    } else {
      toast.info(`"${meeting.title || "Meeting"}" removed from favorites`);
    }

    try {
      await api.patch(`/workspace/meetings/${meetingId}/favorite`);
    } catch (err) {
      setIsFavorite(!nextState);
      toast.error("Failed to update favorite status");
      console.error("Failed to toggle favorite:", err);
    }
  };

  const handleTogglePin = async () => {
    const meetingId = meeting?._id || meeting?.id;
    if (!meetingId) return;

    const nextState = !isPinned;
    setIsPinned(nextState);

    if (nextState) {
      toast.success(`"${meeting.title || "Meeting"}" pinned to workspace! 📌`);
    } else {
      toast.info(`"${meeting.title || "Meeting"}" unpinned from workspace`);
    }

    try {
      await api.patch(`/workspace/meetings/${meetingId}/pin`);
    } catch (err) {
      setIsPinned(!nextState);
      toast.error("Failed to update pin status");
      console.error("Failed to toggle pin:", err);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-5 shadow-2xl backdrop-blur-2xl sm:p-7 md:p-8">
      {/* Ambient background glow spot */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-transparent blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <button
            onClick={() => router.push("/meetings")}
            className="group mb-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-indigo-400 cursor-pointer"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Meetings</span>
          </button>

          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
            {meeting?.title || "Meeting Workspace"}
          </h1>

          <div className="mt-3.5 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 shadow-sm shadow-emerald-500/10">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span>AI Processed & Ready</span>
            </div>

            {meeting?.source && (
              <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300">
                {meeting.source}
              </span>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-4 sm:gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-2 rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-1.5">
              <CalendarDays size={15} className="text-indigo-400" />
              {formatDate(meeting?.meetingDate)}
            </span>

            <span className="flex items-center gap-2 rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-1.5">
              <Clock3 size={15} className="text-amber-400" />
              {formatDuration(meeting?.durationSeconds)}
            </span>

            <span className="flex items-center gap-2 rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-1.5">
              <Users size={15} className="text-cyan-400" />
              {participantCount}{" "}
              {participantCount === 1
                ? "Participant"
                : "Participants"}
            </span>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2.5 sm:gap-3 lg:w-auto">
          {/* Favorite Toggle Button */}
          <button
            onClick={handleToggleFavorite}
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition active:scale-95 cursor-pointer ${
              isFavorite
                ? "border-amber-500/30 bg-amber-500/15 text-amber-300 shadow-sm shadow-amber-500/20"
                : "border-white/[0.08] bg-white/[0.04] text-slate-200 hover:bg-white/10 hover:text-white"
            }`}
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Star
              size={15}
              className={isFavorite ? "fill-amber-400 text-amber-400" : ""}
            />
            <span>{isFavorite ? "Favorited" : "Favorite"}</span>
          </button>

          {/* Pin Toggle Button */}
          <button
            onClick={handleTogglePin}
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition active:scale-95 cursor-pointer ${
              isPinned
                ? "border-indigo-500/30 bg-indigo-500/15 text-indigo-300 shadow-sm shadow-indigo-500/20"
                : "border-white/[0.08] bg-white/[0.04] text-slate-200 hover:bg-white/10 hover:text-white"
            }`}
            title={isPinned ? "Unpin from Workspace" : "Pin to Workspace"}
          >
            <Pin
              size={15}
              className={isPinned ? "fill-indigo-400 text-indigo-400 rotate-45" : ""}
            />
            <span>{isPinned ? "Pinned" : "Pin"}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer"
            title="Share Link"
          >
            {copiedLink ? (
              <>
                <Check size={16} className="text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Share2 size={16} />
                <span>Share</span>
              </>
            )}
          </button>

          <button
            onClick={() => (openExport ? openExport(meeting) : setOpen(true))}
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer"
            title="Export Summary & Notes"
          >
            <Download size={16} />
            <span>Export</span>
          </button>

          <button
            onClick={() => setSlackModalOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-xs font-semibold text-amber-200 transition hover:bg-amber-500/20 hover:border-amber-500/40 hover:text-white active:scale-95 cursor-pointer"
            title="Post Summary to Slack"
          >
            <Hash size={15} className="text-amber-400" />
            <span>Post to Slack</span>
          </button>
        </div>
      </div>

      <PostToSlackModal
        isOpen={slackModalOpen}
        onClose={() => setSlackModalOpen(false)}
        meeting={meeting}
      />
    </div>
  );
}
