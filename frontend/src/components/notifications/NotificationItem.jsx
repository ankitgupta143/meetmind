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
    className: "bg-amber-50 text-amber-600",
  },
  [NOTIFICATION_TYPES.UPLOAD]: {
    Icon: FileUp,
    className: "bg-sky-50 text-sky-600",
  },
  [NOTIFICATION_TYPES.EXPORT]: {
    Icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-600",
  },
  [NOTIFICATION_TYPES.MEETING]: {
    Icon: CalendarDays,
    className: "bg-violet-50 text-violet-600",
  },
  [NOTIFICATION_TYPES.REMINDER]: {
    Icon: BellRing,
    className: "bg-orange-50 text-orange-600",
  },
  [NOTIFICATION_TYPES.AI]: {
    Icon: Bot,
    className: "bg-indigo-50 text-indigo-600",
  },
  [NOTIFICATION_TYPES.WORKSPACE]: {
    Icon: HardDrive,
    className: "bg-cyan-50 text-cyan-600",
  },
  [NOTIFICATION_TYPES.COMMENT]: {
    Icon: MessageSquareText,
    className: "bg-blue-50 text-blue-600",
  },
  [NOTIFICATION_TYPES.MENTION]: {
    Icon: UserRoundPlus,
    className: "bg-pink-50 text-pink-600",
  },
};

export default function NotificationItem({ notification, onRead }) {
  const appearance = typeAppearance[notification.type] || {
    Icon: UserRound,
    className: "bg-zinc-100 text-zinc-600",
  };
  const { Icon } = appearance;

  return (
    <button
      className={`flex w-full gap-3 border-b border-zinc-100 px-5 py-4 text-left transition hover:bg-zinc-50 ${notification.read ? "bg-white" : "bg-indigo-50/35"}`}
      onClick={() => onRead(notification.id)}
      type="button"
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${appearance.className}`}
      >
        <Icon size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-3">
          <span className="text-sm font-semibold text-zinc-900">
            {notification.title}
          </span>
          {!notification.read && (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
          )}
        </span>
        {notification.description && (
          <span className="mt-0.5 block truncate text-xs text-zinc-600">
            {notification.description}
          </span>
        )}
        <span className="mt-1.5 block text-xs text-zinc-400">
          {notification.timestamp}
        </span>
      </span>
    </button>
  );
}
