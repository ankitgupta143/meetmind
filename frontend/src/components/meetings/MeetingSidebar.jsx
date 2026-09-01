"use client";

import {
  BrainCircuit,
  FileText,
  CheckSquare,
  Target,
  BarChart3,
  Bot,
} from "lucide-react";

const menuItems = [
  {
    id: "summary",
    title: "AI Summary",
    subtitle: "AI-generated overview",
    icon: BrainCircuit,
  },
  {
    id: "transcript",
    title: "Transcript",
    subtitle: "Full conversation",
    icon: FileText,
    badge: "326",
  },
  {
    id: "actions",
    title: "Action Items",
    subtitle: "Tasks extracted",
    icon: CheckSquare,
    badge: "8",
  },
  {
    id: "decisions",
    title: "Decisions",
    subtitle: "Important decisions",
    icon: Target,
    badge: "5",
  },
  {
    id: "analytics",
    title: "Analytics",
    subtitle: "Insights & metrics",
    icon: BarChart3,
  },
  {
    id: "assistant",
    title: "AI Assistant",
    subtitle: "Ask about this meeting",
    icon: Bot,
  },
];

export default function MeetingSidebar({
  activeTab,
  setActiveTab,
}) {
  return (
    <aside className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Meeting Workspace
        </h3>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.title}
              onClick={() => setActiveTab(item.id)}
              className={`group flex w-full items-center justify-between rounded-2xl p-4 text-left transition-all duration-200 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "hover:bg-zinc-100 text-zinc-700"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 transition-colors ${
                    isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-700"
                  }`}
                >
                  <Icon size={18} />
                </div>

                <div>
                  <p
                    className={`font-semibold ${
                      isActive ? "text-white" : "text-zinc-900"
                    }`}
                  >
                    {item.title}
                  </p>

                  <p
                    className={`mt-0.5 text-xs ${
                      isActive
                        ? "text-indigo-100"
                        : "text-zinc-500"
                    }`}
                  >
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200"
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