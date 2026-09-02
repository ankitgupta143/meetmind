import { Search, Sparkles } from "lucide-react";

export default function SearchHeader() {
  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-600/30">
          <Search size={22} />
        </div>

        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2 sm:text-3xl">
            OmniSearch Intelligence
            <Sparkles size={18} className="text-cyan-400" />
          </h1>

          <p className="mt-0.5 text-xs text-slate-400">
            Search across recorded meetings, speaker transcripts, extracted action items and decisions.
          </p>
        </div>
      </div>
    </div>
  );
}