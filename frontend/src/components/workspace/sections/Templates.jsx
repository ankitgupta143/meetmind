import { BarChart3, FileText, Mail, Sparkles } from "lucide-react";
import { templates } from "../data/workspaceData";
import TemplateCard from "../cards/TemplateCard";

const icons = { mail: Mail, file: FileText, chart: BarChart3 };

export default function Templates() {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          Synthesis Templates
          <Sparkles size={16} className="text-violet-400" />
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Kickstart routine workflows with pre-structured AI prompt frameworks.
        </p>
      </div>
      <div className="grid gap-3.5 lg:grid-cols-3">
        {templates.map((template) => (
          <TemplateCard
            key={template.title}
            template={template}
            Icon={icons[template.icon] || FileText}
          />
        ))}
      </div>
    </section>
  );
}
