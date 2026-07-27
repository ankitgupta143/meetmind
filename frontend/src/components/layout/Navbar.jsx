import { Bell, Search } from "lucide-react";

const Navbar = () => {
  return (
    <header className="flex h-20 items-center justify-between rounded-3xl bg-white px-8 shadow-sm dark:bg-zinc-900">

      <div className="relative w-[420px]">

        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
          size={18}
        />

        <input
          placeholder="Search meetings..."
          className="h-12 w-full rounded-2xl border bg-transparent pl-11 pr-4 outline-none transition focus:ring-2 focus:ring-indigo-500"
        />

      </div>

      <div className="flex items-center gap-4">

        <button className="rounded-xl p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800">

          <Bell size={20} />

        </button>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">

          A

        </div>

      </div>

    </header>
  );
};

export default Navbar;