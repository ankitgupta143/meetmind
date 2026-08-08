import { Bell } from "lucide-react";

export default function NotificationEmpty({ isUnreadFilter }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
        <Bell size={20} />
      </span>
      <p className="mt-3 text-sm font-semibold text-zinc-800">
        {isUnreadFilter ? "You’re all caught up" : "No notifications yet"}
      </p>
      <p className="mt-1 text-xs text-zinc-500">
        {isUnreadFilter
          ? "There are no unread notifications."
          : "Important updates will appear here."}
      </p>
    </div>
  );
}
