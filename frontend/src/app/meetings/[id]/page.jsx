"use client";

import AppLayout from "@/components/layout/AppLayout";
import MeetingDetailsHeader from "@/components/meetings/MeetingDetailsHeader";
import MeetingWorkspace from "@/components/meetings/MeetingWorkspace";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MeetingDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const {loading: authLoading, isAuthenticated} = useAuth();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if(authLoading) return;

    if(!isAuthenticated){
      setLoading(false);
      return;
    }

    const fetchMeeting = async() => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/meetings/${params.id}`);
        const meetingData = response.data?.data?.meeting;

        if(!meetingData){
          throw new Error("Meeting data was not returend.");
        }
        setMeeting(meetingData);
      } catch (error) {
        console.error("Failed to fetch meeting:", error);

        if (error.response?.status === 404) {
          setError("Meeting not found.");
        } else {
          setError(
            error.response?.data?.message ||
              "Failed to load meeting."
          );
        }
      } finally{
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [params.id, authLoading, isAuthenticated]);

  if (authLoading || loading) {
    return (
      <AppLayout>
        <div className="py-20 text-center text-sm text-zinc-500">
          Loading meeting...
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="py-20 text-center">
          <h2 className="text-lg font-semibold text-zinc-900">
            {error}
          </h2>

          <button
            onClick={() => router.push("/meetings")}
            className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Back to Meetings
          </button>
        </div>
      </AppLayout>
    );
  }

  if (!meeting) {
    return null;
  }
  return (
    <AppLayout>
      <div className="space-y-8">
        <MeetingDetailsHeader meeting={meeting}/>
        <MeetingWorkspace meeting = {meeting}/>
      </div>
    </AppLayout>
  );
}