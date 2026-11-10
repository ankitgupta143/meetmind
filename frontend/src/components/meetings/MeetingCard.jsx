"use client";

import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  Users,
  ChevronRight,
  Star,
  Pin,
  Download,
  Pencil,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";
import { useExportDrawer } from "@/context/ExportDrawerContext";
import EditMeetingModal from "./modals/EditMeetingModal";
import DeleteMeetingModal from "./modals/DeleteMeetingModal";

const statusStyles = {
  Completed: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
  Processing: "bg-amber-500/15 border-amber-500/30 text-amber-300",
  "Summary Ready": "bg-indigo-500/15 border-indigo-500/30 text-indigo-300",
  Failed: "bg-rose-500/15 border-rose-500/30 text-rose-300",
};

export default function MeetingCard({
  meeting,
  onMeetingUpdated,
  onMeetingDeleted,
}) {
  const router = useRouter();
  const { openExport } = useExportDrawer();
  const meetingId = meeting?.id || meeting?._id;
  const [isFavorite, setIsFavorite] = useState(Boolean(meeting?.isFavorite));
  const [isPinned, setIsPinned] = useState(Boolean(meeting?.isPinned));
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleClick = () => {
    if (meetingId) {
      router.push(`/meetings/${meetingId}`);
    }
  };

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
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

  const handleTogglePin = async (e) => {
    e.stopPropagation();
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
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          handleClick();
        }
      }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors duration-200 hover:border-indigo-300/30 hover:bg-surface-raised cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h3 className="text-base font-semibold text-foreground group-hover:text-indigo-200 transition-colors">
              {meeting.title}
            </h3>

            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${
                statusStyles[meeting.status] || "bg-white/10 text-white"
              }`}
            >
              {meeting.status}
            </span>

            {/* Favorite Star Button */}
            <button
              type="button"
              onClick={handleToggleFavorite}
              className={`rounded-lg p-1.5 transition cursor-pointer ${
                isFavorite
                  ? "text-amber-400 bg-amber-400/10"
                  : "text-slate-500 hover:text-amber-400 hover:bg-white/[0.06]"
              }`}
              title={isFavorite ? "Favorited (Click to remove)" : "Add to workspace favorites"}
            >
              <Star
                size={14}
                className={isFavorite ? "fill-amber-400 text-amber-400" : ""}
              />
            </button>

            {/* Pin Button */}
            <button
              type="button"
              onClick={handleTogglePin}
              className={`rounded-lg p-1.5 transition cursor-pointer ${
                isPinned
                  ? "text-indigo-400 bg-indigo-500/15"
                  : "text-slate-500 hover:text-indigo-400 hover:bg-white/[0.06]"
              }`}
              title={isPinned ? "Pinned (Click to unpin)" : "Pin to workspace"}
            >
              <Pin
                size={14}
                className={isPinned ? "fill-indigo-400 text-indigo-400 rotate-45" : ""}
              />
            </button>

            {/* Quick Export Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openExport?.(meeting);
              }}
              className="rounded-lg p-1.5 text-slate-500 hover:text-emerald-400 hover:bg-white/[0.06] transition cursor-pointer"
              title="Export meeting report"
            >
              <Download size={14} />
            </button>

            {/* Quick Edit Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setEditModalOpen(true);
              }}
              className="rounded-lg p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-white/[0.06] transition cursor-pointer"
              title="Edit meeting details"
            >
              <Pencil size={14} />
            </button>

            {/* Quick Delete Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteModalOpen(true);
              }}
              className="rounded-lg p-1.5 text-slate-500 hover:text-rose-400 hover:bg-white/[0.06] transition cursor-pointer"
              title="Delete meeting"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} className="text-indigo-400" />
              {meeting.date}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock3 size={14} className="text-amber-400" />
              {meeting.duration}
            </span>

            <span className="flex items-center gap-1.5">
              <Users size={14} className="text-cyan-400" />
              {meeting.participants} Participants
            </span>

            {/* Audio waveform micro-indicator */}
            <div className="hidden md:flex items-center gap-1 text-[11px] font-mono text-slate-500">
              <div className="flex items-end gap-0.5 h-3.5">
                <span className="w-0.5 h-2 bg-indigo-400 rounded-full wave-bar-1" />
                <span className="w-0.5 h-3.5 bg-indigo-400 rounded-full wave-bar-2" />
                <span className="w-0.5 h-1.5 bg-indigo-400 rounded-full wave-bar-3" />
                <span className="w-0.5 h-3 bg-indigo-400 rounded-full wave-bar-4" />
              </div>
              <span className="ml-1 text-[10px]">AI Diarized</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center text-xs font-semibold text-slate-400 group-hover:text-indigo-300">
          <span className="hidden sm:inline">Open Workspace</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 group-hover:border-transparent">
            <ChevronRight size={16} />
          </div>
        </div>
      </div>

      <EditMeetingModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        meeting={meeting}
        onUpdated={(updated) => {
          onMeetingUpdated?.(updated);
        }}
      />

      <DeleteMeetingModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        meeting={meeting}
        onDeleted={(deletedId) => {
          onMeetingDeleted?.(deletedId);
        }}
      />
    </div>
  );
}
