"use client";

import { useState, useEffect, useSyncExternalStore, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  LoaderCircle,
  CalendarDays,
  User,
  Flag,
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

export default function AddActionItemModal({
  isOpen,
  onClose,
  meetingId,
  participants = [],
  onCreated,
}) {
  const isClient = useIsClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("pending");
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
    setAssignee("");
    setDueDate("");
    setPriority("medium");
    setStatus("pending");
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
      toast.error("Action item title is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post(`/meetings/${meetingId}/action-items`, {
        title: title.trim(),
        description: description.trim(),
        assignee: assignee.trim() || null,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        priority,
        status,
      });

      const data = response.data?.data;
      toast.success("New action item created! 🚀");
      if (onCreated) {
        onCreated(data?.actionItem, data?.actionItems);
      }
      handleClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create action item. Try again."
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
              <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 shadow-md">
                <Plus className="size-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  New Action Item
                  <Sparkles size={15} className="text-indigo-400" />
                </h3>
                <p className="text-xs text-slate-400">
                  Assign a key deliverable or follow-up from this meeting
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
                Task Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Complete mobile UI navigation review"
                className="h-10 w-full rounded-xl border border-white/[0.08] bg-slate-900/80 px-3.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Description (Optional)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add context, acceptance criteria, or relevant links..."
                className="w-full rounded-xl border border-white/[0.08] bg-slate-900/80 p-3 text-xs text-white placeholder-slate-500 outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 resize-none"
              />
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User size={13} className="text-cyan-400" />
                <span>Assignee</span>
              </label>
              <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="Type assignee name or select below"
                className="h-10 w-full rounded-xl border border-white/[0.08] bg-slate-900/80 px-3.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-indigo-500/50"
              />

              {attendeeNames.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {attendeeNames.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setAssignee(name)}
                      className={`rounded-lg border px-2 py-0.5 text-[11px] font-medium transition cursor-pointer ${
                        assignee === name
                          ? "border-cyan-500/40 bg-cyan-500/20 text-cyan-300"
                          : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white"
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Due Date & Priority Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <CalendarDays size={13} className="text-indigo-400" />
                  <span>Due Date</span>
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-10 w-full rounded-xl border border-white/[0.08] bg-slate-900/80 px-3.5 text-xs text-white outline-none transition focus:border-indigo-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Flag size={13} className="text-amber-400" />
                  <span>Priority</span>
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="h-10 w-full rounded-xl border border-white/[0.08] bg-slate-900/80 px-3 text-xs font-medium text-white outline-none transition focus:border-indigo-500/50 cursor-pointer"
                >
                  <option value="low" className="bg-slate-900">Low Priority</option>
                  <option value="medium" className="bg-slate-900">Medium Priority</option>
                  <option value="high" className="bg-slate-900">High Priority</option>
                </select>
              </div>
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
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" size={15} />
                ) : (
                  <Plus size={15} />
                )}
                <span>{isSubmitting ? "Creating Task..." : "Add Action Item"}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
