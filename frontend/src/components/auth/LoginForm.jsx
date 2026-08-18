"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { validateEmail, validatePassword } from "@/lib/validation";
import PasswordInput from "./PasswordInput";
import RememberMe from "./RememberMe";
import AuthDivider from "./AuthDivider";
import OAuthButtons from "./OAuthButtons";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
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
      toast.success(result.message || "Welcome back!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (hasError) =>
    `h-11 w-full rounded-xl border px-3 text-sm outline-none transition focus:ring-4 disabled:opacity-50 ${
      hasError
        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
        : "border-zinc-200 focus:border-indigo-400 focus:ring-indigo-100"
    }`;

  return (
    <div className="w-full max-w-md">
      <p className="text-sm font-semibold text-indigo-600">WELCOME BACK</p>
      <h1 className="mt-2 text-3xl font-bold">Sign in to MeetMind</h1>
      <p className="mt-2 text-sm text-zinc-500">Continue where your meetings left off.</p>

      <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
        {/* Email */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-zinc-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
            }}
            placeholder="you@company.com"
            disabled={submitting}
            className={fieldClass(errors.email)}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <PasswordInput
            value={password}
            onChange={(val) => {
              setPassword(val);
              if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
            }}
            disabled={submitting}
            hasError={!!errors.password}
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <RememberMe checked={remember} onChange={setRemember} />
          <Link href="/forgot-password" className="text-sm font-semibold text-indigo-600">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="h-11 w-full rounded-xl bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <AuthDivider />
      <OAuthButtons />

      <p className="mt-7 text-center text-sm text-zinc-500">
        New to MeetMind?{" "}
        <Link href="/register" className="font-semibold text-indigo-600">
          Create an account
        </Link>
      </p>
    </div>
  );
}
