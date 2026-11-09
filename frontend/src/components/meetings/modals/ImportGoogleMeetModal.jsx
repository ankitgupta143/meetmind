"use client";

import { useEffect, useState, useSyncExternalStore, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Video,
  LoaderCircle,
  Sparkles,
  CalendarDays,
  Users,
  Check,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  fetchUserIntegrations,
  connectIntegration,
  importGoogleMeetMeeting,
} from "@/components/integrations/services/integration.service";

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

const GOOGLE_MEET_PRESETS = [
  {
    title: "Q4 Engineering Architecture & Performance Review",
    duration: "45 min",
    timeAgo: "Today, 10:00 AM",
    participants: ["Sarah Connor", "Alex Rivera", "Dr. Aris Vance", "Elena Rostova"],
    badge: "Recent Recording",
  },
  {
    title: "Weekly Product Strategy & Roadmap Alignment",
    duration: "30 min",
    timeAgo: "Yesterday, 3:30 PM",
    participants: ["Marcus Brody", "Sarah Connor", "Elena Rostova"],
    badge: "Recent Recording",
  },
  {
    title: "Design System & Frontend Architecture Sync",
    duration: "25 min",
    timeAgo: "2 days ago",
    participants: ["Alex Rivera", "Elena Rostova"],
    badge: "Recorded Call",
  },
];

export default function ImportGoogleMeetModal({ isOpen, onClose, onImportSuccess }) {
  const router = useRouter();
  const isClient = useIsClient();

  const [selectedPreset, setSelectedPreset] = useState(0);
  const [useCustomTitle, setUseCustomTitle] = useState(false);
  const [customTitle, setCustomTitle] = useState("");

  const [isImporting, setIsImporting] = useState(false);
  const [isCheckingMeet, setIsCheckingMeet] = useState(true);
  const [meetConnected, setMeetConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [importedMeeting, setImportedMeeting] = useState(null);

  // Check Google Meet connection when opened
  useEffect(() => {
    if (!isOpen) return;

    let ignore = false;
    async function checkMeet() {
      setIsCheckingMeet(true);
      try {
        const integrations = await fetchUserIntegrations();
        if (ignore) return;
        const meet = integrations.find(
          (i) => i.provider?.toLowerCase() === "google-meet" && i.status === "connected"
        );
        setMeetConnected(Boolean(meet));
      } catch (err) {
        if (!ignore) {
          console.error("Failed to check Google Meet integration:", err);
          setMeetConnected(false);
        }
      } finally {
        if (!ignore) setIsCheckingMeet(false);
      }
    }

    checkMeet();

    return () => {
      ignore = true;
    };
  }, [isOpen]);

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

  const handleClose = useCallback(() => {
    if (isImporting) return;
    setImportedMeeting(null);
    onClose();
  }, [isImporting, onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isImporting) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isImporting, handleClose]);

  const handleConnectMeet = async () => {
    setIsConnecting(true);
    try {
      await connectIntegration("google-meet", {
        name: "Google Meet",
        config: { autoImport: true },
      });
      setMeetConnected(true);
      toast.success("Google Meet connected! Your meeting recordings are ready to import. 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to connect Google Meet.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleImport = async () => {
    let titleToImport = "";
    let participants = [];

    if (useCustomTitle) {
      if (!customTitle.trim()) {
        toast.error("Please enter a meeting title.");
        return;
      }
      titleToImport = customTitle.trim();
      participants = ["Sarah Connor", "Alex Rivera", "Dr. Aris Vance"];
    } else {
      const preset = GOOGLE_MEET_PRESETS[selectedPreset];
      titleToImport = preset.title;
      participants = preset.participants;
    }

    setIsImporting(true);
    try {
      const meeting = await importGoogleMeetMeeting({
        meetingTitle: titleToImport,
        participants,
      });

      setImportedMeeting(meeting);
      toast.success(`Google Meet call "${meeting.title}" imported & analyzed! 🚀`);

      if (onImportSuccess) {
        onImportSuccess(meeting);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to import Google Meet recording. Try again."
      );
    } finally {
      setIsImporting(false);
    }
  };

  const handleViewImportedMeeting = () => {
    if (importedMeeting?._id) {
      handleClose();
      router.push(`/meetings/${importedMeeting._id}`);
    }
  };

  if (!isClient || !isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
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
                <Video className="size-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Import from Google Meet
                  <Sparkles size={15} className="text-emerald-400" />
                </h3>
                <p className="text-xs text-slate-400">
                  Import cloud recordings, auto-transcribe, and extract key decisions
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              disabled={isImporting}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer disabled:opacity-50"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="mt-5 space-y-5">
            {isCheckingMeet ? (
              <div className="flex items-center justify-center gap-2 py-8 text-xs text-slate-400">
                <LoaderCircle className="animate-spin text-emerald-400" size={18} />
                <span>Checking Google Meet connection...</span>
              </div>
            ) : !meetConnected ? (
              /* Google Meet Not Connected Banner */
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="size-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-emerald-300">
                      Google Meet is not connected yet
                    </h4>
                    <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                      Connect your Google Workspace or Meet account to automatically discover and
                      import your recorded calls and audio transcripts.
                    </p>

                    <button
                      type="button"
                      disabled={isConnecting}
                      onClick={handleConnectMeet}
                      className="mt-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/25 hover:shadow-emerald-600/40 transition cursor-pointer disabled:opacity-50"
                    >
                      {isConnecting ? (
                        <LoaderCircle className="animate-spin" size={14} />
                      ) : (
                        <Sparkles size={14} />
                      )}
                      <span>
                        {isConnecting ? "Connecting..." : "Connect Google Meet in 1-Click"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ) : importedMeeting ? (
              /* Import Success Card */
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-4">
                <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 size={20} />
                  <span>Call Imported & AI Intelligence Generated!</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3.5 space-y-1.5">
                  <p className="font-semibold text-white text-xs">{importedMeeting.title}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={13} className="text-emerald-400" />
                      Google Meet Source
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={13} className="text-cyan-400" />
                      {importedMeeting.participants?.length || 4} Attendees
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleViewImportedMeeting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500 cursor-pointer"
                >
                  <span>Open Meeting Workspace</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            ) : (
              /* Google Meet Calls Selection */
              <>
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-300">
                    Available Google Meet Calls
                  </label>

                  <div className="space-y-2.5">
                    {GOOGLE_MEET_PRESETS.map((preset, idx) => {
                      const isSelected = !useCustomTitle && selectedPreset === idx;
                      return (
                        <div
                          key={preset.title}
                          onClick={() => {
                            setUseCustomTitle(false);
                            setSelectedPreset(idx);
                          }}
                          className={`group cursor-pointer rounded-2xl border p-3.5 transition ${
                            isSelected
                              ? "border-emerald-500/50 bg-emerald-500/15 shadow-md shadow-emerald-500/10"
                              : "border-white/[0.08] bg-slate-900/60 hover:border-white/20 hover:bg-slate-900"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                                  {preset.badge}
                                </span>
                                <span className="text-[11px] text-slate-400">{preset.timeAgo}</span>
                              </div>
                              <h4 className="mt-1.5 text-xs font-semibold text-white">
                                {preset.title}
                              </h4>
                              <p className="mt-1 text-[11px] text-slate-400">
                                {preset.duration} • {preset.participants.join(", ")}
                              </p>
                            </div>

                            <div
                              className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition ${
                                isSelected
                                  ? "border-emerald-400 bg-emerald-500 text-slate-950"
                                  : "border-white/20 bg-white/5"
                              }`}
                            >
                              {isSelected && <Check size={12} strokeWidth={3} />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Title Option */}
                <div className="pt-2 border-t border-white/[0.08]">
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input
                      type="radio"
                      name="importType"
                      checked={useCustomTitle}
                      onChange={() => setUseCustomTitle(true)}
                      className="text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-medium text-slate-300">
                      Import with Custom Title / Specific Call
                    </span>
                  </label>

                  {useCustomTitle && (
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder="e.g. Client Feedback & Discovery Call"
                      className="h-10 w-full rounded-xl border border-white/[0.08] bg-slate-900/80 px-3.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/[0.08] pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isImporting}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white cursor-pointer disabled:opacity-50"
            >
              {importedMeeting ? "Close" : "Cancel"}
            </button>

            {meetConnected && !importedMeeting && (
              <button
                type="button"
                disabled={isImporting}
                onClick={handleImport}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:shadow-emerald-600/40 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isImporting ? (
                  <LoaderCircle className="animate-spin" size={15} />
                ) : (
                  <Video size={15} />
                )}
                <span>{isImporting ? "Processing Call..." : "Import Call & Analyze"}</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}