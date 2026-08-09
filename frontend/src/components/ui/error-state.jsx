import { AlertCircle, RefreshCw } from "lucide-react";
export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  onRetry,
}) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/40 p-6 text-center">
      <AlertCircle className="size-8 text-red-500" />
      <h3 className="mt-3 font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-zinc-500">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm"
        >
          <RefreshCw className="size-4" />
          Try again
        </button>
      )}
    </div>
  );
}
