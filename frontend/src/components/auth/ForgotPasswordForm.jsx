"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Mail, Sparkles } from "lucide-react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    setSent(true);
    toast.success("Password reset email dispatched.");
  };

  if (sent) {
    return (
      <div className="w-full max-w-sm text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 shadow-xl">
          <Mail className="size-6" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-white">Check your inbox</h1>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          We sent a password reset link to <strong className="text-white">{email}</strong>.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
        >
          Use a different email address
        </button>
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
        <span>PASSWORD RECOVERY</span>
      </div>

      <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
        Forgot password?
      </h1>
      <p className="mt-1 text-xs text-slate-400">
        Enter your verified email and we&apos;ll send you a recovery link.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-300">
            Email address
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            className="h-10 w-full rounded-xl border border-white/[0.08] bg-slate-900 px-3.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <button
          type="submit"
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40 active:scale-95 cursor-pointer"
        >
          <span>Send Recovery Link</span>
        </button>
      </form>

      <Link
        href="/login"
        className="mt-6 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
      >
        <ArrowLeft className="size-3.5" /> Back to sign in
      </Link>
    </div>
  );
}
