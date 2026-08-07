import { Check, Download, LoaderCircle } from "lucide-react";

export default function ExportFooter({ disabled, isComplete, isExporting, onExport }) {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 px-6 py-5">
      {isComplete && <p className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-700"><Check size={16} /> Your export is ready.</p>}
      <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-zinc-300" disabled={disabled || isExporting} onClick={onExport} type="button">
        {isExporting ? <LoaderCircle className="animate-spin" size={18} /> : <Download size={18} />}
        {isExporting ? "Preparing export..." : "Export Meeting"}
      </button>
      {disabled && <p className="mt-2 text-center text-xs text-zinc-500">Select at least one section to export.</p>}
    </footer>
  );
}
