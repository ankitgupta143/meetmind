"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";
import MeetingDetailsHeader from "@/components/meetings/MeetingDetailsHeader";
import MeetingWorkspace from "@/components/meetings/MeetingWorkspace";

import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function MeetingDetailsPage() {
  const params = useParams();
  const meetingId = params?.id;

  const { loading: authLoading, isAuthenticated } = useAuth();

  const [meeting, setMeeting] = useState(null);
  const [insights, setInsights] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshMeetingData = useCallback(async () => {
    if (!meetingId) return;
    try {
      const [mRes, iRes] = await Promise.allSettled([
        api.get(`/meetings/${meetingId}`),
        api.get(`/meetings/${meetingId}/insights`),
      ]);
      if (mRes.status === "fulfilled" && mRes.value.data?.data?.meeting) {
        setMeeting(mRes.value.data.data.meeting);
      }
      if (iRes.status === "fulfilled" && iRes.value.data?.data?.insights) {
        setInsights(iRes.value.data.data.insights);
      }
    } catch (err) {
      console.error("Failed to refresh meeting data:", err);
    }
  }, [meetingId]);

  useEffect(() => {
    if (
      authLoading ||
      !isAuthenticated ||
      !meetingId
    ) {
      return;
    }

    let isMounted = true;
    let pollTimer = null;

    const fetchMeetingData = async () => {
      try {
        setLoading(true);
        setError("");

        const meetingResponse = await api.get(`/meetings/${meetingId}`);
        const meetingData = meetingResponse.data?.data?.meeting;

        if (!meetingData) {
          throw new Error("Meeting not found.");
        }

        if (isMounted) {
          setMeeting(meetingData);
        }

        try {
          const insightsResponse = await api.get(`/meetings/${meetingId}/insights`);
          const insightsData = insightsResponse.data?.data?.insights;
          if (isMounted) {
            setInsights(insightsData);
          }
        } catch {
          console.log("Insights still processing, will poll for updates...");
          // Poll every 4 seconds if insights are not ready yet
          const pollInsights = async () => {
            if (!isMounted) return;
            try {
              const res = await api.get(`/meetings/${meetingId}/insights`);
              if (res.data?.data?.insights && isMounted) {
                setInsights(res.data.data.insights);
                return;
              }
            } catch {
              // still processing
            }
            if (isMounted) {
              pollTimer = setTimeout(pollInsights, 4000);
            }
          };

          pollTimer = setTimeout(pollInsights, 4000);
        }
      } catch (error) {
        console.error(
          "Failed to load meeting workspace:",
          error
        );

        if (isMounted) {
          setError(
            error.response?.data?.message ||
            "Failed to load meeting."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMeetingData();

    return () => {
      isMounted = false;
      if (pollTimer) {
        clearTimeout(pollTimer);
      }
    };
  }, [
    authLoading,
    isAuthenticated,
    meetingId,
  ]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-sm text-zinc-500">
            Loading meeting...
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !meeting) {
    return (
      <AppLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
            {error || "Meeting not found."}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <MeetingDetailsHeader
          meeting={meeting}
          insights={insights}
          onMeetingUpdated={(updated) => setMeeting(updated)}
        />

        <MeetingWorkspace
          meeting={meeting}
          insights={insights}
          onRefresh={refreshMeetingData}
        />
      </div>
    </AppLayout>
  );
}
