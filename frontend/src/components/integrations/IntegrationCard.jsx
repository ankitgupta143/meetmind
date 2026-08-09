"use client";

import { ChevronRight } from "lucide-react";
import ConnectedBadge from "./ConnectedBadge";
import ConnectButton from "./ConnectButton";

const IntegrationCard = ({ integration, onOpen }) => {
  const Icon = integration.icon;
  return (
    <button
      onClick={() => onOpen(integration)}
      className="group flex min-h-40 w-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-800"
    >
      <div className="flex w-full items-start justify-between">
        <span
          className={`flex size-11 items-center justify-center rounded-xl ${integration.color}`}
        >
          <Icon className="size-5" />
        </span>
        {integration.connected ? (
          <ConnectedBadge />
        ) : (
          <ChevronRight className="size-5 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500" />
        )}
      </div>
      <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">
        {integration.name}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm leading-5 text-zinc-500">
        {integration.description}
      </p>
    </button>
  );
};
export default IntegrationCard;
