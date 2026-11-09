import { FileText, X } from "lucide-react";

export default function ExportHeader({ onClose }) {
  return (
    <header className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
          <FileText size={18} />
        </span>
        <div>
          <h2 id="export-meeting-title" className="text-base font-bold text-white">Export Meeting</h2>
          <p className="text-xs text-slate-400">Create a shareable meeting summary & report</p>
        </div>
      </div>
      <button aria-label="Close export drawer" className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white" onClick={onClose} type="button">
        <X size={18} />
      </button>
    </header>
  );
}
