"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { validateEmail, validatePassword } from "@/lib/validation";
import PasswordInput from "./PasswordInput";
import AuthDivider from "./AuthDivider";
import OAuthButtons from "./OAuthButtons";
import { Sparkles, ArrowRight } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const router = useRouter();

  const validate = () => {
    const next = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(next);
    return !next.email && !next.password;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const result = await login(email, password);
      toast.success(result.message || "Welcome back to MeetMind!");

      let redirectPath = "/dashboard";
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect");
        if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
          redirectPath = redirect;
        }
      }
      router.push(redirectPath);
    } catch (error) {
      toast.error(error.message || "Failed to sign in. Please check credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (hasError) =>
    `h-10 w-full rounded-xl border px-3.5 text-xs text-white placeholder-slate-500 outline-none transition disabled:opacity-50 ${
      hasError
        ? "border-rose-500 bg-slate-900 focus:ring-2 focus:ring-rose-500/20"
        : "border-white/[0.08] bg-slate-900 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
    }`;

  return (
    <div className="w-full max-w-sm">
      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300">
        <Sparkles size={12} className="text-cyan-400" />
        <span>AUTHENTICATION</span>
      </div>

      <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
        Sign in to MeetMind
      </h1>
      <p className="mt-1 text-xs text-slate-400">
        Enter your credentials to access your meeting intelligence.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-300">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e?.target ? e.target.value : e)}
            placeholder="you@company.com"
            className={fieldClass(errors.email)}
            disabled={submitting}
          />
          {errors.email && (
            <p className="mt-1 text-[11px] text-rose-400">{errors.email}</p>
          )}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Forgot?
            </Link>
          </div>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e?.target ? e.target.value : e)}
            error={errors.password}
            disabled={submitting}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <span>{submitting ? "Signing in..." : "Sign in to Workspace"}</span>
          <ArrowRight size={14} />
        </button>
      </form>

      <div className="mt-6">
        <AuthDivider />
        <div className="mt-4">
          <OAuthButtons />
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-indigo-400 hover:text-indigo-300"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}
