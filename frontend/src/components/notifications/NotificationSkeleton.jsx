export default function NotificationSkeleton() {
  return (
    <div className="space-y-1 p-4">
      {[1, 2, 3].map((item) => (
        <div className="flex gap-3 p-2" key={item}>
          <span className="h-9 w-9 animate-pulse rounded-xl bg-white/[0.06]" />
          <span className="flex-1 space-y-2 py-1">
            <span className="block h-3 w-2/3 animate-pulse rounded bg-white/[0.06]" />
            <span className="block h-2.5 w-1/2 animate-pulse rounded bg-white/[0.06]" />
          </span>
        </div>
      ))}
    </div>
  );
}
