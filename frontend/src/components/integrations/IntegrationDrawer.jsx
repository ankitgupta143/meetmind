"use client";

import { CheckCircle2, RefreshCw, ShieldCheck } from "lucide-react";
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
      <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-md">
        <SheetHeader className="border-b px-7 pb-6 pt-8">
          <div
            className={`mb-3 flex size-14 items-center justify-center rounded-2xl ${integration.color}`}
          >
            <Icon className="size-7" />
          </div>
          <SheetTitle className="text-2xl">{integration.name}</SheetTitle>
          <SheetDescription className="pr-8 leading-6">
            {integration.description}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 px-7 py-7">
          <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
            <p className="font-semibold">
              {integration.connected
                ? "Integration connected"
                : "Ready to connect"}
            </p>
            <p className="mt-1 text-sm leading-5 text-zinc-500">
              {integration.connected
                ? integration.lastSync || "Your information is up to date."
                : "Connect to start bringing relevant meeting context into MeetMind."}
            </p>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 size-5 text-indigo-600" />
              <div>
                <p className="font-semibold">Secure connection</p>
                <p className="text-zinc-500">
                  You stay in control of what MeetMind can access.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <RefreshCw className="mt-0.5 size-5 text-indigo-600" />
              <div>
                <p className="font-semibold">Automatic sync</p>
                <p className="text-zinc-500">
                  Keep your meeting data fresh without manual work.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-auto border-t p-6">
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
