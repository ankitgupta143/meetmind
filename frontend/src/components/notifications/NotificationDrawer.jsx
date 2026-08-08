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
      <DropdownMenuTrigger render={<button aria-label="Open notifications" className="relative rounded-xl p-3 text-zinc-700 transition hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-zinc-200 dark:hover:bg-zinc-800" type="button" />}>
        <Bell size={20} />
        {unreadCount > 0 && <span aria-label={`${unreadCount} unread notifications`} className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-zinc-900" />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl bg-white p-0 shadow-xl ring-1 ring-zinc-950/10 dark:bg-zinc-900">
        <NotificationHeader hasUnread={unreadCount > 0} onMarkAllRead={markAllAsRead} />
        <NotificationFilters activeFilter={filter} onChange={setFilter} />
        <div className="max-h-[420px] overflow-y-auto">
          {visibleNotifications.length ? visibleNotifications.map((notification) => <NotificationItem key={notification.id} notification={notification} onRead={markAsRead} />) : <NotificationEmpty isUnreadFilter={filter === "unread"} />}
        </div>
        <button className="w-full border-t border-zinc-200 px-5 py-3 text-center text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700" type="button">View all notifications</button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
