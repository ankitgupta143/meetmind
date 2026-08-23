"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api, { setAccessToken, refreshSession } from "@/lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check user session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        await refreshSession();
        const response = await api.get("/users/me");
        if (response.data?.success) {
          setUser(response.data.data.user);
        }
      } catch (error) {
        setUser(null);
        setAccessToken("");
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  // Listen for global logout events triggered by interceptor auth failures
  useEffect(() => {
    const handleGlobalLogout = () => {
      setUser(null);
      setAccessToken("");
      router.push("/login");
    };

    if (typeof window !== "undefined") {
      window.addEventListener("auth:logout", handleGlobalLogout);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("auth:logout", handleGlobalLogout);
      }
    };
  }, [router]);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      
      if (response.data?.success) {
        const { accessToken, user: userData } = response.data.data;
        setAccessToken(accessToken);
        setUser(userData);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please check your credentials.";
      throw new Error(message);
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed.";
      throw new Error(message);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout request to backend failed:", error);
    } finally {
      // Always clear local state even if backend request fails
      setUser(null);
      setAccessToken("");
      router.push("/login");
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
