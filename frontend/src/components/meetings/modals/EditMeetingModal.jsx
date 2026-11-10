"use client";

import { useState, useEffect, useSyncExternalStore, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Pencil,
  LoaderCircle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function formatInitialDate(meeting) {
  if (meeting?.meetingDate || meeting?.createdAt) {
    try {
      const d = new Date(meeting.meetingDate || meeting.createdAt);
      const offset = d.getTimezoneOffset() * 60000;
      return new Date(d.getTime() - offset).toISOString().slice(0, 16);
    } catch (_) {
      return "";
    }
  }
  return "";
}

function EditMeetingDialogContent({
  meeting,
  onClose,
  onUpdated,
}) {
  const meetingId = meeting?._id || meeting?.id;

  const [title, setTitle] = useState(() => meeting?.title || "");
  const [description, setDescription] = useState(() => meeting?.description || "");
  const [meetingDate, setMeetingDate] = useState(() => formatInitialDate(meeting));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    onClose();
  }, [isSubmitting, onClose]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isSubmitting) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, handleClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Meeting title cannot be empty.");
      return;
    }

    if (!meetingId) {
      toast.error("Invalid meeting ID.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
      };

      if (meetingDate) {
        payload.meetingDate = new Date(meetingDate).toISOString();
      }

      const response = await api.patch(`/meetings/${meetingId}`, payload);
      const updatedMeeting = response.data?.data?.meeting;

      toast.success("Meeting details updated successfully! ✨");
      if (onUpdated && updatedMeeting) {
        onUpdated(updatedMeeting);
      }
      handleClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update meeting details."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-2xl sm:p-7 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 shadow-md">
              <Pencil className="size-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Edit Meeting Details
                <Sparkles size={15} className="text-indigo-400" />
              </h3>
              <p className="text-xs text-slate-400">
                Update title, overview description, or scheduled timestamp
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Meeting Title <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Q4 Product Roadmap & Sprint Planning"
                maxLength={200}
                required
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Meeting Description / Agenda
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of meeting objectives, discussion scope, or notes..."
              rows={3}
              maxLength={2000}
              className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/60 p-3.5 text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Meeting Date & Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Meeting Date & Time
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-white/[0.06] hover:text-white transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 active:scale-95 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle size={14} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Pencil size={14} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function EditMeetingModal({
  isOpen,
  onClose,
  meeting,
  onUpdated,
}) {
  const isClient = useIsClient();

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isClient || !isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <EditMeetingDialogContent
        key={`${meeting?._id || meeting?.id || "edit"}-${isOpen}`}
        meeting={meeting}
        onClose={onClose}
        onUpdated={onUpdated}
      />
    </AnimatePresence>,
    document.body
  );
}
