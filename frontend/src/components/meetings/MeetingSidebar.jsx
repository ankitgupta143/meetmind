"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  FileText,
  CheckSquare,
  Target,
  BarChart3,
  Bot,
  Sparkles,
} from "lucide-react";

export default function MeetingSidebar({
  activeTab,
  setActiveTab,
  insights,
}) {
  const actionCount = insights?.actionItems?.length;
  const decisionCount = insights?.decisions?.length;
  const keyTakeawaysCount = insights?.summary?.keyTakeaways?.length;

  const menuItems = [
    {
      id: "summary",
      title: "AI Summary",
      subtitle: "AI-generated overview",
      icon: BrainCircuit,
      badge: keyTakeawaysCount ? `${keyTakeawaysCount}` : null,
      accent: "from-indigo-500 to-violet-500",
    },
    {
      id: "transcript",
      title: "Transcript",
      subtitle: "Full conversation",
      icon: FileText,
      accent: "from-blue-500 to-cyan-500",
    },
    {
      id: "actions",
      title: "Action Items",
      subtitle: "Tasks & assignments",
      icon: CheckSquare,
      badge: actionCount !== undefined ? `${actionCount}` : "8",
      accent: "from-emerald-500 to-teal-500",
    },
    {
      id: "decisions",
      title: "Decisions",
      subtitle: "Key takeaways",
      icon: Target,
      badge: decisionCount !== undefined ? `${decisionCount}` : "5",
      accent: "from-violet-500 to-purple-500",
    },
    {
      id: "analytics",
      title: "Analytics",
      subtitle: "Insights & metrics",
      icon: BarChart3,
      accent: "from-cyan-500 to-blue-500",
    },
    {
      id: "assistant",
      title: "AI Assistant",
      subtitle: "Ask about this meeting",
      icon: Bot,
      badge: "AI",
      accent: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <aside className="h-fit rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
      <div className="mb-4 flex items-center justify-between px-2 pt-1">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Workspace
          </h3>
        </div>
        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-slate-400">
          6 Modules
        </span>
      </div>

      <nav className="space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative group flex w-full items-center justify-between rounded-2xl p-3.5 text-left transition-all duration-200 ${
                isActive
                  ? "text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="meetingWorkspaceActiveTab"
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600/90 to-violet-600 shadow-[0_8px_25px_-5px_rgba(99,102,241,0.5)] border border-indigo-400/30"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}

              <div className="relative z-10 flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-white/20 text-white shadow-sm"
                      : "bg-white/[0.05] text-slate-400 group-hover:bg-white/[0.09] group-hover:text-slate-200 group-hover:scale-105"
                  }`}
                >
                  <Icon size={17} />
                </div>

                <div>
                  <p
                    className={`text-sm font-semibold tracking-tight ${
                      isActive ? "text-white" : "text-slate-200 group-hover:text-white"
                    }`}
                  >
                    {item.title}
                  </p>

                  <p
                    className={`mt-0.5 text-xs ${
                      isActive
                        ? "text-indigo-100/90"
                        : "text-slate-400"
                    }`}
                  >
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`relative z-10 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide transition-colors ${
                    isActive
                      ? "bg-white/25 text-white shadow-sm"
                      : item.badge === "AI"
                      ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-300"
                      : "bg-white/[0.06] text-slate-400 group-hover:bg-white/10 group-hover:text-slate-300"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}