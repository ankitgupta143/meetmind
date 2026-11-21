"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import PasswordInput from "./PasswordInput";
import PasswordStrength from "./PasswordStrength";
import { Sparkles, ArrowLeft, AlertCircle, Loader2, KeyRound } from "lucide-react";
import { resetPasswordApi } from "./services/auth.service";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const submit = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("Missing password reset token. Please request a new link.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await resetPasswordApi({ token, password });
      toast.success(result?.message || "Password updated successfully. Please sign in.");
      router.push("/login");
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Failed to reset password. The link may have expired or is invalid.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If no token is provided in the query string
  if (!token) {
    return (
      <div className="w-full max-w-sm text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 shadow-xl">
          <AlertCircle className="size-6" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-white">Invalid Reset Link</h1>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          This password reset link is invalid or has expired. Please request a new link to regain access to your account.
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40"
        >
          <KeyRound className="size-3.5" />
          <span>Request New Reset Link</span>
        </Link>
        <Link
          href="/login"
          className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="size-3.5" /> Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300">
        <Sparkles size={12} className="text-cyan-400" />
        <span>RECOVERY</span>
      </div>

      <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
        Set new password
      </h1>
      <p className="mt-1 text-xs text-slate-400">
        Choose a strong, unique password to secure your account.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <PasswordInput
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e?.target ? e.target.value : e)}
            placeholder="Enter new password (min. 8 characters)"
          />
          <PasswordStrength password={password} />
        </div>

        <PasswordInput
          label="Confirm New Password"
          value={confirm}
          onChange={(e) => setConfirm(e?.target ? e.target.value : e)}
          placeholder="Repeat new password"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Updating password...</span>
            </>
          ) : (
            <span>Reset Password</span>
          )}
        </button>
      </form>

      <Link
        href="/login"
        className="mt-6 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
      >
        <ArrowLeft size={14} />
        <span>Back to sign in</span>
      </Link>
    </div>
  );
}
