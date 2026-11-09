"use client";

import { useState, useEffect, useSyncExternalStore, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Share2,
  Check,
  CheckCircle2,
  LoaderCircle,
  Sparkles,
  Layers,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchUserIntegrations,
  connectIntegration,
  syncMeetingTasks,
} from "@/components/integrations/services/integration.service";

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

const PRODUCTIVITY_PROVIDERS = [
  {
    id: "linear",
    name: "Linear",
    description: "Sync as Issues to your engineering team backlog",
    defaultBoard: "Engineering Backlog",
    color: "from-indigo-600 to-violet-600",
    badgeColor: "bg-indigo-500/20 text-indigo-300",
  },
  {
    id: "notion",
    name: "Notion",
    description: "Export as rows to your team Tasks Database",
    defaultBoard: "Team Tasks Database",
    color: "from-stone-700 to-neutral-900",
    badgeColor: "bg-white/10 text-slate-200",
  },
  {
    id: "jira",
    name: "Jira",
    description: "Create official Jira tickets in your sprint board",
    defaultBoard: "Sprint Board (PROJ)",
    color: "from-blue-600 to-cyan-600",
    badgeColor: "bg-blue-500/20 text-blue-300",
  },
  {
    id: "asana",
    name: "Asana",
    description: "Add tasks to your company project workflow",
    defaultBoard: "Q4 Deliverables",
    color: "from-rose-600 to-pink-600",
    badgeColor: "bg-rose-500/20 text-rose-300",
  },
];

export default function SyncTasksModal({
  isOpen,
  onClose,
  meetingId,
  actionItems = [],
}) {
  const isClient = useIsClient();

  const [selectedProviderId, setSelectedProviderId] = useState("linear");
  const [targetList, setTargetList] = useState("Engineering Backlog");
  const [connectedMap, setConnectedMap] = useState({});
  const [isLoadingIntegrations, setIsLoadingIntegrations] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  const selectedProvider =
    PRODUCTIVITY_PROVIDERS.find((p) => p.id === selectedProviderId) ||
    PRODUCTIVITY_PROVIDERS[0];

  // Fetch connected integrations when opened
  useEffect(() => {
    if (!isOpen) return;

    let ignore = false;
    async function loadIntegrations() {
      setIsLoadingIntegrations(true);
      try {
        const integrations = await fetchUserIntegrations();
        if (ignore) return;
        const map = {};
        integrations.forEach((item) => {
          if (item.status === "connected") {
            map[item.provider?.toLowerCase()] = true;
          }
        });
        setConnectedMap(map);
      } catch (err) {
        console.error("Failed to load integrations in sync modal:", err);
      } finally {
        if (!ignore) setIsLoadingIntegrations(false);
      }
    }

    loadIntegrations();

    return () => {
      ignore = true;
    };
  }, [isOpen]);

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

  const handleClose = useCallback(() => {
    if (isSyncing) return;
    setSyncResult(null);
    onClose();
  }, [isSyncing, onClose]);

  // Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isSyncing) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSyncing, handleClose]);

  const handleProviderSelect = (provider) => {
    setSelectedProviderId(provider.id);
    setTargetList(provider.defaultBoard);
    setSyncResult(null);
  };

  const handleConnectProvider = async (provider) => {
    setIsConnecting(true);
    try {
      await connectIntegration(provider.id, {
        name: provider.name,
      });
      setConnectedMap((prev) => ({ ...prev, [provider.id]: true }));
      toast.success(`${provider.name} connected successfully! 🎉`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || `Failed to connect ${provider.name}.`
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSyncTasks = async () => {
    if (!meetingId) {
      toast.error("Meeting ID is missing.");
      return;
    }

    if (!actionItems.length) {
      toast.error("No action items available to sync.");
      return;
    }

    setIsSyncing(true);
    try {
      const res = await syncMeetingTasks({
        provider: selectedProviderId,
        meetingId,
        targetList: targetList.trim(),
      });

      setSyncResult(res.data || res);
      toast.success(
        res.message ||
          `${actionItems.length} action items synced to ${selectedProvider.name}! 🚀`
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          `Failed to sync tasks to ${selectedProvider.name}. Check connection.`
      );
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isClient || !isOpen) return null;

  const isConnected = Boolean(connectedMap[selectedProviderId]);

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
                <Share2 className="size-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Sync Tasks to Workspace
                  <Sparkles size={15} className="text-indigo-400" />
                </h3>
                <p className="text-xs text-slate-400">
                  Export {actionItems.length} action items directly to your issue tracker
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              disabled={isSyncing}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer disabled:opacity-50"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="mt-5 space-y-5">
            {syncResult ? (
              /* Success confirmation receipt */
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-3">
                <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 size={20} />
                  <span>Tasks Successfully Synced to {syncResult.providerName || selectedProvider.name}!</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {syncResult.syncedCount || actionItems.length} action items were dispatched to{" "}
                  <span className="font-semibold text-white">
                    {syncResult.targetDestination || targetList}
                  </span>{" "}
                  with priorities, assignees, and due dates intact.
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/[0.08]">
                  <span>Status: Dispatched & Verified</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            ) : (
              <>
                {/* Provider Selector Cards */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Select Target Productivity Tool
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {PRODUCTIVITY_PROVIDERS.map((provider) => {
                      const isSelected = selectedProviderId === provider.id;
                      const providerConnected = Boolean(connectedMap[provider.id]);

                      return (
                        <div
                          key={provider.id}
                          onClick={() => handleProviderSelect(provider)}
                          className={`cursor-pointer rounded-2xl border p-3 transition ${
                            isSelected
                              ? "border-indigo-500/50 bg-indigo-500/15 shadow-md shadow-indigo-500/10"
                              : "border-white/[0.08] bg-slate-900/60 hover:border-white/20 hover:bg-slate-900"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">
                              {provider.name}
                            </span>
                            <span
                              className={`size-2 rounded-full ${
                                providerConnected ? "bg-emerald-400" : "bg-slate-500"
                              }`}
                            />
                          </div>
                          <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">
                            {provider.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Connection Status Box */}
                {!isConnected ? (
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="size-5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-amber-300">
                          {selectedProvider.name} is not connected yet
                        </h4>
                        <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                          Connect {selectedProvider.name} to stream meeting action items directly into
                          your project workflows.
                        </p>
                        <button
                          type="button"
                          disabled={isConnecting}
                          onClick={() => handleConnectProvider(selectedProvider)}
                          className="mt-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-amber-500/20 hover:shadow-amber-500/35 transition cursor-pointer disabled:opacity-50"
                        >
                          {isConnecting ? (
                            <LoaderCircle className="animate-spin" size={14} />
                          ) : (
                            <Sparkles size={14} />
                          )}
                          <span>
                            {isConnecting
                              ? "Connecting..."
                              : `Connect ${selectedProvider.name} in 1-Click`}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Layers size={13} className="text-indigo-400" />
                      <span>Target Project / Database Board</span>
                    </label>
                    <input
                      type="text"
                      value={targetList}
                      onChange={(e) => setTargetList(e.target.value)}
                      placeholder="e.g. Engineering Backlog"
                      className="h-10 w-full rounded-xl border border-white/[0.08] bg-slate-900/80 px-3.5 text-xs text-white outline-none transition focus:border-indigo-500/50"
                    />
                  </div>
                )}

                {/* Tasks Preview */}
                <div className="rounded-2xl border border-white/[0.08] bg-slate-900/50 p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <span>Tasks to be exported ({actionItems.length})</span>
                    <span>Status</span>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {actionItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-1 border-b border-white/[0.04] last:border-0"
                      >
                        <span className="truncate max-w-[280px] text-slate-200">
                          {idx + 1}. {item.title}
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded">
                          {item.priority || "Medium"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/[0.08] pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSyncing}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white cursor-pointer disabled:opacity-50"
            >
              {syncResult ? "Close" : "Cancel"}
            </button>

            {isConnected && !syncResult && (
              <button
                type="button"
                disabled={isSyncing || !actionItems.length}
                onClick={handleSyncTasks}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isSyncing ? (
                  <LoaderCircle className="animate-spin" size={15} />
                ) : (
                  <Share2 size={15} />
                )}
                <span>
                  {isSyncing
                    ? `Syncing to ${selectedProvider.name}...`
                    : `Sync to ${selectedProvider.name}`}
                </span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
