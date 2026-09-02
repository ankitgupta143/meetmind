"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PasswordInput from "./PasswordInput";
import PasswordStrength from "./PasswordStrength";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const router = useRouter();

  const submit = (event) => {
    event.preventDefault();
    if (password !== confirm) return toast.error("Passwords do not match.");
    toast.success("Password updated successfully. Please sign in.");
    router.push("/login");
  };

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
            placeholder="Enter new password"
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
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40 active:scale-95 cursor-pointer"
        >
          <span>Reset Password</span>
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
