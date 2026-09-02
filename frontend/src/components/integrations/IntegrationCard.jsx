"use client";

import { ChevronRight } from "lucide-react";
import ConnectedBadge from "./ConnectedBadge";

const IntegrationCard = ({ integration, onOpen }) => {
  const Icon = integration.icon;
  return (
    <button
      onClick={() => onOpen(integration)}
      className="group flex min-h-36 w-full flex-col rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-5 text-left shadow-xl backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-slate-900/80 cursor-pointer"
    >
      <div className="flex w-full items-start justify-between">
        <span
          className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400"
        >
          <Icon className="size-5" />
        </span>
        {integration.connected ? (
          <ConnectedBadge />
        ) : (
          <ChevronRight className="size-4 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-indigo-400" />
        )}
      </div>
      <h3 className="mt-3.5 text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
        {integration.name}
      </h3>
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">
        {integration.description}
      </p>
    </button>
  );
};

export default IntegrationCard;
