import {
  LayoutDashboard,
  CalendarDays,
  Sparkles,
  Search,
  Users,
  Settings,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Meetings",
    icon: CalendarDays,
  },
  {
    title: "AI Assistant",
    icon: Sparkles,
  },
  {
    title: "Search",
    icon: Search,
  },
  {
    title: "Workspace",
    icon: Users,
  },
];

const Sidebar = () => {
  return (
    <aside className="sticky top-6 hidden h-[calc(100vh-48px)] w-[280px] rounded-3xl bg-white shadow-sm lg:flex lg:flex-col dark:bg-zinc-900">

      <div className="px-8 pt-8">
        <h1 className="text-2xl font-bold">
          MeetMind
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          AI Meeting Intelligence
        </p>
      </div>

      <nav className="mt-10 flex-1 px-4">

        {menu.map((item) => (
          <button
            key={item.title}
            className="mb-2 flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <item.icon size={20} />

            <span>{item.title}</span>
          </button>
        ))}

      </nav>

      <div className="border-t p-5">

        <button className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 transition hover:bg-zinc-100 dark:hover:bg-zinc-800">

          <Settings size={20} />

          <span>Settings</span>

        </button>

      </div>

    </aside>
  );
};

export default Sidebar;