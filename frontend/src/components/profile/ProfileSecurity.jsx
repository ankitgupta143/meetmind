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
    description: "Update your master password regularly.",
    icon: KeyRound,
  },
  {
    title: "Two-factor authentication",
    description: "Hardware token or authenticator app protection.",
    icon: ShieldCheck,
  },
  {
    title: "Active Sessions",
    description: "Review devices currently connected to MeetMind.",
    icon: Laptop,
  },
];

const ProfileSecurity = ({ onAction }) => (
  <section className="rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-6 shadow-xl backdrop-blur-2xl">
    <h2 className="text-base font-bold text-white">
      Security & Authentication
    </h2>
    <p className="mt-0.5 text-xs text-slate-400">
      Manage multi-factor access and protect workspace data.
    </p>
    <div className="mt-4 divide-y divide-white/[0.06]">
      {options.map(({ title, description, icon: Icon }) => (
        <button
          onClick={() => onAction(title)}
          key={title}
          className="flex w-full items-center gap-3 py-3.5 text-left transition hover:bg-white/[0.02] cursor-pointer first:pt-0"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <Icon className="size-4" />
          </span>
          <span className="flex-1">
            <span className="block text-xs font-bold text-white">{title}</span>
            <span className="mt-0.5 block text-[11px] text-slate-400">
              {description}
            </span>
          </span>
          <ChevronRight className="size-4 text-slate-500" />
        </button>
      ))}
    </div>
    <button
      onClick={() => onAction("Delete account")}
      className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition cursor-pointer"
    >
      <Trash2 className="size-3.5" />
      <span>Delete Account Data</span>
    </button>
  </section>
);

export default ProfileSecurity;
