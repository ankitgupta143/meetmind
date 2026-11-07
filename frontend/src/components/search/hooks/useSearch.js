"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export function useSearch({ query, filter = "all", onSearchSuccess }) {
  const { isAuthenticated } = useAuth();
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const trimmed = (query || "").trim();

  useEffect(() => {
    if (!trimmed || !isAuthenticated) {
      return;
    }

    let ignore = false;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get("/search", {
          params: {
            q: trimmed,
            filter,
          },
        });

        if (!ignore) {
          if (response.data?.success && response.data?.data) {
            const fetched = response.data.data.results || [];
            const fetchedTotal = response.data.data.total || 0;
            setResults(fetched);
            setTotal(fetchedTotal);
            if (fetched.length > 0 && typeof onSearchSuccess === "function") {
              onSearchSuccess(trimmed);
            }
          } else {
            setResults([]);
            setTotal(0);
          }
        }
      } catch (err) {
        if (!ignore) {
          console.error("[Search] Query error:", err);
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to perform search."
          );
          setResults([]);
          setTotal(0);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }, 280);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [trimmed, filter, isAuthenticated, onSearchSuccess]);

  const isEmpty = !trimmed || !isAuthenticated;

  return {
    results: isEmpty ? [] : results,
    total: isEmpty ? 0 : total,
    loading: isEmpty ? false : loading,
    error: isEmpty ? null : error,
  };
}
