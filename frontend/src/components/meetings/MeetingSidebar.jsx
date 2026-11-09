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
    <aside className="h-fit rounded-2xl border border-border bg-card p-3 shadow-xs">
      <div className="mb-4 flex items-center justify-between px-2 pt-1">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace
          </h3>
        </div>
        <span className="rounded-full border border-border bg-surface-raised px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
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
              className={`relative group flex w-full items-center justify-between rounded-xl p-3 text-left transition-colors duration-200 cursor-pointer ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="meetingWorkspaceActiveTab"
                  className="absolute inset-0 rounded-xl border border-indigo-500/20 bg-indigo-500/10 dark:border-indigo-400/25 dark:bg-indigo-400/10 shadow-xs"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}

              <div className="relative z-10 flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                      : "bg-surface-raised text-muted-foreground group-hover:bg-surface-hover group-hover:text-foreground group-hover:scale-105"
                  }`}
                >
                  <Icon size={17} />
                </div>

                <div>
                  <p
                    className={`text-sm tracking-tight ${
                      isActive
                        ? "font-bold text-foreground"
                        : "font-semibold text-foreground/80 group-hover:text-foreground"
                    }`}
                  >
                    {item.title}
                  </p>

                  <p
                    className={`mt-0.5 text-xs ${
                      isActive
                        ? "text-primary dark:text-indigo-300 font-medium"
                        : "text-muted-foreground"
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
                      ? "bg-primary/15 text-primary dark:bg-white/20 dark:text-white"
                      : item.badge === "AI"
                      ? "bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:bg-gradient-to-r dark:from-cyan-500/20 dark:to-indigo-500/20 dark:border-cyan-500/30 dark:text-cyan-300"
                      : "bg-surface-raised border border-border/60 text-muted-foreground group-hover:text-foreground"
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
