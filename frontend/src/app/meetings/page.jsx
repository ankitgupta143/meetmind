"use client";

import { useEffect, useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import MeetingsHeader from "@/components/meetings/MeetingsHeader";
import MeetingsList from "@/components/meetings/MeetingsList";
import MeetingsToolbar from "@/components/meetings/MeetingsToolbar";

import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { mapMeetingToCard } from "@/utils/meeting";

export default function MeetingsPage() {
  const { loading: authLoading, isAuthenticated } = useAuth();

  const [meetings, setMeetings] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setMeetings([]);
      setPagination(null);
      setLoading(false);
      return;
    }

    const fetchMeetings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/meetings", {
          params: {
            page: 1,
            limit: 10,
          },
        });

        const data = response.data?.data;

        setMeetings((data?.meetings ?? []).map(mapMeetingToCard));
        setPagination(data?.pagination ?? null);
      } catch (error) {
        console.error("Failed to fetch meetings:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load meetings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [authLoading, isAuthenticated]);

  return (
    <AppLayout>
      <div className="space-y-8">
        <MeetingsHeader />

        <MeetingsToolbar />

        <MeetingsList
          meetings={meetings}
          loading={loading}
          error={error}
        />
      </div>
    </AppLayout>
  );
}