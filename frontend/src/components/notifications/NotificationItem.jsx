import {
  BellRing,
  Bot,
  CalendarDays,
  CheckCircle2,
  FileUp,
  HardDrive,
  LoaderCircle,
  MessageSquareText,
  UserRound,
  UserRoundPlus,
} from "lucide-react";

import { NOTIFICATION_TYPES } from "./notification.constant";

const typeAppearance = {
  [NOTIFICATION_TYPES.PROCESSING]: {
    Icon: LoaderCircle,
    className: "bg-amber-500/15 border border-amber-500/30 text-amber-400",
  },
  [NOTIFICATION_TYPES.UPLOAD]: {
    Icon: FileUp,
    className: "bg-sky-500/15 border border-sky-500/30 text-sky-400",
  },
  [NOTIFICATION_TYPES.EXPORT]: {
    Icon: CheckCircle2,
    className: "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400",
  },
  [NOTIFICATION_TYPES.MEETING]: {
    Icon: CalendarDays,
    className: "bg-violet-500/15 border border-violet-500/30 text-violet-400",
  },
  [NOTIFICATION_TYPES.REMINDER]: {
    Icon: BellRing,
    className: "bg-orange-500/15 border border-orange-500/30 text-orange-400",
  },
  [NOTIFICATION_TYPES.AI]: {
    Icon: Bot,
    className: "bg-indigo-500/15 border border-indigo-500/30 text-indigo-400",
  },
  [NOTIFICATION_TYPES.WORKSPACE]: {
    Icon: HardDrive,
    className: "bg-cyan-500/15 border border-cyan-500/30 text-cyan-400",
  },
  [NOTIFICATION_TYPES.COMMENT]: {
    Icon: MessageSquareText,
    className: "bg-blue-500/15 border border-blue-500/30 text-blue-400",
  },
  [NOTIFICATION_TYPES.MENTION]: {
    Icon: UserRoundPlus,
    className: "bg-pink-500/15 border border-pink-500/30 text-pink-400",
  },
};

export default function NotificationItem({ notification, onRead }) {
  const appearance = typeAppearance[notification.type] || {
    Icon: UserRound,
    className: "bg-white/[0.05] border border-white/10 text-slate-400",
  };
  const { Icon } = appearance;

  return (
    <button
      className={`flex w-full gap-3 px-5 py-3.5 text-left transition hover:bg-white/[0.04] ${notification.read ? "bg-transparent" : "bg-indigo-500/[0.08]"}`}
      onClick={() => onRead(notification.id)}
      type="button"
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${appearance.className}`}
      >
        <Icon size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="text-xs font-semibold text-white">
            {notification.title}
          </span>
          {!notification.read && (
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
          )}
        </span>
        {notification.description && (
          <span className="mt-0.5 block truncate text-[11px] text-slate-400">
            {notification.description}
          </span>
        )}
        <span className="mt-1 block font-mono text-[10px] text-slate-500">
          {notification.timestamp}
        </span>
      </span>
    </button>
  );
}
