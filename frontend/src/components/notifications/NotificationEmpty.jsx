import { Bell } from "lucide-react";

export default function NotificationEmpty({ isUnreadFilter }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.05] border border-white/10 text-slate-400">
        <Bell size={20} />
      </span>
      <p className="mt-3 text-sm font-semibold text-slate-200">
        {isUnreadFilter ? "You’re all caught up" : "No notifications yet"}
      </p>
      <p className="mt-1 text-xs text-slate-400">
        {isUnreadFilter
          ? "There are no unread notifications."
          : "Important updates will appear here."}
      </p>
    </div>
  );
}
