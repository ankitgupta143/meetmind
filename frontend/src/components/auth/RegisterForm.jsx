"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import PasswordInput from "./PasswordInput";
import PasswordStrength from "./PasswordStrength";
import AuthDivider from "./AuthDivider";
import OAuthButtons from "./OAuthButtons";

export default function RegisterForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
    terms: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirm) {
      return toast.error("Passwords do not match.");
    }
    if (!form.terms) {
      return toast.error("Please accept the terms to continue.");
    }

    setSubmitting(true);
    try {
      const result = await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      toast.success(result?.message || "Account created successfully! Check your inbox.");
      router.push("/verify-email");
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <p className="text-sm font-semibold text-indigo-600">GET STARTED FREE</p>
      <h1 className="mt-2 text-3xl font-bold">Create your account</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Turn your next meeting into useful knowledge.
      </p>
      <form onSubmit={submit} className="mt-7 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">First Name</span>
          <input
            required
            disabled={submitting}
            value={form.firstName}
            onChange={(event) => update("firstName", event.target.value)}
            placeholder="Ankit"
            className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:opacity-50"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">Last Name</span>
          <input
            required
            disabled={submitting}
            value={form.lastName}
            onChange={(event) => update("lastName", event.target.value)}
            placeholder="Gupta"
            className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:opacity-50"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">Email</span>
          <input
            required
            disabled={submitting}
            type="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder="you@company.com"
            className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:opacity-50"
          />
        </label>
        <div>
          <PasswordInput
            disabled={submitting}
            value={form.password}
            onChange={(value) => update("password", value)}
          />
          <PasswordStrength password={form.password} />
        </div>
        <PasswordInput
          disabled={submitting}
          label="Confirm Password"
          value={form.confirm}
          onChange={(value) => update("confirm", value)}
          placeholder="Confirm your password"
        />
        <label className="flex items-start gap-2 text-sm text-zinc-600">
          <input
            type="checkbox"
            disabled={submitting}
            checked={form.terms}
            onChange={(event) => update("terms", event.target.checked)}
            className="mt-0.5 size-4 accent-indigo-600"
          />
          I agree to the{" "}
          <a href="#terms" className="font-semibold text-indigo-600">
            Terms of Service
          </a>{" "}
          and Privacy Policy.
        </label>
        <button 
          type="submit"
          disabled={submitting}
          className="h-11 w-full rounded-xl bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>
      <AuthDivider />
      <OAuthButtons />
      <p className="mt-7 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-indigo-600">
          Sign in
        </Link>
      </p>
    </div>
  );
}
