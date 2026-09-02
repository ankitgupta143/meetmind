"use client";

import {
  Target,
  User,
  Pencil,
  Trash2,
  X,
  LoaderCircle,
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

  /*
   * Handle delete button click
   */
  const handleDeleteClick = (index) => {
    setDeletingIndex(index);
    setIsDeleteModalOpen(true);
  };

  /*
   * Start editing
   */
  const startEditing = (index) => {
    const decision = decisions[index];

    if (!decision) {
      return;
    }

    setEditingIndex(index);

    setEditForm({
      title: decision.title || "",
      description: decision.description || "",
      owner: decision.owner || "",
    });
  };

  /*
   * Cancel editing
   */
  const cancelEditing = () => {
    if (isSaving) {
      return;
    }

    setEditingIndex(null);

    setEditForm({
      title: "",
      description: "",
      owner: "",
    });
  };

  /*
   * Handle input changes
   */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
   * Save decision
   */
  const saveDecision = async () => {
    if (editingIndex === null || !meetingId || isSaving) {
      return;
    }

    if (!editForm.title.trim()) {
      return;
    }

    const previousDecisions = [...decisions];

    const updates = {
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      owner: editForm.owner.trim() ? editForm.owner.trim() : null,
    };

    /*
     * Optimistic update
     */
    setDecisions((prev) =>
      prev.map((decision, index) =>
        index === editingIndex
          ? {
              ...decision,
              ...updates,
            }
          : decision,
      ),
    );

    setIsSaving(true);

    try {
      const response = await api.patch(
        `/meetings/${meetingId}/decisions/${editingIndex}`,
        updates,
      );

      const updatedDecision = response.data?.data?.decision;

      if (updatedDecision) {
        setDecisions((prev) =>
          prev.map((decision, index) =>
            index === editingIndex ? updatedDecision : decision,
          ),
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

      /*
       * Rollback if API fails
       */
      setDecisions(previousDecisions);
    } finally {
      setIsSaving(false);
    }
  };

  /*
   * Confirm delete
   */
  const confirmDelete = async () => {
    if (deletingIndex === null || !meetingId || isDeleting) {
      return;
    }

    setIsDeleting(true);

    const previousDecisions = [...decisions];

    /*
     * Optimistic delete
     */
    setDecisions((prev) =>
      prev.filter((_, index) => index !== deletingIndex),
    );

    try {
      await api.delete(
        `/meetings/${meetingId}/decisions/${deletingIndex}`,
      );

      setIsDeleteModalOpen(false);
      setDeletingIndex(null);
    } catch (error) {
      console.error("Failed to delete decision:", error);

      /*
       * Rollback if API fails
       */
      setDecisions(previousDecisions);
    } finally {
      setIsDeleting(false);
    }
  };

  /*
   * Cancel delete
   */
  const cancelDelete = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteModalOpen(false);
    setDeletingIndex(null);
  };

  return (
    <>
      {/* =====================================================
          DECISIONS CARD
      ====================================================== */}

      <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-zinc-200 p-6">
          <h2 className="text-2xl font-bold">Decisions</h2>

          <p className="mt-1 text-zinc-500">
            AI-detected decisions from this meeting.
          </p>
        </div>

        {/* Empty State */}
        {decisions.length === 0 ? (
          <div className="p-10 text-center">
            <Target
              size={40}
              className="mx-auto text-zinc-300"
            />

            <h3 className="mt-4 font-semibold text-zinc-900">
              No decisions found
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              No decisions were identified in this meeting.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {decisions.map((decision, index) => (
              <div
                key={`${decision.title}-${index}`}
                className="p-6 transition hover:bg-zinc-50"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
                    <Target size={20} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      {/* Title */}
                      <h3 className="text-lg font-semibold text-zinc-900">
                        {decision.title}
                      </h3>

                      {/* Actions */}
                      <div className="flex shrink-0 items-center gap-2">
                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => startEditing(index)}
                          className="rounded-xl border border-zinc-200 p-2 text-zinc-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                          title="Edit decision"
                        >
                          <Pencil size={16} />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(index)}
                          className="rounded-lg p-2 text-zinc-400 transition hover:bg-red-50 hover:text-red-600"
                          aria-label="Delete decision"
                          title="Delete decision"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    {decision.description && (
                      <p className="mt-3 leading-7 text-zinc-600">
                        {decision.description}
                      </p>
                    )}

                    {/* Owner */}
                    {decision.owner && (
                      <div className="mt-5">
                        <span className="flex items-center gap-2 text-sm text-zinc-500">
                          <User size={15} />

                          <span>Owner:</span>

                          <span className="font-medium text-zinc-700">
                            {decision.owner}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =====================================================
          EDIT DECISION MODAL
      ====================================================== */}

      {editingIndex !== null &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={cancelEditing}
            />

            {/* Modal */}
            <div
              className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
              onClick={(event) => event.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 p-6 dark:border-zinc-800">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                    Edit Decision
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Update the decision details below.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={isSaving}
                  className="rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="max-h-[70vh] overflow-y-auto p-6">
                <div className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Decision Title
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleChange}
                      placeholder="Enter decision title"
                      maxLength={300}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-indigo-900/50"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleChange}
                      placeholder="Describe the decision..."
                      rows={5}
                      maxLength={2000}
                      className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-indigo-900/50"
                    />
                  </div>

                  {/* Owner */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Owner
                    </label>

                    <input
                      type="text"
                      name="owner"
                      value={editForm.owner}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      maxLength={100}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-indigo-900/50"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 border-t border-zinc-200 p-6 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={isSaving}
                  className="rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveDecision}
                  disabled={isSaving || !editForm.title.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving && (
                    <LoaderCircle
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ====================================================== */}

      {isDeleteModalOpen &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0"
              onClick={cancelDelete}
            />

            {/* Modal */}
            <div
              className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Delete decision?
                </h2>

                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  Are you sure you want to delete this decision? This
                  action cannot be undone.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                {/* Cancel */}
                <button
                  type="button"
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeleting && (
                    <LoaderCircle
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}