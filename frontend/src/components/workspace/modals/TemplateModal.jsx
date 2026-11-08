"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowRight,
  Bot,
  Check,
  Copy,
  Sparkles,
  X,
} from "lucide-react";

const emptySubscribe = () => () => {};

export default function TemplateModal({ isOpen, onClose, template, Icon }) {
  const router = useRouter();
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [promptText, setPromptText] = useState(template?.prompt || "");
  const [copied, setCopied] = useState(false);

  // Lock body scroll and handle Escape key while modal is open
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isClient || !isOpen || !template) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      toast.success("Template prompt copied to clipboard! 📋");
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      toast.error("Failed to copy prompt to clipboard");
    }
  };

  const handleRunInAssistant = () => {
    try {
      sessionStorage.setItem("meetmind_prefill_prompt", promptText);
      sessionStorage.setItem("meetmind_force_new_chat", "true");
      localStorage.removeItem("meetmind_active_chat_id");
    } catch (_) {}
    toast.success("Opening fresh AI session... 🚀");
    router.push("/ai-assistant?new=true");
  };

  const ModalIcon = Icon || Bot;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-slate-950/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow backdrop - clipped by parent overflow-hidden */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-indigo-600/15 blur-3xl" />

        {/* Header */}
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600/30 to-indigo-600/30 border border-violet-500/30 text-violet-300 shadow-md">
              <ModalIcon size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-400">
                <Sparkles size={12} className="text-cyan-400" />
                <span>Synthesis Template</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                {template.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-2 text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Description */}
        <p className="relative z-10 mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
          {template.description}
        </p>

        {/* Prompt Framework Editor / Preview */}
        <div className="relative z-10 mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>AI Prompt Framework</span>
            <span className="text-[11px] font-normal text-slate-500">
              Editable preview
            </span>
          </div>

          <div className="relative">
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-white/[0.08] bg-slate-900/80 p-4 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition leading-relaxed resize-none font-sans"
              placeholder="Enter your prompt framework..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="relative z-10 mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={handleCopy}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer active:scale-95"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy Prompt</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleRunInAssistant}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 transition cursor-pointer active:scale-95"
          >
            <span>Run in AI Assistant</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
