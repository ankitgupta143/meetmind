import { BarChart3, FileText, Mail } from "lucide-react";
import { templates } from "../data/workspaceData";
import TemplateCard from "../cards/TemplateCard";

const icons = { mail: Mail, file: FileText, chart: BarChart3 };
export default function Templates() {
  return <section><div className="mb-5"><h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Templates</h2><p className="mt-1 text-zinc-500">Start routine work with a repeatable structure.</p></div><div className="grid gap-4 lg:grid-cols-3">{templates.map((template) => <TemplateCard key={template.title} template={template} Icon={icons[template.icon]} />)}</div></section>;
}
