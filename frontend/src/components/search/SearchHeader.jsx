import { Search } from "lucide-react";

export default function SearchHeader() {
  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-300/20 bg-indigo-300/10 text-indigo-200">
          <Search size={22} />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2 sm:text-3xl">
            OmniSearch Intelligence
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Search across recorded meetings, speaker transcripts, extracted action items and decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
