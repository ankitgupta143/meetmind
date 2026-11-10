"use client";

import { useState, useEffect, useSyncExternalStore, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  AlertTriangle,
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

export default function DeleteMeetingModal({
  isOpen,
  onClose,
  meeting,
  onDeleted,
}) {
  const isClient = useIsClient();
  const meetingId = meeting?._id || meeting?.id;
  const meetingTitle = meeting?.title || "Untitled Meeting";

  const [isDeleting, setIsDeleting] = useState(false);

  const handleClose = useCallback(() => {
    if (isDeleting) return;
    onClose();
  }, [isDeleting, onClose]);

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

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, handleClose]);

  const handleDelete = async () => {
    if (!meetingId) {
      toast.error("Invalid meeting ID.");
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete(`/meetings/${meetingId}`);
      toast.success(`"${meetingTitle}" has been deleted.`);

      if (onDeleted) {
        onDeleted(meetingId);
      }
      handleClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete meeting. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isClient || !isOpen) return null;

  return createPortal(
    <AnimatePresence>
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
          className="relative z-10 w-full max-w-md rounded-3xl border border-rose-500/20 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-2xl sm:p-7"
        >
          {/* Header Icon */}
          <div className="flex items-center justify-between">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-md">
              <Trash2 className="size-6 text-rose-400" />
            </div>

            <button
              onClick={handleClose}
              disabled={isDeleting}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer disabled:opacity-50"
            >
              <X size={18} />
            </button>
          </div>

          {/* Text Content */}
          <div className="mt-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Delete Meeting?
            </h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-white">&ldquo;{meetingTitle}&rdquo;</span>?
            </p>
            <div className="mt-3.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] text-rose-300 flex items-start gap-2.5">
              <AlertTriangle className="size-4 shrink-0 mt-0.5 text-rose-400" />
              <span>
                This will remove the meeting, its transcript, AI insights, and deliverables from your workspace and search index.
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={handleClose}
              disabled={isDeleting}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-white/[0.06] hover:text-white transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-rose-600/25 hover:shadow-rose-600/40 active:scale-95 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <LoaderCircle size={14} className="animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 size={14} />
                  <span>Delete Meeting</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
