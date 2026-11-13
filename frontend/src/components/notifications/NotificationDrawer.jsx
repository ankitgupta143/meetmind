"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import NotificationSkeleton from "./NotificationSkeleton";
import {
  fetchNotificationsApi,
  markAllNotificationsAsReadApi,
  markNotificationAsReadApi,
} from "./notification.service";

export default function NotificationDrawer() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch notifications on mount and when filter changes
  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = await fetchNotificationsApi(filter);
        if (!ignore) {
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (error) {
        if (!ignore) {
          console.warn("[Notifications] Failed to load:", error?.message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    load();

    // Periodic poll every 45s for fresh background events
    const timer = setInterval(() => {
      load();
    }, 45_000);

    return () => {
      ignore = true;
      clearInterval(timer);
    };
  }, [filter]);

  // Refetch when dropdown is opened to guarantee freshness
  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (open) {
      fetchNotificationsApi(filter)
        .then((data) => {
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        })
        .catch(() => {});
    }
  };

  const handleRead = async (notification) => {
    const notificationId = notification?.id || notification;
    const target = notifications.find((n) => n.id === notificationId);

    // Optimistic UI update
    if (target && !target.read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      try {
        await markNotificationAsReadApi(notificationId);
      } catch (err) {
        console.warn("[Notifications] Failed to mark as read on server:", err?.message);
      }
    }

    // Navigate if target notification has a link or meetingId
    if (target?.link) {
      setIsOpen(false);
      router.push(target.link);
    } else if (target?.meetingId) {
      setIsOpen(false);
      router.push(`/meetings/${target.meetingId}`);
    }
  };

  const handleMarkAllRead = async () => {
    // Optimistic UI update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);

    try {
      await markAllNotificationsAsReadApi();
    } catch (err) {
      console.warn("[Notifications] Failed to mark all read on server:", err?.message);
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange} open={isOpen}>
      <DropdownMenuTrigger
        render={
          <button
            aria-label="Open notifications"
            className="relative rounded-xl p-2.5 text-slate-400 transition hover:bg-white/10 hover:text-white focus:outline-none"
            type="button"
          />
        }
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 p-0 shadow-2xl backdrop-blur-2xl text-slate-100"
      >
        <NotificationHeader
          hasUnread={unreadCount > 0}
          onMarkAllRead={handleMarkAllRead}
        />
        <NotificationFilters activeFilter={filter} onChange={setFilter} />
        <div className="max-h-[400px] overflow-y-auto divide-y divide-white/[0.05]">
          {isLoading ? (
            <NotificationSkeleton />
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={() => handleRead(notification)}
              />
            ))
          ) : (
            <NotificationEmpty isUnreadFilter={filter === "unread"} />
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
