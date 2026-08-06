import { ArrowRight } from "lucide-react";

export default function TemplateCard({ template, Icon }) {
  return (
    <button className="group rounded-2xl border border-zinc-200 p-5 text-left transition hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-zinc-800 dark:hover:bg-zinc-800">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10">
        <Icon size={18} />
      </div>
      <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">
        {template.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-zinc-500">
        {template.description}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600">
        Use template{" "}
        <ArrowRight
          size={15}
          className="transition group-hover:translate-x-1"
        />
      </span>
    </button>
  );
}
