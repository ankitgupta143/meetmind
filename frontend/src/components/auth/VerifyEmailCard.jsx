"use client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";
export default function VerifyEmailCard() {
  const [resent, setResent] = useState(false);
  return (
    <div className="w-full max-w-md text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-indigo-100 text-indigo-600">
        <MailCheck className="size-8" />
      </span>
      <p className="mt-7 text-sm font-semibold text-indigo-600">
        ONE LAST STEP
      </p>
      <h1 className="mt-2 text-3xl font-bold">Check your inbox</h1>
      <p className="mt-3 leading-7 text-zinc-500">
        We&apos;ve sent a verification link to your email. Click it to activate
        your MeetMind account.
      </p>
      <button
        onClick={() => {
          setResent(true);
          toast.success("Verification email resent.");
        }}
        className="mt-7 h-11 w-full rounded-xl bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-700"
      >
        {resent ? "Email Resent" : "Resend Email"}
      </button>
      <Link
        href="/onboarding"
        className="mt-3 block text-sm font-semibold text-indigo-600"
      >
        I&apos;ve verified my email — continue
      </Link>
      <Link
        href="/login"
        className="mt-5 block text-sm font-semibold text-zinc-500"
      >
        Back to sign in
      </Link>
    </div>
  );
}
