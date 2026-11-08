"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TemplateCard({ template, Icon }) {
  const router = useRouter();

  const handleUseTemplate = () => {
    if (template.prompt) {
      try {
        sessionStorage.setItem("meetmind_prefill_prompt", template.prompt);
      } catch (_) {}
      router.push("/ai-assistant");
    }
  };

  return (
    <button
      onClick={handleUseTemplate}
      className="group rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-5 text-left shadow-xl backdrop-blur-2xl transition-all duration-300 hover:border-indigo-500/40 hover:bg-slate-900/80 hover:-translate-y-1 cursor-pointer w-full flex flex-col justify-between"
    >
      <div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-colors">
          <Icon size={16} />
        </div>
        <h3 className="mt-4 text-xs sm:text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
          {template.title}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          {template.description}
        </p>
      </div>
      <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
        <span>Run with Global AI</span>
        <ArrowRight
          size={14}
          className="transition group-hover:translate-x-1"
        />
      </span>
    </button>
  );
}
