export default function NotificationHeader({ hasUnread, onMarkAllRead }) {
  return (
    <header className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
      <h2 className="text-base font-semibold text-zinc-950">Notifications</h2>
      {hasUnread && (
        <button
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
          onClick={onMarkAllRead}
          type="button"
        >
          Mark all read
        </button>
      )}
    </header>
  );
}
