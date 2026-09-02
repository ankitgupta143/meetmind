import { Bot, FileText, Mail, Pin, Star, Sparkles } from "lucide-react";
import { workspaceSections } from "./data/workspaceData";
import WorkspaceCard from "./cards/WorkspaceCard";

const icons = { star: Star, pin: Pin, bot: Bot, file: FileText, mail: Mail };

export default function WorkspaceGrid() {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          Saved Collections
          <Sparkles size={16} className="text-cyan-400" />
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Curated meetings, pinned discussions, generated reports and drafts.
        </p>
      </div>

      <div className="space-y-8">
        {workspaceSections.map((section) => {
          const Icon = icons[section.icon] || Pin;
          return (
            <div key={section.title}>
              <div className="mb-3.5 flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                  <Icon size={14} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    {section.title}
                  </h3>
                  <p className="text-[11px] text-slate-400">{section.description}</p>
                </div>
              </div>

              <div className="grid gap-3.5 md:grid-cols-2">
                {section.items.map((item) => (
                  <WorkspaceCard key={item.title} item={item} Icon={Icon} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
