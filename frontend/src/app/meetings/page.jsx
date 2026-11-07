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

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 260);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch meetings on mount & when filter dependencies change
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      return;
    }

    let ignore = false;

    async function load() {
      try {
        const response = await api.get("/meetings", {
          params: {
            page,
            limit: 10,
            search: debouncedSearch.trim(),
            status,
            sortBy,
            sortOrder,
          },
        });

        if (!ignore) {
          const data = response.data?.data;
          setMeetings((data?.meetings ?? []).map(mapMeetingToCard));
          setPagination(data?.pagination ?? null);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          console.error("Failed to fetch meetings:", err);
          setError(
            err.response?.data?.message ||
              "Failed to load meetings."
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
    };
  }, [authLoading, isAuthenticated, page, debouncedSearch, status, sortBy, sortOrder]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setPage(1);
    setLoading(true);
  };

  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1);
    setLoading(true);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setLoading(true);
  };

  const handleClearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatus("all");
    setSortBy("date");
    setSortOrder("desc");
    setPage(1);
    setLoading(true);
  };

  const isFiltered = Boolean(debouncedSearch.trim() || status !== "all");

  return (
    <AppLayout>
      <div className="space-y-8">
        <MeetingsHeader />

        <MeetingsToolbar
          search={search}
          onSearchChange={handleSearchChange}
          status={status}
          onStatusChange={handleStatusChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />

        <MeetingsList
          meetings={meetings}
          loading={loading}
          error={error}
          isFiltered={isFiltered}
          onClearFilters={handleClearFilters}
        />
      </div>
    </AppLayout>
  );
}
