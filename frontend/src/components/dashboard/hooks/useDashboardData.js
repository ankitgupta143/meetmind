"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export function useDashboardData() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/meetings/stats");
        if (!ignore && response.data?.success && response.data?.data) {
          setData(response.data.data);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          console.error("[Dashboard] Failed to fetch metrics:", err);
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load dashboard metrics."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    if (!authLoading) {
      load();
    }

    return () => {
      ignore = true;
    };
  }, [authLoading, isAuthenticated]);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/meetings/stats");
      if (response.data?.success && response.data?.data) {
        setData(response.data.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load dashboard metrics."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
