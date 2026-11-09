"use client";

import { useState, useEffect, useSyncExternalStore, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Target,
  Plus,
  LoaderCircle,
  User,
  Sparkles,
  FileText,
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

export default function AddDecisionModal({
  isOpen,
  onClose,
  meetingId,
  participants = [],
  onCreated,
}) {
  const isClient = useIsClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [owner, setOwner] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract attendee names for quick assignment
  const attendeeNames = (participants || [])
    .map((p) => {
      if (!p) return null;
      if (typeof p === "string") return p.trim();
      return p.name || p.displayName || null;
    })
    .filter(Boolean);

  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    setTitle("");
    setDescription("");
    setOwner("");
    onClose();
  }, [isSubmitting, onClose]);

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

  // Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, handleClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Decision title is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post(`/meetings/${meetingId}/decisions`, {
        title: title.trim(),
        description: description.trim(),
        owner: owner.trim() || null,
      });

      const data = response.data?.data;
      toast.success("Strategic decision recorded! 🎯");
      if (onCreated) {
        onCreated(data?.decision, data?.decisions);
      }
      handleClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to record decision. Try again."
      );
    } finally {
      setIsSubmitting(false);
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
          className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-2xl sm:p-7 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shadow-md">
                <Target className="size-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Record Strategic Decision
                  <Sparkles size={15} className="text-emerald-400" />
                </h3>
                <p className="text-xs text-slate-400">
                  Document key team agreements, architectural pivots, or sign-offs
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
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Decision Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Approve Friday release for Beta v2.0"
                className="h-10 w-full rounded-xl border border-white/[0.08] bg-slate-900/80 px-3.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FileText size={13} className="text-emerald-400" />
                <span>Rationale & Impact (Optional)</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the context, key trade-offs considered, and expected outcomes..."
                className="w-full rounded-xl border border-white/[0.08] bg-slate-900/80 p-3 text-xs text-white placeholder-slate-500 outline-none transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 resize-none"
              />
            </div>

            {/* Owner */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User size={13} className="text-cyan-400" />
                <span>Decision Owner / Lead</span>
              </label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="Type owner name or select below"
                className="h-10 w-full rounded-xl border border-white/[0.08] bg-slate-900/80 px-3.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-emerald-500/50"
              />

              {attendeeNames.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {attendeeNames.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setOwner(name)}
                      className={`rounded-lg border px-2 py-0.5 text-[11px] font-medium transition cursor-pointer ${
                        owner === name
                          ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                          : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white"
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/[0.08] pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:shadow-emerald-600/40 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" size={15} />
                ) : (
                  <Plus size={15} />
                )}
                <span>{isSubmitting ? "Recording..." : "Record Decision"}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
