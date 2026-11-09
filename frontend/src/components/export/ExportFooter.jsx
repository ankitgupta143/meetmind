import { Check, Download, LoaderCircle } from "lucide-react";

export default function ExportFooter({
  disabled,
  isComplete,
  isExporting,
  onExport,
  lastDownloadUrl,
  downloadFilename,
}) {
  return (
    <footer className="border-t border-white/[0.08] bg-slate-900/60 p-5">
      {isComplete && (
        <div className="mb-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <Check size={14} /> Download initiated!
          </p>
          <p className="mt-1 text-[11px] text-slate-300">
            Saved to your PC&apos;s <strong>Downloads</strong> folder.
          </p>
          {lastDownloadUrl && (
            <a
              href={lastDownloadUrl}
              download={downloadFilename || "meeting-export"}
              className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 underline"
            >
              <Download size={12} /> Click here if file didn&apos;t download
            </a>
          )}
        </div>
      )}
      <button
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95 cursor-pointer"
        disabled={disabled || isExporting}
        onClick={onExport}
        type="button"
      >
        {isExporting ? (
          <LoaderCircle className="animate-spin" size={16} />
        ) : (
          <Download size={16} />
        )}
        {isExporting
          ? "Preparing export report..."
          : isComplete
          ? "Export Again"
          : "Export Meeting Report"}
      </button>
      {disabled && (
        <p className="mt-2 text-center text-[11px] text-slate-400">
          Select at least one section to export.
        </p>
      )}
    </footer>
  );
}
