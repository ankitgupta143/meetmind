"use client";

import { useEffect, useState, useMemo, useSyncExternalStore, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserCheck, LoaderCircle, Check, ArrowRight, Sparkles } from "lucide-react";
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

export default function SpeakerRenameModal({
  isOpen,
  onClose,
  meetingId,
  speakers = [],
  initialSpeaker = null,
  participants = [],
  onSuccess,
}) {
  const isClient = useIsClient();
  const [customMapping, setCustomMapping] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format attendee names for 1-click assignment
  const attendeeNames = useMemo(() => {
    if (!Array.isArray(participants)) return [];
    return participants
      .map((p) => {
        if (!p) return null;
        if (typeof p === "string") return p.trim();
        return p.name || p.displayName || null;
      })
      .filter(Boolean);
  }, [participants]);

  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    setCustomMapping({});
    onClose();
  }, [isSubmitting, onClose]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, handleClose]);

  const handleNameChange = (oldName, newName) => {
    setCustomMapping((prev) => ({
      ...prev,
      [oldName]: newName,
    }));
  };

  const hasChanges = useMemo(() => {
    return Object.entries(customMapping).some(([oldName, newName]) => {
      return newName && newName.trim() && newName.trim() !== oldName;
    });
  }, [customMapping]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!hasChanges || isSubmitting || !meetingId) return;

    // Filter only modified names
    const speakerMapping = {};
    for (const [oldName, newName] of Object.entries(customMapping)) {
      if (newName && newName.trim() && newName.trim() !== oldName) {
        speakerMapping[oldName] = newName.trim();
      }
    }

    setIsSubmitting(true);
    try {
      const response = await api.patch(`/meetings/${meetingId}/speakers`, {
        speakerMapping,
      });

      const updatedCount = response.data?.data?.updatedSegmentsCount ?? 0;
      toast.success(
        `Speakers updated successfully across ${updatedCount} dialogue segments! 🎉`
      );

      if (onSuccess) {
        onSuccess(response.data?.data);
      }
      setCustomMapping({});
      onClose();
    } catch (err) {
      console.error("Failed to update speaker names:", err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to update speaker names. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="speaker-rename-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            className="relative z-10 flex flex-col w-full max-w-xl max-h-[85vh] rounded-3xl border border-white/10 bg-slate-950/95 text-slate-100 shadow-2xl backdrop-blur-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
                  <UserCheck size={20} />
                </span>
                <div>
                  <h2
                    id="speaker-rename-title"
                    className="text-base font-bold text-white flex items-center gap-2"
                  >
                    Identify & Rename Speakers
                    <Sparkles size={14} className="text-cyan-400" />
                  </h2>
                  <p className="text-xs text-slate-400">
                    Assign real team member names across all dialogue segments.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50 cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {speakers.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No distinct speakers were detected in this meeting yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {speakers.map((spk) => {
                    const isTarget = initialSpeaker === spk;
                    const currentValue = customMapping[spk] !== undefined ? customMapping[spk] : spk;
                    const isChanged = currentValue.trim() !== spk && currentValue.trim().length > 0;

                    return (
                      <div
                        key={spk}
                        className={`rounded-2xl border p-4 transition ${
                          isTarget
                            ? "border-indigo-500/50 bg-indigo-500/[0.08]"
                            : "border-white/[0.06] bg-slate-900/40 hover:border-white/10"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          {/* Current speaker tag */}
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-mono font-semibold text-slate-200">
                              {spk}
                            </span>
                            <ArrowRight size={14} className="text-slate-500 hidden sm:inline" />
                          </div>

                          {/* New name input */}
                          <div className="flex-1 sm:max-w-xs">
                            <input
                              type="text"
                              value={currentValue}
                              onChange={(e) => handleNameChange(spk, e.target.value)}
                              placeholder={`Enter real name for ${spk}`}
                              className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            />
                          </div>
                        </div>

                        {/* 1-Click Attendee Suggestions */}
                        {attendeeNames.length > 0 && (
                          <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/[0.04]">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mr-1">
                              1-Click Assign:
                            </span>
                            {attendeeNames.map((name) => {
                              const isSelected = currentValue === name;
                              return (
                                <button
                                  key={name}
                                  type="button"
                                  onClick={() => handleNameChange(spk, name)}
                                  className={`rounded-lg px-2 py-0.5 text-[11px] font-medium transition cursor-pointer ${
                                    isSelected
                                      ? "bg-indigo-600 text-white font-semibold shadow-sm"
                                      : "border border-white/10 bg-white/[0.04] text-slate-300 hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-200"
                                  }`}
                                >
                                  {isSelected && <Check size={10} className="inline mr-1" />}
                                  {name}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {isChanged && (
                          <p className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1">
                            <Check size={12} /> Will rename &ldquo;{spk}&rdquo; to &ldquo;{currentValue.trim()}&rdquo; across all segments
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </form>

            {/* Footer */}
            <div className="border-t border-white/[0.08] bg-slate-900/60 p-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!hasChanges || isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95 cursor-pointer"
              >
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" size={15} />
                ) : (
                  <Check size={15} />
                )}
                {isSubmitting ? "Updating dialogue..." : "Save Speaker Names"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
