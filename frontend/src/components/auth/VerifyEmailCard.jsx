"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  MailCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  RotateCw,
} from "lucide-react";
import { verifyEmailApi, resendVerificationApi } from "./services/auth.service";

export default function VerifyEmailCard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const emailParam = searchParams.get("email") || "";

  // Token verification states: "idle" | "verifying" | "success" | "error"
  const [verifyStatus, setVerifyStatus] = useState(token ? "verifying" : "idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Resend state & cooldown
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [emailInput, setEmailInput] = useState(emailParam);

  // Auto-verify when token is detected in URL
  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    async function verify() {
      try {
        const result = await verifyEmailApi(token);
        if (isMounted) {
          setVerifyStatus("success");
          toast.success(result?.message || "Email verified successfully!");
        }
      } catch (err) {
        if (isMounted) {
          setVerifyStatus("error");
          const msg =
            err.response?.data?.message ||
            "Verification link is invalid or has expired.";
          setErrorMessage(msg);
          toast.error(msg);
        }
      }
    }

    verify();
    return () => {
      isMounted = false;
    };
  }, [token]);

  // Handle cooldown timer for Resend button
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleResend = async (e) => {
    e?.preventDefault();
    const targetEmail = emailInput || emailParam;
    if (!targetEmail) {
      toast.error("Please provide your email address to receive a link.");
      return;
    }

    setResending(true);
    try {
      const res = await resendVerificationApi(targetEmail);
      toast.success(res?.message || "Verification email dispatched!");
      setCooldown(60); // 60s cooldown
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to resend verification link."
      );
    } finally {
      setResending(false);
    }
  };

  // 1. Verifying State (when token is in URL and API is in-flight)
  if (verifyStatus === "verifying") {
    return (
      <div className="w-full max-w-sm text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 shadow-xl">
          <Loader2 className="size-6 animate-spin" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-white">
          Activating account...
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          Confirming your email address and preparing your workspace.
        </p>
      </div>
    );
  }

  // 2. Verified Success State
  if (verifyStatus === "success") {
    return (
      <div className="w-full max-w-sm text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shadow-xl">
          <CheckCircle2 className="size-6" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-white">
          Email Verified!
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          Your account is fully activated. You can now access your meeting intelligence workspace.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40 active:scale-95 cursor-pointer"
        >
          <span>Sign In to Workspace</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    );
  }

  // 3. Verification Error State (Invalid or Expired Token)
  if (verifyStatus === "error") {
    return (
      <div className="w-full max-w-sm text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 shadow-xl">
          <AlertCircle className="size-6" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-white">
          Verification Failed
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          {errorMessage || "This verification link is invalid or has expired."}
        </p>

        <form onSubmit={handleResend} className="mt-6 space-y-3">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter your email address"
            required
            className="h-10 w-full rounded-xl border border-white/[0.08] bg-slate-900 px-3.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
          />

          <button
            type="submit"
            disabled={resending || cooldown > 0}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {resending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <RotateCw className="size-3.5" />
            )}
            <span>
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Send New Verification Link"}
            </span>
          </button>
        </form>

        <Link
          href="/login"
          className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="size-3.5" /> Back to sign in
        </Link>
      </div>
    );
  }

  // 4. Default Inbox Notice State (when landing immediately after registration)
  return (
    <div className="w-full max-w-sm text-center">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 shadow-xl">
        <MailCheck className="size-6" />
      </span>

      <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300">
        <span>ONE LAST STEP</span>
      </div>

      <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
        Check your inbox
      </h1>

      <p className="mt-2 text-xs leading-relaxed text-slate-400">
        We sent a verification link to{" "}
        <strong className="text-white">{emailParam || "your email address"}</strong>.
        Click the link to activate your MeetMind account.
      </p>

      <div className="mt-6 space-y-3">
        <button
          onClick={handleResend}
          disabled={resending || cooldown > 0}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {resending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <RotateCw className="size-3.5" />
          )}
          <span>
            {cooldown > 0 ? `Resend available in ${cooldown}s` : "Resend Verification Email"}
          </span>
        </button>

        <Link
          href="/login"
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-slate-900/60 text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-white transition"
        >
          <span>I&apos;ve verified my email — continue</span>
        </Link>
      </div>

      <Link
        href="/login"
        className="mt-5 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
      >
        <ArrowLeft className="size-3.5" /> Back to sign in
      </Link>
    </div>
  );
}
