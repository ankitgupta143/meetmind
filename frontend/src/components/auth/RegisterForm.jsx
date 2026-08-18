"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { validateEmail, validateName, validatePassword } from "@/lib/validation";
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
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const validate = () => {
    const next = {
      firstName: validateName(form.firstName, "First name"),
      lastName: validateName(form.lastName, "Last name"),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirm:
        form.password !== form.confirm ? "Passwords do not match." : null,
    };
    setErrors(next);
    return Object.values(next).every((v) => !v);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    if (!form.terms) return toast.error("Please accept the terms to continue.");

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

  const fieldClass = (hasError) =>
    `h-11 w-full rounded-xl border px-3 text-sm outline-none transition focus:ring-4 disabled:opacity-50 ${
      hasError
        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
        : "border-zinc-200 focus:border-indigo-400 focus:ring-indigo-100"
    }`;

  return (
    <div className="w-full max-w-md">
      <p className="text-sm font-semibold text-indigo-600">GET STARTED FREE</p>
      <h1 className="mt-2 text-3xl font-bold">Create your account</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Turn your next meeting into useful knowledge.
      </p>

      <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
        {/* First Name */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold">First Name</label>
          <input
            disabled={submitting}
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            placeholder="Ankit"
            className={fieldClass(errors.firstName)}
          />
          {errors.firstName && (
            <p className="text-xs text-red-500">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold">Last Name</label>
          <input
            disabled={submitting}
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            placeholder="Gupta"
            className={fieldClass(errors.lastName)}
          />
          {errors.lastName && (
            <p className="text-xs text-red-500">{errors.lastName}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold">Email</label>
          <input
            disabled={submitting}
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@company.com"
            className={fieldClass(errors.email)}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Password + Strength */}
        <div className="space-y-1">
          <PasswordInput
            disabled={submitting}
            value={form.password}
            onChange={(val) => update("password", val)}
            hasError={!!errors.password}
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password}</p>
          )}
          <PasswordStrength password={form.password} />
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <PasswordInput
            disabled={submitting}
            label="Confirm Password"
            value={form.confirm}
            onChange={(val) => update("confirm", val)}
            placeholder="Confirm your password"
            hasError={!!errors.confirm}
          />
          {errors.confirm && (
            <p className="text-xs text-red-500">{errors.confirm}</p>
          )}
        </div>

        {/* Terms */}
        <label className="flex items-start gap-2 text-sm text-zinc-600">
          <input
            type="checkbox"
            disabled={submitting}
            checked={form.terms}
            onChange={(e) => update("terms", e.target.checked)}
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
