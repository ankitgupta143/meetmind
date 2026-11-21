"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import api, { refreshSession } from "@/lib/api";

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("processing"); // "processing" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function completeOAuth() {
      const error = searchParams.get("error");
      const statusParam = searchParams.get("status");

      if (error) {
        setStatus("error");
        setErrorMessage(error);
        toast.error(`Authentication failed: ${error}`);
        setTimeout(() => router.replace("/login"), 3000);
        return;
      }

      if (statusParam === "success" || !error) {
        try {
          // Exchange the newly placed HttpOnly refreshToken cookie for an in-memory accessToken
          await refreshSession(false);
          await api.get("/users/me");

          setStatus("success");
          toast.success("Signed in successfully with your account!");
          router.replace("/dashboard");
        } catch (err) {
          console.error("OAuth session completion error:", err);
          setStatus("error");
          setErrorMessage(err.response?.data?.message || "Failed to establish session.");
          toast.error("Authentication session failed. Please log in again.");
          setTimeout(() => router.replace("/login"), 2500);
        }
      }
    }

    completeOAuth();
  }, [router, searchParams]);

  return (
    <div className="w-full max-w-sm text-center">
      {status === "processing" && (
        <div className="flex flex-col items-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 shadow-xl">
            <Loader2 className="size-6 animate-spin" />
          </span>
          <h1 className="mt-5 text-xl font-bold text-white">Completing sign-in...</h1>
          <p className="mt-2 text-xs text-slate-400">
            Securely syncing your credentials and workspace permissions.
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shadow-xl">
            <CheckCircle2 className="size-6" />
          </span>
          <h1 className="mt-5 text-xl font-bold text-white">Sign-in successful!</h1>
          <p className="mt-2 text-xs text-slate-400">
            Redirecting to your MeetMind dashboard...
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 shadow-xl">
            <AlertCircle className="size-6" />
          </span>
          <h1 className="mt-5 text-xl font-bold text-white">Authentication Failed</h1>
          <p className="mt-2 text-xs text-slate-400">
            {errorMessage || "Unable to complete social sign-in. Returning to login..."}
          </p>
        </div>
      )}
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <section className="flex items-center justify-center p-6 sm:p-12">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <Loader2 className="size-6 animate-spin text-indigo-400 mb-2" />
            <p className="text-xs">Validating authentication provider...</p>
          </div>
        }
      >
        <OAuthCallbackContent />
      </Suspense>
    </section>
  );
}
