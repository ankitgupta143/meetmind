"use client";

import {
  CheckCircle2,
  Circle,
  CalendarDays,
  User,
  LoaderCircle,
  Pencil,
  Trash2,
  X,
  Sparkles,
  Plus,
  Share2,
  Copy,
} from "lucide-react";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import api from "@/lib/api";
import AddActionItemModal from "./modals/AddActionItemModal";
import SyncTasksModal from "./modals/SyncTasksModal";

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function ActionItems({ insights, participants = [] }) {
  const { id: meetingId } = useParams();
  const isClient = useIsClient();

  const [actionItems, setActionItems] = useState(
    insights?.actionItems ?? []
  );

  const [updatingIndex, setUpdatingIndex] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [editingIndex, setEditingIndex] = useState(null);

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [syncModalOpen, setSyncModalOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    assignee: "",
    dueDate: "",
    priority: "medium",
    status: "pending",
  });

  const [isSaving, setIsSaving] = useState(false);

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

  const getNextStatus = (status) => {
    if (status === "pending") {
      return "in-progress";
    }
    if (status === "in-progress") {
      return "completed";
    }
    return "pending";
  };

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

  const updateStatus = async (index, status) => {
    if (!meetingId || updatingIndex !== null) {
      return;
    }

    const previousItems = [...actionItems];

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

  const startEditing = (index) => {
    const item = actionItems[index];
    if (!item) return;

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

  const cancelEditing = () => {
    if (isSaving) return;
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

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveEdit = async () => {
    if (
      editingIndex === null ||
      !editForm.title.trim() ||
      !meetingId
    ) {
      return;
    }

    const previousItems = [...actionItems];
    const updates = {
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      assignee: editForm.assignee.trim(),
      dueDate: editForm.dueDate || null,
      priority: editForm.priority,
      status: editForm.status,
    };

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
      toast.success("Action item updated!");
    } catch (error) {
      console.error(
        "Failed to update action item:",
        error
      );
      setActionItems(previousItems);
      toast.error("Failed to update action item.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteItem = async (indexToDelete) => {
    if (!meetingId) return;
    const previousItems = [...actionItems];
    setActionItems((prev) => prev.filter((_, idx) => idx !== indexToDelete));

    try {
      await api.delete(`/meetings/${meetingId}/action-items/${indexToDelete}`);
      toast.success("Action item deleted.");
    } catch (err) {
      console.error("Failed to delete action item:", err);
      setActionItems(previousItems);
      toast.error("Failed to delete action item.");
    }
  };

  const handleTaskCreated = (newItem, allItems) => {
    if (allItems && Array.isArray(allItems)) {
      setActionItems(allItems);
    } else if (newItem) {
      setActionItems((prev) => [newItem, ...prev]);
    }
  };

  const copyAsMarkdown = () => {
    if (!actionItems.length) {
      toast.info("No action items to copy.");
      return;
    }
    const markdown = actionItems
      .map((item) => {
        const check = item.status === "completed" ? "x" : " ";
        const assignee = item.assignee ? ` (@${item.assignee})` : "";
        const priority = item.priority ? ` [${item.priority.toUpperCase()}]` : "";
        const due = item.dueDate
          ? ` (Due: ${new Date(item.dueDate).toLocaleDateString()})`
          : "";
        return `- [${check}] **${item.title}**${assignee}${due}${priority}`;
      })
      .join("\n");

    navigator.clipboard.writeText(markdown);
    toast.success("Action items copied as Markdown checklist! 📋");
  };

  const priorityBadgeClasses = {
    high: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    medium: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    low: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  };

  return (
    <>
      <div className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-slate-950/60 shadow-xl backdrop-blur-2xl">
        {/* Header */}
        <div className="border-b border-white/[0.08] p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Action Items
                <Sparkles size={16} className="text-emerald-400" />
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                AI-extracted and user deliverables, follow-ups, and assignments.
              </p>

              {/* Status Count Pills */}
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-xs font-medium text-slate-300">
                  {totalCount} Total
                </span>
                <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                  {pendingCount} Pending
                </span>
                <span className="rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
                  {inProgressCount} In Progress
                </span>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                  {completedCount} Completed
                </span>
              </div>
            </div>

            {/* Actions: Add Task, Sync, Copy Markdown */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setAddModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/15 px-3 py-2 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-500/25 active:scale-95 cursor-pointer shadow-sm"
                title="Create a new action item"
              >
                <Plus size={14} className="text-indigo-400" />
                <span>Add Task</span>
              </button>

              <button
                type="button"
                onClick={() => setSyncModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer"
                title="Sync tasks to Notion, Linear, Jira, or Asana"
              >
                <Share2 size={14} className="text-cyan-400" />
                <span>Sync to Workspace</span>
              </button>

              <button
                type="button"
                onClick={copyAsMarkdown}
                className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer"
                title="Copy formatted checklist to clipboard"
              >
                <Copy size={14} />
                <span>Copy Checklist</span>
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="mt-4 flex flex-wrap gap-2.5 pt-3 border-t border-white/[0.05]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-white/[0.08] bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 outline-none transition focus:border-indigo-500/50 cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-slate-200">All Status</option>
              <option value="pending" className="bg-slate-900 text-slate-200">Pending</option>
              <option value="in-progress" className="bg-slate-900 text-slate-200">In Progress</option>
              <option value="completed" className="bg-slate-900 text-slate-200">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-xl border border-white/[0.08] bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 outline-none transition focus:border-indigo-500/50 cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-slate-200">All Priority</option>
              <option value="high" className="bg-slate-900 text-slate-200">High</option>
              <option value="medium" className="bg-slate-900 text-slate-200">Medium</option>
              <option value="low" className="bg-slate-900 text-slate-200">Low</option>
            </select>
          </div>
        </div>

        {/* List Content */}
        {actionItems.length === 0 ? (
          <div className="p-10 text-center">
            <CheckCircle2 size={36} className="mx-auto text-slate-600" />
            <h3 className="mt-3 text-sm font-semibold text-slate-200">No action items</h3>
            <p className="mt-1 text-xs text-slate-400">
              No action items recorded for this meeting. Click &ldquo;Add Task&rdquo; to create one.
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-semibold text-slate-300">No matching action items</p>
            <p className="mt-1 text-xs text-slate-400">Try changing your active filters.</p>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("all");
                setPriorityFilter("all");
              }}
              className="mt-3 rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {filteredItems.map(({ item: task, index }) => {
              const isUpdating = updatingIndex === index;
              const isCompleted = task.status === "completed";
              const isInProgress = task.status === "in-progress";

              return (
                <div
                  key={`${task.title}-${index}`}
                  className="group flex items-start justify-between gap-4 p-5 transition-all duration-200 hover:bg-white/[0.03]"
                >
                  <div className="flex items-start gap-3.5">
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() =>
                        updateStatus(index, getNextStatus(task.status))
                      }
                      title={`Toggle status (${formatStatus(task.status)})`}
                      className="mt-0.5 rounded-full transition hover:scale-110 disabled:opacity-50 cursor-pointer"
                    >
                      {isUpdating ? (
                        <LoaderCircle size={20} className="animate-spin text-indigo-400" />
                      ) : isCompleted ? (
                        <CheckCircle2 size={20} className="text-emerald-400 drop-shadow-sm" />
                      ) : isInProgress ? (
                        <Circle size={20} className="fill-indigo-500/20 text-indigo-400" />
                      ) : (
                        <Circle size={20} className="text-slate-500 hover:text-slate-300" />
                      )}
                    </button>

                    <div>
                      <h3
                        className={`text-sm font-semibold tracking-tight transition-colors ${
                          isCompleted
                            ? "text-slate-500 line-through"
                            : "text-slate-100 group-hover:text-white"
                        }`}
                      >
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="mt-1 text-xs leading-relaxed text-slate-400 max-w-2xl">
                          {task.description}
                        </p>
                      )}

                      <div className="mt-2.5 flex flex-wrap gap-4 text-xs text-slate-400">
                        {task.assignee && (
                          <span className="flex items-center gap-1.5 text-[11px] text-slate-300">
                            <User size={13} className="text-indigo-400" />
                            {task.assignee}
                          </span>
                        )}

                        <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <CalendarDays size={13} className="text-slate-400" />
                          {formatDueDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          priorityBadgeClasses[task.priority] || "bg-white/[0.06] text-slate-300"
                        }`}
                      >
                        {task.priority || "medium"}
                      </span>

                      <button
                        type="button"
                        disabled={isUpdating || isSaving}
                        onClick={() => startEditing(index)}
                        className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-1.5 text-slate-400 transition hover:border-indigo-500/30 hover:bg-white/10 hover:text-indigo-300 disabled:opacity-50 cursor-pointer"
                        title="Edit action item"
                      >
                        <Pencil size={13} />
                      </button>

                      <button
                        type="button"
                        disabled={isUpdating || isSaving}
                        onClick={() => deleteItem(index)}
                        className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-1.5 text-slate-400 transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-50 cursor-pointer"
                        title="Delete action item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() =>
                        updateStatus(index, getNextStatus(task.status))
                      }
                      className={`text-xs font-medium transition hover:underline cursor-pointer ${
                        isCompleted
                          ? "text-emerald-400"
                          : isInProgress
                          ? "text-indigo-400"
                          : "text-amber-400"
                      }`}
                    >
                      {formatStatus(task.status)}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingIndex !== null &&
        isClient &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={cancelEditing}
            />
            <div
              className="relative z-10 w-full max-w-lg rounded-2xl border border-white/[0.08] bg-slate-950 p-6 shadow-2xl backdrop-blur-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Edit Action Item</h2>
                  <p className="text-xs text-slate-400">Update task details and assignments.</p>
                </div>
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={isSaving}
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    className="w-full rounded-xl border border-white/[0.08] bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">Description</label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    rows={3}
                    className="w-full rounded-xl border border-white/[0.08] bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-300">Assignee</label>
                    <input
                      type="text"
                      name="assignee"
                      value={editForm.assignee}
                      onChange={handleEditChange}
                      className="w-full rounded-xl border border-white/[0.08] bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-300">Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={editForm.dueDate}
                      onChange={handleEditChange}
                      className="w-full rounded-xl border border-white/[0.08] bg-slate-900 px-3.5 py-2 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-300">Priority</label>
                    <select
                      name="priority"
                      value={editForm.priority}
                      onChange={handleEditChange}
                      className="w-full rounded-xl border border-white/[0.08] bg-slate-900 px-3.5 py-2 text-xs text-white outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="low" className="bg-slate-900">Low</option>
                      <option value="medium" className="bg-slate-900">Medium</option>
                      <option value="high" className="bg-slate-900">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-300">Status</label>
                    <select
                      name="status"
                      value={editForm.status}
                      onChange={handleEditChange}
                      className="w-full rounded-xl border border-white/[0.08] bg-slate-900 px-3.5 py-2 text-xs text-white outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="pending" className="bg-slate-900">Pending</option>
                      <option value="in-progress" className="bg-slate-900">In Progress</option>
                      <option value="completed" className="bg-slate-900">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2.5 border-t border-white/[0.08] pt-4">
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={isSaving}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveEdit}
                  disabled={isSaving || !editForm.title.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 cursor-pointer"
                >
                  {isSaving && <LoaderCircle size={14} className="animate-spin" />}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Add Action Item Modal */}
      <AddActionItemModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        meetingId={meetingId}
        participants={participants}
        onCreated={handleTaskCreated}
      />

      {/* Sync Tasks to Workspace Modal */}
      <SyncTasksModal
        isOpen={syncModalOpen}
        onClose={() => setSyncModalOpen(false)}
        meetingId={meetingId}
        actionItems={actionItems}
      />
    </>
  );
}
