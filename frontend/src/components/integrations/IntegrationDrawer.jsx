"use client";

import { useState } from "react";
import {
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  LoaderCircle,
  Unlink,
  Check,
  Plus,
  Sliders,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function IntegrationConfigSection({ integration, onSaveConfig }) {
  const [webhookUrl, setWebhookUrl] = useState(integration?.config?.webhookUrl || "");
  const [channel, setChannel] = useState(integration?.config?.channel || "#general");
  const [autoSync, setAutoSync] = useState(integration?.config?.autoSync ?? true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!onSaveConfig) return;
    setIsSaving(true);
    try {
      await onSaveConfig(integration.id, {
        webhookUrl: webhookUrl.trim(),
        channel: channel.trim(),
        autoSync,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="rounded-2xl border border-white/[0.08] bg-slate-900/60 p-4 space-y-3.5"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
          <Sliders size={13} className="text-indigo-400" />
          <span>Integration Settings</span>
        </h4>
        <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
          Configurable
        </span>
      </div>

      {integration.id === "slack" && (
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Incoming Webhook URL (Optional)
            </label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
              className="h-9 w-full rounded-xl border border-white/[0.08] bg-slate-950/80 px-3 text-xs text-white placeholder-slate-600 outline-none transition focus:border-indigo-500"
            />
            <p className="mt-1 text-[10px] text-slate-500">
              Leave blank to use verified instant simulated dispatch.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Default Target Channel
            </label>
            <input
              type="text"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              placeholder="#general"
              className="h-9 w-full rounded-xl border border-white/[0.08] bg-slate-950/80 px-3 text-xs text-white placeholder-slate-600 outline-none transition focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {integration.id === "google-meet" && (
        <div className="space-y-2.5">
          <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
            <span>Auto-discover recorded meetings</span>
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
              className="rounded border-white/20 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
            />
          </label>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Automatically scans your Google Calendar & Google Drive for new Meet recordings.
          </p>
        </div>
      )}

      {integration.id !== "slack" && integration.id !== "google-meet" && (
        <div className="space-y-2.5">
          <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
            <span>Automated Background Sync</span>
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
              className="rounded border-white/20 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
            />
          </label>
        </div>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.06] py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition disabled:opacity-50 cursor-pointer"
      >
        {isSaving ? <LoaderCircle className="animate-spin" size={13} /> : <Check size={13} />}
        <span>{isSaving ? "Saving Settings..." : "Save Configuration"}</span>
      </button>
    </form>
  );
}

const IntegrationDrawer = ({
  integration,
  onClose,
  onConnect,
  onDisconnect,
  onSync,
  onSaveConfig,
  isConnecting = false,
  isSyncing = false,
  isDisconnecting = false,
}) => {
  if (!integration) return null;
  const Icon = integration.icon;

  const isConnected = Boolean(integration.connected);

  return (
    <Sheet
      open={Boolean(integration)}
      onOpenChange={(open) => !open && onClose()}
    >
      <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-md border-l border-white/10 bg-slate-950/95 text-slate-100 shadow-2xl backdrop-blur-2xl">
        <SheetHeader className="border-b border-white/[0.08] px-7 pb-6 pt-8">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 shadow-lg shadow-indigo-500/20">
            <Icon className="size-7" />
          </div>
          <SheetTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {integration.name}
            <Sparkles size={16} className="text-cyan-400" />
          </SheetTitle>
          <SheetDescription className="pr-6 text-xs text-slate-400 leading-relaxed">
            {integration.description}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-7 py-6">
          {/* Status Box */}
          <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 p-4 shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-white flex items-center gap-2">
                <span
                  className={`size-2.5 rounded-full ${
                    isConnected ? "bg-emerald-400 animate-pulse" : "bg-indigo-400"
                  }`}
                />
                {isConnected ? "Service Connected & Active" : "Ready to Connect"}
              </p>

              {isConnected && onSync && (
                <button
                  type="button"
                  disabled={isSyncing}
                  onClick={() => onSync(integration)}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50 cursor-pointer"
                  title="Synchronize now"
                >
                  <RefreshCw
                    size={11}
                    className={isSyncing ? "animate-spin text-indigo-400" : "text-slate-400"}
                  />
                  <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
                </button>
              )}
            </div>

            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              {isConnected
                ? integration.lastSync || "Your meeting transcripts and data are up to date."
                : "Connect to start streaming live audio and importing meeting context into MeetMind."}
            </p>
          </div>

          {/* Config Settings (when connected) */}
          {isConnected && (
            <IntegrationConfigSection
              key={integration.id}
              integration={integration}
              onSaveConfig={onSaveConfig}
            />
          )}

          {/* Features / Guarantees */}
          <div className="space-y-4 text-xs">
            <div className="flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <p className="font-bold text-white">End-to-End Encrypted</p>
                <p className="mt-0.5 text-slate-400">
                  You maintain full data sovereignty. Permissions can be revoked at any time.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                <RefreshCw className="size-4" />
              </div>
              <div>
                <p className="font-bold text-white">Automated Background Sync</p>
                <p className="mt-0.5 text-slate-400">
                  Transcripts and action items synchronize in real-time without manual uploads.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="size-4" />
              </div>
              <div>
                <p className="font-bold text-white">Real-time Intelligence</p>
                <p className="mt-0.5 text-slate-400">
                  Enables instant diarization, speaker participation metrics, and automated summaries.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto border-t border-white/[0.08] bg-slate-900/60 p-6 space-y-2.5">
          {isConnected ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/15 py-2.5 text-xs font-semibold text-emerald-300">
                <Check size={14} />
                <span>Connected & Monitored</span>
              </div>

              <button
                type="button"
                disabled={isDisconnecting || isSyncing}
                onClick={() => onDisconnect?.(integration)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 py-2.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20 hover:border-rose-500/40 disabled:opacity-50 cursor-pointer"
              >
                {isDisconnecting ? (
                  <LoaderCircle className="animate-spin" size={14} />
                ) : (
                  <Unlink size={14} />
                )}
                <span>{isDisconnecting ? "Disconnecting..." : "Disconnect Service"}</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={isConnecting}
              onClick={() => onConnect?.(integration)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40 disabled:opacity-50 active:scale-95 cursor-pointer"
            >
              {isConnecting ? (
                <LoaderCircle className="animate-spin" size={15} />
              ) : (
                <Plus size={15} />
              )}
              <span>{isConnecting ? "Connecting service..." : "Connect Service"}</span>
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default IntegrationDrawer;
