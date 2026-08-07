import { FileText, X } from "lucide-react";

export default function ExportHeader({ onClose }) {
  return (
    <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <FileText size={18} />
        </span>
        <div>
          <h2 id="export-meeting-title" className="text-lg font-semibold text-zinc-950">Export Meeting</h2>
          <p className="text-xs text-zinc-500">Create a shareable meeting report</p>
        </div>
      </div>
      <button aria-label="Close export drawer" className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-indigo-500" onClick={onClose} type="button">
        <X size={20} />
      </button>
    </header>
  );
}
