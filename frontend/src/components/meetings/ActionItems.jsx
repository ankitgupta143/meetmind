"use client";

import {
  CheckCircle2,
  Circle,
  CalendarDays,
  User,
  LoaderCircle,
  Pencil,
  X,
} from "lucide-react";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useParams } from "next/navigation";

import api from "@/lib/api";

export default function ActionItems({ insights }) {
  const { id: meetingId } = useParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [actionItems, setActionItems] = useState(
    insights?.actionItems ?? []
  );

  const [updatingIndex, setUpdatingIndex] = useState(null);

  const [statusFilter, setStatusFilter] = useState("all");

  const [priorityFilter, setPriorityFilter] = useState("all");

  const [editingIndex, setEditingIndex] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    assignee: "",
    dueDate: "",
    priority: "medium",
    status: "pending",
  });

  const [isSaving, setIsSaving] = useState(false);

  /*
   * Keep the original array index.
   *
   * Important because the backend currently identifies
   * action items using their array index.
   */
  const filteredItems = actionItems
    .map((item, index) => ({
      item,
      index,
    }))
    .filter(({ item }) => {
      const matchesStatus =
        statusFilter === "all" ||
        item.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ||
        item.priority === priorityFilter;

      return matchesStatus && matchesPriority;
    });

  /*
   * Counts
   */
  const totalCount = actionItems.length;

  const pendingCount = actionItems.filter(
    (item) => item.status === "pending"
  ).length;

  const inProgressCount = actionItems.filter(
    (item) => item.status === "in-progress"
  ).length;

  const completedCount = actionItems.filter(
    (item) => item.status === "completed"
  ).length;

  /*
   * Get next status
   *
   * pending → in-progress
   * in-progress → completed
   * completed → pending
   */
  const getNextStatus = (status) => {
    if (status === "pending") {
      return "in-progress";
    }

    if (status === "in-progress") {
      return "completed";
    }

    return "pending";
  };

  /*
   * Format status for UI
   */
  const formatStatus = (status) => {
    switch (status) {
      case "in-progress":
        return "In Progress";

      case "completed":
        return "Completed";

      default:
        return "Pending";
    }
  };

  /*
   * Format due date
   */
  const formatDueDate = (dueDate) => {
    if (!dueDate) {
      return "No due date";
    }

    const date = new Date(dueDate);

    if (Number.isNaN(date.getTime())) {
      return "No due date";
    }

    return date.toLocaleDateString();
  };

  /*
   * Update status
   */
  const updateStatus = async (index, status) => {
    if (!meetingId || updatingIndex !== null) {
      return;
    }

    const previousItems = [...actionItems];

    // Optimistic update
    setActionItems((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              status,
            }
          : item
      )
    );

    setUpdatingIndex(index);

    try {
      const response = await api.patch(
        `/meetings/${meetingId}/action-items/${index}`,
        {
          status,
        }
      );

      const updatedItem =
        response.data?.data?.actionItem;

      if (updatedItem) {
        setActionItems((prev) =>
          prev.map((item, itemIndex) =>
            itemIndex === index
              ? updatedItem
              : item
          )
        );
      }
    } catch (error) {
      console.error(
        "Failed to update action item:",
        error
      );

      setActionItems(previousItems);
    } finally {
      setUpdatingIndex(null);
    }
  };

  /*
   * Start editing
   */
  const startEditing = (index) => {
    const item = actionItems[index];

    if (!item) {
      return;
    }

    setEditingIndex(index);

    setEditForm({
      title: item.title || "",
      description: item.description || "",
      assignee: item.assignee || "",
      dueDate: item.dueDate
        ? new Date(item.dueDate)
            .toISOString()
            .split("T")[0]
        : "",
      priority: item.priority || "medium",
      status: item.status || "pending",
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
      assignee: "",
      dueDate: "",
      priority: "medium",
      status: "pending",
    });
  };

  /*
   * Form changes
   */
  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
   * Save edited action item
   */
  const saveEdit = async () => {
    if (
      editingIndex === null ||
      !meetingId ||
      isSaving
    ) {
      return;
    }

    if (!editForm.title.trim()) {
      return;
    }

    const previousItems = [...actionItems];

    const updates = {
      title: editForm.title.trim(),

      description:
        editForm.description.trim(),

      assignee:
        editForm.assignee.trim()
          ? editForm.assignee.trim()
          : null,

      dueDate: editForm.dueDate
        ? editForm.dueDate
        : null,

      priority: editForm.priority,

      status: editForm.status,
    };

    // Optimistic update
    setActionItems((prev) =>
      prev.map((item, index) =>
        index === editingIndex
          ? {
              ...item,
              ...updates,
            }
          : item
      )
    );

    setIsSaving(true);

    try {
      const response = await api.patch(
        `/meetings/${meetingId}/action-items/${editingIndex}`,
        updates
      );

      const updatedItem =
        response.data?.data?.actionItem;

      if (updatedItem) {
        setActionItems((prev) =>
          prev.map((item, index) =>
            index === editingIndex
              ? updatedItem
              : item
          )
        );
      }

      setEditingIndex(null);
    } catch (error) {
      console.error(
        "Failed to update action item:",
        error
      );

      // Rollback
      setActionItems(previousItems);
    } finally {
      setIsSaving(false);
    }
  };

  const priorityClasses = {
    high: "bg-red-100 text-red-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-emerald-100 text-emerald-700",
  };

  return (
    <>
      <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-zinc-200 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold">
                Action Items
              </h2>

              <p className="mt-1 text-zinc-500">
                AI-extracted tasks from this meeting.
              </p>

              {/* Counts */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                  {totalCount} Total
                </span>

                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  {pendingCount} Pending
                </span>

                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                  {inProgressCount} In Progress
                </span>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  {completedCount} Completed
                </span>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Status */}
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="all">
                  All Status
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="in-progress">
                  In Progress
                </option>

                <option value="completed">
                  Completed
                </option>
              </select>

              {/* Priority */}
              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value)
                }
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="all">
                  All Priority
                </option>

                <option value="high">
                  High
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="low">
                  Low
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* No action items */}
        {actionItems.length === 0 ? (
          <div className="p-10 text-center">
            <CheckCircle2
              size={40}
              className="mx-auto text-zinc-300"
            />

            <h3 className="mt-4 font-semibold text-zinc-900">
              No action items
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              No action items were identified in this
              meeting.
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          /* No filtered results */
          <div className="p-10 text-center">
            <CheckCircle2
              size={40}
              className="mx-auto text-zinc-300"
            />

            <h3 className="mt-4 font-semibold text-zinc-900">
              No matching action items
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Try changing your filters.
            </p>

            <button
              type="button"
              onClick={() => {
                setStatusFilter("all");
                setPriorityFilter("all");
              }}
              className="mt-5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* Action Items */
          <div className="divide-y divide-zinc-100">
            {filteredItems.map(
              ({ item: task, index }) => {
                const isUpdating =
                  updatingIndex === index;

                const isCompleted =
                  task.status === "completed";

                const isInProgress =
                  task.status === "in-progress";

                return (
                  <div
                    key={`${task.title}-${index}`}
                    className="flex items-start justify-between gap-6 p-6 transition hover:bg-zinc-50"
                  >
                    {/* Left */}
                    <div className="flex gap-4">
                      {/* Status */}
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          updateStatus(
                            index,
                            getNextStatus(
                              task.status
                            )
                          )
                        }
                        title={`Change status from ${formatStatus(
                          task.status
                        )}`}
                        className="mt-1 rounded-full transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <LoaderCircle
                            size={22}
                            className="animate-spin text-indigo-600"
                          />
                        ) : isCompleted ? (
                          <CheckCircle2
                            size={22}
                            className="text-emerald-600"
                          />
                        ) : isInProgress ? (
                          <Circle
                            size={22}
                            className="fill-indigo-100 text-indigo-600"
                          />
                        ) : (
                          <Circle
                            size={22}
                            className="text-zinc-400"
                          />
                        )}
                      </button>

                      {/* Content */}
                      <div>
                        <h3
                          className={`font-semibold ${
                            isCompleted
                              ? "text-zinc-400 line-through"
                              : "text-zinc-900"
                          }`}
                        >
                          {task.title}
                        </h3>

                        {task.description && (
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                            {task.description}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-5 text-sm text-zinc-500">
                          {task.assignee && (
                            <span className="flex items-center gap-1">
                              <User size={14} />
                              {task.assignee}
                            </span>
                          )}

                          <span className="flex items-center gap-1">
                            <CalendarDays
                              size={14}
                            />
                            {formatDueDate(
                              task.dueDate
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      {/* Edit */}
                      <button
                        type="button"
                        disabled={
                          isUpdating ||
                          isSaving
                        }
                        onClick={() =>
                          startEditing(index)
                        }
                        className="rounded-xl border border-zinc-200 p-2 text-zinc-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Edit action item"
                      >
                        <Pencil size={16} />
                      </button>

                      {/* Priority */}
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          priorityClasses[
                            task.priority
                          ] ||
                          "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {task.priority ||
                          "medium"}
                      </span>

                      {/* Status */}
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          updateStatus(
                            index,
                            getNextStatus(
                              task.status
                            )
                          )
                        }
                        className={`text-sm transition hover:underline ${
                          isCompleted
                            ? "text-emerald-600"
                            : isInProgress
                            ? "text-indigo-600"
                            : "text-zinc-500"
                        }`}
                      >
                        {formatStatus(
                          task.status
                        )}
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          EDIT ACTION ITEM MODAL (Rendered via Portal to escape parent container)
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

            {/* Modal Box */}
            <div
              className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 p-6">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                    Edit Action Item
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Update the task details below.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={isSaving}
                  className="rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="max-h-[calc(85vh-160px)] overflow-y-auto p-6">
                <div className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Title
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      placeholder="Enter action item title"
                      maxLength={300}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40"
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
                      onChange={handleEditChange}
                      placeholder="Add more details..."
                      rows={4}
                      maxLength={2000}
                      className="w-full resize-none rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40"
                    />
                  </div>

                  {/* Assignee + Due Date */}
                  <div className="grid gap-5 md:grid-cols-2">
                    {/* Assignee */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Assignee
                      </label>

                      <input
                        type="text"
                        name="assignee"
                        value={editForm.assignee}
                        onChange={handleEditChange}
                        placeholder="e.g. John Doe"
                        maxLength={100}
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40"
                      />
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Due Date
                      </label>

                      <input
                        type="date"
                        name="dueDate"
                        value={editForm.dueDate}
                        onChange={handleEditChange}
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40"
                      />
                    </div>
                  </div>

                  {/* Priority + Status */}
                  <div className="grid gap-5 md:grid-cols-2">
                    {/* Priority */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Priority
                      </label>

                      <select
                        name="priority"
                        value={editForm.priority}
                        onChange={handleEditChange}
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Status
                      </label>

                      <select
                        name="status"
                        value={editForm.status}
                        onChange={handleEditChange}
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 p-6">
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={isSaving}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveEdit}
                  disabled={isSaving || !editForm.title.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving && (
                    <LoaderCircle size={16} className="animate-spin" />
                  )}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}