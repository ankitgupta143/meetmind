import { Bot, FileText, Mail, Pin, Star } from "lucide-react";
import { workspaceSections } from "./data/workspaceData";
import WorkspaceCard from "./cards/WorkspaceCard";

const icons = { star: Star, pin: Pin, bot: Bot, file: FileText, mail: Mail };

export default function WorkspaceGrid() {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          My Workspace
        </h2>
        <p className="mt-1 text-zinc-500">
          Everything you have saved for later.
        </p>
      </div>
      <div className="space-y-7">
        {workspaceSections.map((section) => {
          const Icon = icons[section.icon];
          return (
            <div key={section.title}>
              <div className="mb-3 flex items-center gap-2">
                <Icon size={18} className="text-indigo-600" />
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white">
                    {section.title}
                  </h3>
                  <p className="text-sm text-zinc-500">{section.description}</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
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
