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
import { Sparkles, ArrowRight } from "lucide-react";

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
    const rawVal = value?.target ? value.target.value : value;
    setForm((current) => ({ ...current, [key]: rawVal }));
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
    `h-10 w-full rounded-xl border px-3.5 text-xs text-white placeholder-slate-500 outline-none transition disabled:opacity-50 ${
      hasError
        ? "border-rose-500 bg-slate-900 focus:ring-2 focus:ring-rose-500/20"
        : "border-white/[0.08] bg-slate-900 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
    }`;

  return (
    <div className="w-full max-w-sm">
      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300">
        <Sparkles size={12} className="text-cyan-400" />
        <span>START FREE</span>
      </div>

      <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
        Create account
      </h1>
      <p className="mt-1 text-xs text-slate-400">
        Transform meeting recordings into structured workspace intelligence.
      </p>

      <form onSubmit={submit} className="mt-5 space-y-3" noValidate>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">First Name</label>
            <input
              disabled={submitting}
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              placeholder="Ankit"
              className={fieldClass(errors.firstName)}
            />
            {errors.firstName && (
              <p className="mt-0.5 text-[10px] text-rose-400">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">Last Name</label>
            <input
              disabled={submitting}
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              placeholder="Gupta"
              className={fieldClass(errors.lastName)}
            />
            {errors.lastName && (
              <p className="mt-0.5 text-[10px] text-rose-400">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-300">Email Address</label>
          <input
            disabled={submitting}
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@company.com"
            className={fieldClass(errors.email)}
          />
          {errors.email && (
            <p className="mt-0.5 text-[10px] text-rose-400">{errors.email}</p>
          )}
        </div>

        <div>
          <PasswordInput
            disabled={submitting}
            label="Password"
            value={form.password}
            onChange={(val) => update("password", val)}
            error={errors.password}
          />
          <PasswordStrength password={form.password} />
        </div>

        <div>
          <PasswordInput
            disabled={submitting}
            label="Confirm Password"
            value={form.confirm}
            onChange={(val) => update("confirm", val)}
            placeholder="Repeat password"
            error={errors.confirm}
          />
        </div>

        <label className="flex items-start gap-2 text-xs text-slate-400 pt-1">
          <input
            type="checkbox"
            disabled={submitting}
            checked={form.terms}
            onChange={(e) => update("terms", e.target.checked)}
            className="mt-0.5 size-3.5 accent-indigo-600 rounded"
          />
          <span>
            I agree to the{" "}
            <a href="#terms" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Terms
            </a>{" "}
            and Privacy Policy.
          </span>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <span>{submitting ? "Creating Account..." : "Create Free Account"}</span>
          <ArrowRight size={14} />
        </button>
      </form>

      <div className="mt-4">
        <AuthDivider />
        <div className="mt-3">
          <OAuthButtons />
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}
