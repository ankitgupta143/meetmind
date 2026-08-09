"use client";
import {
  ChevronRight,
  KeyRound,
  Laptop,
  ShieldCheck,
  Trash2,
} from "lucide-react";
const options = [
  {
    title: "Change Password",
    description: "Update your password regularly to keep your account secure.",
    icon: KeyRound,
  },
  {
    title: "Two-factor authentication",
    description: "Add an extra layer of protection to your account.",
    icon: ShieldCheck,
  },
  {
    title: "Active Sessions",
    description: "Review devices that are currently signed in.",
    icon: Laptop,
  },
];
const ProfileSecurity = ({ onAction }) => (
  <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
    <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
      Security
    </h2>
    <p className="mt-1 text-sm text-zinc-500">
      Manage access and protect your account.
    </p>
    <div className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
      {options.map(({ title, description, icon: Icon }) => (
        <button
          onClick={() => onAction(title)}
          key={title}
          className="flex w-full items-center gap-3 py-4 text-left first:pt-0"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            <Icon className="size-4" />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-semibold">{title}</span>
            <span className="mt-0.5 block text-xs text-zinc-500">
              {description}
            </span>
          </span>
          <ChevronRight className="size-4 text-zinc-400" />
        </button>
      ))}
    </div>
    <button
      onClick={() => onAction("Delete account")}
      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
    >
      <Trash2 className="size-4" />
      Delete Account
    </button>
  </section>
);
export default ProfileSecurity;
