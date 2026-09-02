"use client";

import { CheckCircle2, RefreshCw, ShieldCheck, Sparkles, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ConnectButton from "./ConnectButton";

const IntegrationDrawer = ({ integration, onClose, onConnect }) => {
  if (!integration) return null;
  const Icon = integration.icon;

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
            <p className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className={`size-2 rounded-full ${integration.connected ? "bg-emerald-400" : "bg-indigo-400"}`} />
              {integration.connected
                ? "Service Connected & Active"
                : "Ready to Connect"}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              {integration.connected
                ? integration.lastSync || "Your meeting transcripts and data are up to date."
                : "Connect to start streaming live audio and importing meeting context into MeetMind."}
            </p>
          </div>

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
          </div>
        </div>

        <div className="mt-auto border-t border-white/[0.08] bg-slate-900/40 p-6">
          <ConnectButton
            connected={integration.connected}
            compact
            onClick={() => onConnect(integration)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default IntegrationDrawer;
