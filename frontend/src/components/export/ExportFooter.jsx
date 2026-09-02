import { Check, Download, LoaderCircle } from "lucide-react";

export default function ExportFooter({ disabled, isComplete, isExporting, onExport }) {
  return (
    <footer className="border-t border-white/[0.08] bg-slate-900/60 p-5">
      {isComplete && <p className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-emerald-400"><Check size={14} /> Your export is ready for download.</p>}
      <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95" disabled={disabled || isExporting} onClick={onExport} type="button">
        {isExporting ? <LoaderCircle className="animate-spin" size={16} /> : <Download size={16} />}
        {isExporting ? "Preparing export dossier..." : "Export Meeting Dossier"}
      </button>
      {disabled && <p className="mt-2 text-center text-[11px] text-slate-400">Select at least one section to export.</p>}
    </footer>
  );
}
