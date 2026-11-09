"use client";

import { useEffect, useState, useSyncExternalStore, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  LoaderCircle,
  CheckCircle2,
  Sparkles,
  Hash,
  MessageSquare,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchUserIntegrations,
  connectIntegration,
  postMeetingToSlack,
} from "@/components/integrations/services/integration.service";

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

const PRESET_CHANNELS = ["#general", "#engineering", "#product-updates", "#executive-sync"];

export default function PostToSlackModal({ isOpen, onClose, meeting }) {
  const isClient = useIsClient();
  const [channel, setChannel] = useState("#general");
  const [customNote, setCustomNote] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [isCheckingSlack, setIsCheckingSlack] = useState(true);
  const [slackConnected, setSlackConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [postResult, setPostResult] = useState(null);

  // Check if Slack is connected whenever modal opens
  useEffect(() => {
    if (!isOpen) return;

    let ignore = false;
    async function checkSlack() {
      setIsCheckingSlack(true);
      try {
        const integrations = await fetchUserIntegrations();
        if (ignore) return;
        const slack = integrations.find(
          (i) => i.provider?.toLowerCase() === "slack" && i.status === "connected"
        );
        setSlackConnected(Boolean(slack));
        if (slack?.config?.channel) {
          setChannel(slack.config.channel);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Failed to check Slack integration:", err);
          setSlackConnected(false);
        }
      } finally {
        if (!ignore) setIsCheckingSlack(false);
      }
    }

    checkSlack();

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
    if (isPosting) return;
    setPostResult(null);
    onClose();
  }, [isPosting, onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isPosting) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPosting, handleClose]);

  const handleConnectSlack = async () => {
    setIsConnecting(true);
    try {
      await connectIntegration("slack", {
        name: "Slack",
        config: { channel: "#general" },
      });
      setSlackConnected(true);
      toast.success("Slack connected successfully! You can now dispatch meeting summaries. 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to connect Slack.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSendToSlack = async () => {
    const meetingId = meeting?._id || meeting?.id;
    if (!meetingId) {
      toast.error("Invalid meeting ID.");
      return;
    }

    setIsPosting(true);
    try {
      const result = await postMeetingToSlack({
        meetingId,
        channel: channel.trim().startsWith("#") ? channel.trim() : `#${channel.trim()}`,
        customNote: customNote.trim(),
      });

      setPostResult(result);
      toast.success(result.message || `Summary posted to Slack ${channel}! 🚀`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to dispatch summary to Slack. Check your connection."
      );
    } finally {
      setIsPosting(false);
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
              <div className="flex size-11 items-center justify-center rounded-2xl bg-[#4A154B]/20 border border-[#E01E5A]/30 text-amber-400 shadow-md">
                <Hash className="size-6 text-[#E01E5A]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Post to Slack
                  <Sparkles size={15} className="text-amber-400" />
                </h3>
                <p className="text-xs text-slate-400">
                  Deliver executive intelligence & action items directly to your team
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              disabled={isPosting}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer disabled:opacity-50"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="mt-5 space-y-5">
            {/* Checking Slack Status */}
            {isCheckingSlack ? (
              <div className="flex items-center justify-center gap-2 py-8 text-xs text-slate-400">
                <LoaderCircle className="animate-spin text-indigo-400" size={18} />
                <span>Checking Slack connection...</span>
              </div>
            ) : !slackConnected ? (
              /* Slack Not Connected Prompt */
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="size-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-amber-300">
                      Slack is not connected yet
                    </h4>
                    <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                      Connect your Slack workspace to instantly broadcast action items, executive
                      takeaways, and decisions with full speaker attribution.
                    </p>

                    <button
                      type="button"
                      disabled={isConnecting}
                      onClick={handleConnectSlack}
                      className="mt-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-amber-500/20 hover:shadow-amber-500/35 transition cursor-pointer disabled:opacity-50"
                    >
                      {isConnecting ? (
                        <LoaderCircle className="animate-spin" size={14} />
                      ) : (
                        <Sparkles size={14} />
                      )}
                      <span>{isConnecting ? "Connecting..." : "Connect Slack in 1-Click"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : postResult ? (
              /* Success confirmation receipt */
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-3">
                <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 size={20} />
                  <span>Summary successfully delivered to Slack!</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your meeting summary, action items, and strategic decisions have been posted to{" "}
                  <span className="font-semibold text-white">{postResult.channel || channel}</span>.
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/[0.08]">
                  <span>Status: Verified & Dispatched</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            ) : (
              /* Slack Form & Preview */
              <>
                {/* Target Channel Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Target Slack Channel
                  </label>
                  <div className="relative">
                    <Hash
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={channel}
                      onChange={(e) => setChannel(e.target.value)}
                      placeholder="#general"
                      className="h-10 w-full rounded-xl border border-white/[0.08] bg-slate-900/80 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  {/* Channel Presets */}
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {PRESET_CHANNELS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setChannel(preset)}
                        className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition cursor-pointer ${
                          channel === preset
                            ? "border-amber-500/40 bg-amber-500/20 text-amber-300"
                            : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06]"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Note / Commentary */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <MessageSquare size={13} className="text-indigo-400" />
                    <span>Custom Note for Team (Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="e.g. Please review action item assignments prior to Friday retro."
                    className="w-full rounded-xl border border-white/[0.08] bg-slate-900/80 p-3 text-xs text-white placeholder-slate-500 outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 resize-none"
                  />
                </div>

                {/* Formatted Content Preview */}
                <div className="rounded-2xl border border-white/[0.08] bg-slate-900/50 p-3.5 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Included in Slack Dispatch:
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <div className="size-1.5 rounded-full bg-indigo-400" />
                      <span>Executive Overview & Key Takeaways</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-1.5 rounded-full bg-cyan-400" />
                      <span>Priority Action Items with Assignees</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-1.5 rounded-full bg-emerald-400" />
                      <span>Strategic Decisions & Rationales</span>
                    </div>
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
              disabled={isPosting}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white cursor-pointer disabled:opacity-50"
            >
              {postResult ? "Close" : "Cancel"}
            </button>

            {slackConnected && !postResult && (
              <button
                type="button"
                disabled={isPosting || !channel.trim()}
                onClick={handleSendToSlack}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isPosting ? (
                  <LoaderCircle className="animate-spin" size={15} />
                ) : (
                  <Send size={15} />
                )}
                <span>{isPosting ? "Posting to Slack..." : `Post to ${channel || "Slack"}`}</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}