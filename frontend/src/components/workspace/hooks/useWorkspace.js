"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  getWorkspaceOverviewApi,
  toggleMeetingFavoriteApi,
  toggleMeetingPinApi,
  toggleWorkspaceActionItemApi,
} from "../services/workspaceService";

export default function useWorkspace() {
  const [data, setData] = useState({
    stats: {
      totalMeetings: 0,
      favoriteMeetings: 0,
      pinnedMeetings: 0,
      savedConversations: 0,
      pendingActionItems: 0,
      totalHoursRecorded: "0 hr",
    },
    collections: {
      favoriteMeetings: [],
      pinnedMeetings: [],
      savedConversations: [],
      actionItems: [],
    },
    recentActivity: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const overview = await getWorkspaceOverviewApi();
      if (isMountedRef.current && overview) {
        setData(overview);
      }
    } catch (err) {
      if (isMountedRef.current) {
        console.error("Failed to load workspace overview:", err);
        setError(
          err.response?.data?.message ||
            "Unable to load workspace data. Please try again."
        );
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    let ignore = false;

    async function load() {
      try {
        const overview = await getWorkspaceOverviewApi();
        if (!ignore && overview) {
          setData(overview);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Failed to load workspace overview:", err);
          setError(
            err.response?.data?.message ||
              "Unable to load workspace data. Please try again."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
      isMountedRef.current = false;
    };
  }, []);

  // Optimistic Toggle Favorite with Toast feedback
  const toggleFavorite = useCallback(async (meetingId, title) => {
    if (!meetingId) return;

    let previousData;
    let willBeFavorite = false;
    let meetingTitle = title;

    setData((prev) => {
      previousData = prev;
      const meetingList = prev.collections?.favoriteMeetings || [];
      const currentTarget = meetingList.find((m) => m.id === meetingId);
      if (currentTarget && !meetingTitle) {
        meetingTitle = currentTarget.title;
      }
      const isFav = currentTarget?.isFavorite ?? false;
      willBeFavorite = !isFav;

      return {
        ...prev,
        stats: {
          ...prev.stats,
          favoriteMeetings: Math.max(
            0,
            prev.stats.favoriteMeetings + (willBeFavorite ? 1 : -1)
          ),
        },
        collections: {
          ...prev.collections,
          favoriteMeetings: meetingList.map((m) =>
            m.id === meetingId ? { ...m, isFavorite: willBeFavorite } : m
          ),
        },
      };
    });

    if (willBeFavorite) {
      toast.success(
        meetingTitle
          ? `"${meetingTitle}" added to workspace favorites! ⭐`
          : "Meeting added to workspace favorites! ⭐"
      );
    } else {
      toast.info(
        meetingTitle
          ? `"${meetingTitle}" removed from favorites`
          : "Meeting removed from favorites"
      );
    }

    try {
      await toggleMeetingFavoriteApi(meetingId);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      toast.error("Failed to update favorite status");
      // Revert on error
      if (previousData) setData(previousData);
    }
  }, []);

  // Optimistic Toggle Pin with Toast feedback
  const togglePin = useCallback(async (meetingId, title) => {
    if (!meetingId) return;

    let previousData;
    let willBePinned = false;
    let meetingTitle = title;

    setData((prev) => {
      previousData = prev;
      const favoriteList = prev.collections?.favoriteMeetings || [];
      const pinnedList = prev.collections?.pinnedMeetings || [];
      const currentTarget =
        pinnedList.find((m) => m.id === meetingId) ||
        favoriteList.find((m) => m.id === meetingId);

      if (currentTarget && !meetingTitle) {
        meetingTitle = currentTarget.title;
      }

      const isPinned = currentTarget?.isPinned ?? false;
      willBePinned = !isPinned;

      let updatedPinned;
      if (willBePinned) {
        if (currentTarget) {
          updatedPinned = [
            { ...currentTarget, isPinned: true },
            ...pinnedList.filter((m) => m.id !== meetingId),
          ];
        } else {
          updatedPinned = pinnedList;
        }
      } else {
        updatedPinned = pinnedList.filter((m) => m.id !== meetingId);
      }

      return {
        ...prev,
        stats: {
          ...prev.stats,
          pinnedMeetings: Math.max(
            0,
            (prev.stats.pinnedMeetings || 0) + (willBePinned ? 1 : -1)
          ),
        },
        collections: {
          ...prev.collections,
          favoriteMeetings: favoriteList.map((m) =>
            m.id === meetingId ? { ...m, isPinned: willBePinned } : m
          ),
          pinnedMeetings: updatedPinned,
        },
      };
    });

    if (willBePinned) {
      toast.success(
        meetingTitle
          ? `"${meetingTitle}" pinned to workspace! 📌`
          : "Meeting pinned to workspace! 📌"
      );
    } else {
      toast.info(
        meetingTitle
          ? `"${meetingTitle}" unpinned from workspace`
          : "Meeting unpinned from workspace"
      );
    }

    try {
      await toggleMeetingPinApi(meetingId);
    } catch (err) {
      console.error("Failed to toggle pin:", err);
      toast.error("Failed to update pin status");
      if (previousData) setData(previousData);
    }
  }, []);

  // Optimistic Toggle Action Item with Toast feedback
  const toggleActionItem = useCallback(
    async (meetingId, itemIndex, currentStatus) => {
      const nextStatus = currentStatus === "completed" ? "pending" : "completed";
      let previousData;

      setData((prev) => {
        previousData = prev;
        const items = prev.collections?.actionItems || [];
        const isNowCompleted = nextStatus === "completed";

        return {
          ...prev,
          stats: {
            ...prev.stats,
            pendingActionItems: Math.max(
              0,
              prev.stats.pendingActionItems + (isNowCompleted ? -1 : 1)
            ),
          },
          collections: {
            ...prev.collections,
            actionItems: items.map((item) =>
              item.meetingId === meetingId && item.itemIndex === itemIndex
                ? { ...item, status: nextStatus }
                : item
            ),
          },
        };
      });

      if (nextStatus === "completed") {
        toast.success("Deliverable marked as completed! 🎉");
      } else {
        toast.info("Deliverable moved back to pending");
      }

      try {
        await toggleWorkspaceActionItemApi(meetingId, itemIndex, nextStatus);
      } catch (err) {
        console.error("Failed to update action item status:", err);
        toast.error("Failed to update task status");
        // Revert on error
        if (previousData) setData(previousData);
      }
    },
    []
  );

  return {
    data,
    loading,
    error,
    refetch: fetchOverview,
    toggleFavorite,
    togglePin,
    toggleActionItem,
  };
}
