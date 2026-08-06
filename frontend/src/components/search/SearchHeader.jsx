import { Search } from "lucide-react";

export default function SearchHeader() {
  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-indigo-600 p-3 text-white">
          <Search size={24} />
        </div>

        <div>
          <h1 className="text-3xl font-bold">
            Global Search
          </h1>

          <p className="text-zinc-500">
            Search meetings, transcripts, speakers and
            action items.
          </p>
        </div>
      </div>
    </div>
  );
}