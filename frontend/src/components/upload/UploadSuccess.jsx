"use client";

import { CheckCircle2, ArrowRight, FileText, BrainCircuit, ListTodo, BarChart3, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UploadSuccess({ meeting, setOpen }) {
  const router = useRouter();

  const generatedItems = [
    {
      icon: FileText,
      title: "Audio Diarization & Transcript",
    },
    {
      icon: BrainCircuit,
      title: "Executive AI Summary",
    },
    {
      icon: ListTodo,
      title: "Action Items & Assigned Tasks",
    },
    {
      icon: BarChart3,
      title: "Sentiment & Topic Analytics",
    },
  ];

  const meetingId = meeting?._id || meeting?.id;

  const handleOpenWorkspace = () => {
    if (!meetingId) {
      console.error("Cannot open workspace: meeting ID is missing.");
      return;
    }
    setOpen(false);
    router.push(`/meetings/${meetingId}`);
  };

  return (
    <div className="p-6 sm:p-10">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shadow-xl shadow-emerald-500/20">
          <CheckCircle2 size={36} className="drop-shadow-md" />
        </div>

        <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Meeting Intelligence Ready!
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          All audio streams, decisions and action items have been indexed.
        </p>
      </div>

      <div className="mt-8 rounded-[2rem] border border-white/[0.08] bg-slate-900/40 p-5 backdrop-blur-xl">
        <div className="space-y-2.5">
          {generatedItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex items-center gap-3.5 rounded-xl border border-white/[0.04] bg-slate-900/60 p-3.5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                  <Icon size={16} />
                </div>

                <span className="flex-1 text-xs font-semibold text-slate-200">
                  {item.title}
                </span>

                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleOpenWorkspace}
          disabled={!meetingId}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40 active:scale-95"
        >
          <span>Open Meeting Workspace</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}