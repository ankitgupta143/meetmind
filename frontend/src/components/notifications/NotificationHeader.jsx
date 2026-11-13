export default function NotificationHeader({ hasUnread, onMarkAllRead }) {
  return (
    <header className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
      <h2 className="text-sm font-semibold text-white">Notifications</h2>
      {hasUnread && (
        <button
          className="text-xs font-medium text-indigo-400 transition hover:text-indigo-300"
          onClick={onMarkAllRead}
          type="button"
        >
          Mark all read
        </button>
      )}
    </header>
  );
}
