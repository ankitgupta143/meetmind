import { Inbox } from "lucide-react";
export function EmptyState({
  title = "Nothing here yet",
  description = "Content will appear here once it is available.",
  action,
}) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-6 text-center">
      <Inbox className="size-8 text-indigo-500" />
      <h3 className="mt-3 font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-zinc-500">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
