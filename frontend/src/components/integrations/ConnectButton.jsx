"use client";

import { Check, Plus } from "lucide-react";

const ConnectButton = ({ connected, onClick, compact = false }) => {
  if (connected) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 font-semibold text-emerald-300 transition hover:bg-emerald-500/25 cursor-pointer ${
          compact ? "w-full py-2.5 text-xs" : "px-3.5 py-1.5 text-xs"
        }`}
      >
        <Check className="size-3.5" />
        Connected
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:shadow-indigo-600/40 active:scale-95 cursor-pointer ${
        compact ? "w-full py-2.5 text-xs" : "px-4 py-2 text-xs"
      }`}
    >
      <Plus className="size-3.5" />
      Connect Service
    </button>
  );
};

export default ConnectButton;
