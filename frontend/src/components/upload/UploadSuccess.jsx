"use client";

import { CheckCircle2, ArrowRight, FileText, BrainCircuit, ListTodo, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UploadSuccess({meeting, setOpen }) {
  const router = useRouter();


  const generatedItems = [
    {
      icon: FileText,
      title: "Transcript Generated",
    },
    {
      icon: BrainCircuit,
      title: "AI Summary Created",
    },
    {
      icon: ListTodo,
      title: "Action Items Extracted",
    },
    {
      icon: BarChart3,
      title: "Analytics Generated",
    },
  ];

  const handleOpenWorkspace = () => {
    if(!meeting?.id){
      console.error("Cannot open workspace: meeting ID is missing.");
      return;
    }

    setOpen(false);

    router.push(`/meetings/${meeting._id}`);
  };

  return (
    <div className="p-10">
      <div className="text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2
            size={48}
            className="text-emerald-600"
          />
        </div>

        <h2 className="mt-6 text-3xl font-bold">
          Meeting Ready!
        </h2>

        <p className="mt-3 text-zinc-500">
          Your meeting has been analyzed successfully.
        </p>
      </div>

      <div className="mt-10 rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
        <div className="space-y-4">
          {generatedItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex items-center gap-4 rounded-2xl bg-white p-4"
              >
                <div className="rounded-xl bg-emerald-100 p-3">
                  <Icon
                    size={20}
                    className="text-emerald-600"
                  />
                </div>

                <span className="flex-1 font-medium">
                  {item.title}
                </span>

                <CheckCircle2
                  size={20}
                  className="text-emerald-600"
                />
              </div>
            );
          })}
        </div>
      </div>

      {meeting?.id && (
        <p className="mt-5 text-center text-xs text-zinc-400">
          Meeting ID: {meeting._id}
        </p>
      )}

      <div className="mt-10 flex justify-end">
        <button
          onClick={handleOpenWorkspace}
          disabled={!meeting?._id}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700"
        >
          Open Workspace

          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}