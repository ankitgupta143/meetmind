"use client";

import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

export default function PasswordInput({
  label,
  value = "",
  onChange,
  placeholder = "••••••••",
  error,
  disabled,
  hasError,
}) {
  const [visible, setVisible] = useState(false);

  const handleChange = (event) => {
    if (typeof onChange === "function") {
      onChange(event);
    }
  };

  const isError = Boolean(error || hasError);

  return (
    <div className="block">
      {label && (
        <span className="mb-1.5 block text-xs font-semibold text-slate-300">
          {label}
        </span>
      )}
      <div className="relative">
        <LockKeyhole className="absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
        <input
          required
          type={visible ? "text" : "password"}
          value={typeof value === "string" ? value : ""}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`h-10 w-full rounded-xl border pl-10 pr-10 text-xs text-white placeholder-slate-500 outline-none transition disabled:opacity-50 ${
            isError
              ? "border-rose-500 bg-slate-900 focus:ring-2 focus:ring-rose-500/20"
              : "border-white/[0.08] bg-slate-900 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
          }`}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
        >
          {visible ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
        </button>
      </div>
      {error && typeof error === "string" && (
        <p className="mt-1 text-[11px] text-rose-400">{error}</p>
      )}
    </div>
  );
}
