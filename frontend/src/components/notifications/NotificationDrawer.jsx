"use client";

import { useMemo, useState } from "react";
import { Bell } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import NotificationEmpty from "./NotificationEmpty";
import NotificationFilters from "./NotificationFilters";
import NotificationHeader from "./NotificationHeader";
import NotificationItem from "./NotificationItem";
import { getInitialNotifications } from "./notification.service";

export default function NotificationDrawer() {
  const [notifications, setNotifications] = useState(getInitialNotifications);
  const [filter, setFilter] = useState("all");
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const visibleNotifications = useMemo(
    () => notifications.filter((notification) => filter === "all" || !notification.read),
    [filter, notifications],
  );

  const markAsRead = (notificationId) => {
    setNotifications((current) => current.map((notification) => (
      notification.id === notificationId ? { ...notification, read: true } : notification
    )));
  };

  const markAllAsRead = () => {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<button aria-label="Open notifications" className="relative rounded-xl p-2.5 text-slate-400 transition hover:bg-white/10 hover:text-white focus:outline-none" type="button" />}>
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 p-0 shadow-2xl backdrop-blur-2xl text-slate-100">
        <NotificationHeader hasUnread={unreadCount > 0} onMarkAllRead={markAllAsRead} />
        <NotificationFilters activeFilter={filter} onChange={setFilter} />
        <div className="max-h-[400px] overflow-y-auto divide-y divide-white/[0.05]">
          {visibleNotifications.length ? visibleNotifications.map((notification) => <NotificationItem key={notification.id} notification={notification} onRead={markAsRead} />) : <NotificationEmpty isUnreadFilter={filter === "unread"} />}
        </div>
        <button className="w-full border-t border-white/[0.08] px-5 py-3 text-center text-xs font-semibold text-indigo-400 transition hover:bg-white/[0.04] hover:text-indigo-300" type="button">
          View all notifications
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
