"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Bell,
  Bot,
  Check,
  ChevronRight,
  CircleHelp,
  Cpu,
  Info,
  KeyRound,
  Laptop,
  Link2,
  Lock,
  Palette,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

const tabs = [
  ["profile", "Profile", UserRound],
  ["appearance", "Appearance", Palette],
  ["notifications", "Notifications", Bell],
  ["ai", "AI Preferences", Bot],
  ["security", "Security", Lock],
  ["integrations", "Integrations", Link2],
  ["about", "About", Info],
];

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${
      checked ? "bg-indigo-600 shadow-lg shadow-indigo-600/30" : "bg-slate-800"
    }`}
  >
    <span
      className={`absolute top-1 size-4 rounded-full bg-white shadow-md transition-all ${
        checked ? "left-6" : "left-1"
      }`}
    />
  </button>
);

const Choice = ({ checked, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2.5 text-xs font-semibold text-slate-200 cursor-pointer"
  >
    <span
      className={`flex size-4 items-center justify-center rounded-full border ${
        checked ? "border-indigo-500 bg-indigo-500/20" : "border-white/20"
      }`}
    >
      {checked && <span className="size-2 rounded-full bg-indigo-500 shadow-sm" />}
    </span>
    {label}
  </button>
);

const SectionHeading = ({ title, description }) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
    {description && (
      <p className="mt-1 text-xs text-slate-400">{description}</p>
    )}
  </div>
);

export default function SettingsPage() {
  const [active, setActive] = useState("appearance");
  const [theme, setTheme] = useState("dark");
  const [accent, setAccent] = useState("purple");
  const [settings, setSettings] = useState({
    animations: true,
    compact: false,
    meeting: true,
    summary: true,
    digest: true,
    mentions: true,
    workspace: true,
    marketing: false,
    inApp: true,
    autoSummary: true,
    actionItems: true,
    decisions: true,
    analytics: true,
  });

  const toggle = (key, value) =>
    setSettings((current) => ({ ...current, [key]: value }));

  const field = (label, children) => (
    <div className="flex items-center justify-between gap-6 py-3.5">
      <span className="text-xs font-semibold text-slate-200">{label}</span>
      {children}
    </div>
  );

  const content = {
    profile: (
      <>
        <SectionHeading
          title="Account Profile"
          description="Manage your personal information and preferences."
        />
        <div className="rounded-2xl border border-white/[0.08] bg-slate-900/50 p-5">
          <p className="text-sm font-bold text-white">Ankit Gupta</p>
          <p className="mt-0.5 text-xs text-slate-400">
            Frontend Engineer · ankit@gmail.com
          </p>
          <Link
            href="/profile"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            <span>Manage detailed profile</span>
            <ChevronRight className="size-3.5" />
          </Link>
        </div>
      </>
    ),

    appearance: (
      <>
        <SectionHeading
          title="Appearance & Themes"
          description="Personalize your MeetMind interface aesthetics."
        />
        <div className="space-y-6">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Color Theme
            </p>
            <div className="flex flex-wrap gap-5">
              {["Dark (Default)", "Light", "System"].map((item) => (
                <Choice
                  key={item}
                  label={item}
                  checked={theme === (item.startsWith("Dark") ? "dark" : item.toLowerCase())}
                  onClick={() =>
                    setTheme(item.startsWith("Dark") ? "dark" : item.toLowerCase())
                  }
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Accent Color Aura
            </p>
            <div className="flex flex-wrap gap-2.5">
              {[
                ["purple", "bg-indigo-500", "Cyber Indigo"],
                ["blue", "bg-cyan-500", "Electric Cyan"],
                ["emerald", "bg-emerald-500", "Emerald Glow"],
              ].map(([key, color, label]) => (
                <button
                  key={key}
                  onClick={() => setAccent(key)}
                  className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition cursor-pointer ${
                    accent === key
                      ? "border-indigo-500/50 bg-indigo-500/15 text-white"
                      : "border-white/[0.08] bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
                  }`}
                >
                  <span className={`size-2.5 rounded-full ${color}`} />
                  {label}
                  {accent === key && <Check className="size-3.5 text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-slate-900/40 px-5">
            {field(
              "Enable silky 60fps animations",
              <Toggle
                checked={settings.animations}
                onChange={(value) => toggle("animations", value)}
              />
            )}
            {field(
              "Compact workspace grid",
              <Toggle
                checked={settings.compact}
                onChange={(value) => toggle("compact", value)}
              />
            )}
          </div>
        </div>
      </>
    ),

    notifications: (
      <>
        <SectionHeading
          title="Notification Preferences"
          description="Choose how and when MeetMind keeps you updated."
        />
        <div className="space-y-6">
          {[
            [
              "Email Notifications",
              [
                ["Meeting Completed & Transcribed", "meeting"],
                ["AI Executive Summary Ready", "summary"],
                ["Weekly Intelligence Digest", "digest"],
              ],
            ],
            [
              "Push Alerts",
              [
                ["Speaker Mentions & Assigned Tasks", "mentions"],
                ["Workspace Activity Updates", "workspace"],
              ],
            ],
          ].map(([title, items]) => (
            <div key={title}>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                {title}
              </p>
              <div className="divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-slate-900/40 px-5">
                {items.map(([label, key]) =>
                  field(
                    label,
                    <Toggle
                      key={key}
                      checked={settings[key]}
                      onChange={(value) => toggle(key, value)}
                    />
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </>
    ),

    ai: (
      <>
        <SectionHeading
          title="AI Synthesis Engine"
          description="Set defaults for transcription, diarization and automated summary generation."
        />
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Primary LLM Provider
            </label>
            <select className="mt-2 h-10 w-full rounded-xl border border-white/[0.08] bg-slate-900 px-3 text-xs text-white outline-none focus:border-indigo-500">
              <option className="bg-slate-900">Gemini 1.5 Flash (Ultra Fast)</option>
              <option className="bg-slate-900">Gemini 1.5 Pro (Deep Analysis)</option>
            </select>
          </div>

          <div>
            <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              Executive Summary Style
            </p>
            <div className="flex gap-4">
              <Choice label="Bullet Points" checked={false} onClick={() => {}} />
              <Choice label="Balanced Synthesis" checked onClick={() => {}} />
              <Choice label="Comprehensive Dossier" checked={false} onClick={() => {}} />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Automated Synthesis Triggers
            </p>
            <div className="divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-slate-900/40 px-5">
              {[
                ["Auto-Generate Summary", "autoSummary"],
                ["Extract Action Items & Deadlines", "actionItems"],
                ["Identify Key Strategic Decisions", "decisions"],
                ["Compute Tonal & Topic Analytics", "analytics"],
              ].map(([label, key]) =>
                field(
                  label,
                  <Toggle
                    key={key}
                    checked={settings[key]}
                    onChange={(value) => toggle(key, value)}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </>
    ),

    security: (
      <>
        <SectionHeading
          title="Security & Access"
          description="Manage encryption, active sessions, and access keys."
        />
        <div className="divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-slate-900/40 px-5">
          {[
            ["Change Password", "Update your secret password.", KeyRound],
            ["Two-factor Authentication", "Hardware / Authenticator app.", ShieldCheck],
            ["Active Sessions", "Review current signed-in devices.", Laptop],
            ["Storage Encryption", "End-to-end media storage encryption.", Cpu],
          ].map(([title, description, Icon]) => (
            <button
              key={title}
              onClick={() => toast.info(`${title} is managed via Auth0/OAuth.`)}
              className="flex w-full items-center gap-3.5 py-4 text-left transition hover:bg-white/[0.02] cursor-pointer"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                <Icon size={16} />
              </div>
              <span className="flex-1">
                <span className="block text-xs font-bold text-white">{title}</span>
                <span className="block text-[11px] text-slate-400">{description}</span>
              </span>
              <ChevronRight className="size-4 text-slate-500" />
            </button>
          ))}
        </div>
      </>
    ),

    integrations: (
      <>
        <SectionHeading
          title="Connected Services"
          description="Check streaming providers and calendar integrations."
        />
        <div className="divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-slate-900/40 px-5">
          {[
            ["Google Meet", true],
            ["Slack Workspace", true],
            ["Notion AI Database", false],
            ["Zoom Video", false],
          ].map(([service, connected]) => (
            <div key={service} className="flex items-center justify-between py-3.5">
              <span className="text-xs font-semibold text-white">{service}</span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
                  connected
                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                    : "bg-white/[0.04] border-white/[0.08] text-slate-400"
                }`}
              >
                {connected ? "✓ Connected" : "Not Linked"}
              </span>
            </div>
          ))}
        </div>
        <Link
          href="/integrations"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
        >
          <span>Manage Integrations</span>
          <ChevronRight className="size-3.5" />
        </Link>
      </>
    ),

    about: (
      <>
        <SectionHeading
          title="About MeetMind"
          description="Application build environment and system diagnostic specs."
        />
        <div className="divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-slate-900/40 px-5">
          {[
            ["App Release", "v2.4.0-obsidian"],
            ["Frontend Framework", "Next.js (Turbopack)"],
            ["Styling System", "Neo-Glass Obsidian CSS"],
            ["Motion Engine", "Framer Motion"],
            ["AI Engine", "Gemini 1.5 Flash Diarization"],
          ].map(([key, value]) => (
            <div key={key} className="flex justify-between py-3 text-xs">
              <span className="text-slate-400">{key}</span>
              <span className="font-mono font-bold text-slate-200">{value}</span>
            </div>
          ))}
        </div>
      </>
    ),
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
          <Sparkles size={14} className="text-cyan-400" />
          <span>System Preferences</span>
        </div>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Control your MeetMind experience, AI engine defaults and visual theme.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-3 shadow-xl backdrop-blur-2xl">
          {tabs.map(([id, label, Icon]) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`relative mb-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? "text-white"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="settingsActiveTabPill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-indigo-600/30"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className="relative z-10 size-4" />
                <span className="relative z-10">{label}</span>
              </button>
            );
          })}
        </aside>

        <section className="rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-6 shadow-xl backdrop-blur-2xl">
          {content[active]}
          <button
            onClick={() => toast.success("Settings saved successfully!")}
            className="mt-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40 active:scale-95 cursor-pointer"
          >
            Save Changes
          </button>
        </section>
      </div>
    </div>
  );
}
