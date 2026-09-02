"use client";

import {
  Target,
  User,
  Pencil,
  Trash2,
  X,
  LoaderCircle,
  Sparkles,
  CheckCircle,
} from "lucide-react";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useParams } from "next/navigation";

import api from "@/lib/api";

export default function Decisions({ insights }) {
  const { id: meetingId } = useParams();

  const [mounted, setMounted] = useState(false);
  const [decisions, setDecisions] = useState(insights?.decisions ?? []);
  const [editingIndex, setEditingIndex] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    owner: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDeleteClick = (index) => {
    setDeletingIndex(index);
    setIsDeleteModalOpen(true);
  };

  const startEditing = (index) => {
    const decision = decisions[index];
    if (!decision) return;

    setEditingIndex(index);
    setEditForm({
      title: decision.title || "",
      description: decision.description || "",
      owner: decision.owner || "",
    });
  };

  const cancelEditing = () => {
    if (isSaving) return;
    setEditingIndex(null);
    setEditForm({
      title: "",
      description: "",
      owner: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveDecision = async () => {
    if (editingIndex === null || !meetingId || isSaving) return;
    if (!editForm.title.trim()) return;

    const previousDecisions = [...decisions];
    const updates = {
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      owner: editForm.owner.trim() ? editForm.owner.trim() : null,
    };

    setDecisions((prev) =>
      prev.map((decision, index) =>
        index === editingIndex
          ? {
              ...decision,
              ...updates,
            }
          : decision
      )
    );

    setIsSaving(true);

    try {
      const response = await api.patch(
        `/meetings/${meetingId}/decisions/${editingIndex}`,
        updates
      );

      const updatedDecision = response.data?.data?.decision;

      if (updatedDecision) {
        setDecisions((prev) =>
          prev.map((decision, index) =>
            index === editingIndex ? updatedDecision : decision
          )
        );
      }

      setEditingIndex(null);
      setEditForm({
        title: "",
        description: "",
        owner: "",
      });
    } catch (error) {
      console.error("Failed to update decision:", error);
      setDecisions(previousDecisions);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (deletingIndex === null || !meetingId || isDeleting) return;

    setIsDeleting(true);
    const previousDecisions = [...decisions];

    setDecisions((prev) =>
      prev.filter((_, index) => index !== deletingIndex)
    );

    try {
      await api.delete(
        `/meetings/${meetingId}/decisions/${deletingIndex}`
      );
      setIsDeleteModalOpen(false);
      setDeletingIndex(null);
    } catch (error) {
      console.error("Failed to delete decision:", error);
      setDecisions(previousDecisions);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    if (isDeleting) return;
    setIsDeleteModalOpen(false);
    setDeletingIndex(null);
  };

  return (
    <>
      <div className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-slate-950/60 shadow-xl backdrop-blur-2xl">
        {/* Header */}
        <div className="border-b border-white/[0.08] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Decisions
                <Sparkles size={16} className="text-violet-400" />
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                AI-detected consensus, agreements and strategic conclusions.
              </p>
            </div>

            <span className="rounded-full border border-violet-500/30 bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-300">
              {decisions.length} Total
            </span>
          </div>
        </div>

        {/* Empty State */}
        {decisions.length === 0 ? (
          <div className="p-10 text-center">
            <Target size={36} className="mx-auto text-slate-600" />
            <h3 className="mt-3 text-sm font-semibold text-slate-200">No decisions found</h3>
            <p className="mt-1 text-xs text-slate-400">
              No decisions were identified in this meeting.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {decisions.map((decision, index) => (
              <div
                key={`${decision.title}-${index}`}
                className="group flex items-start justify-between gap-4 p-5 transition-all duration-200 hover:bg-white/[0.03]"
              >
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400">
                    <Target size={16} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold tracking-tight text-slate-100 group-hover:text-white">
                      {decision.title}
                    </h3>

                    {decision.description && (
                      <p className="mt-1 text-xs leading-relaxed text-slate-400 max-w-2xl">
                        {decision.description}
                      </p>
                    )}

                    {decision.owner && (
                      <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
                        <User size={13} className="text-violet-400" />
                        <span className="text-[11px] font-medium text-slate-300">
                          Owner: {decision.owner}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => startEditing(index)}
                    className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-1.5 text-slate-400 transition hover:border-violet-500/30 hover:bg-white/10 hover:text-violet-300"
                    title="Edit decision"
                  >
                    <Pencil size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteClick(index)}
                    className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-1.5 text-slate-400 transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
                    title="Delete decision"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingIndex !== null &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={cancelEditing}
            />

            <div
              className="relative z-10 w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Edit Decision</h2>
                  <p className="text-xs text-slate-400">Modify decision outcome or owner.</p>
                </div>
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={isSaving}
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">Decision Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/[0.08] bg-slate-900 px-3.5 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">Description</label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-xl border border-white/[0.08] bg-slate-900 px-3.5 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">Owner (Optional)</label>
                  <input
                    type="text"
                    name="owner"
                    value={editForm.owner}
                    onChange={handleChange}
                    placeholder="e.g. Sarah Connor"
                    className="w-full rounded-xl border border-white/[0.08] bg-slate-900 px-3.5 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2.5 border-t border-white/[0.08] pt-4">
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={isSaving}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveDecision}
                  disabled={isSaving || !editForm.title.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-500"
                >
                  {isSaving && <LoaderCircle size={14} className="animate-spin" />}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={cancelDelete}
            />

            <div
              className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border border-rose-500/20 bg-slate-950 p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-white">Delete Decision</h2>
              <p className="mt-2 text-xs text-slate-400">
                Are you sure you want to delete this decision? This action cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-500"
                >
                  {isDeleting && <LoaderCircle size={14} className="animate-spin" />}
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}