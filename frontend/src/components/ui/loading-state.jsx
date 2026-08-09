import { LoaderCircle } from "lucide-react";
export function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-sm text-zinc-500">
      <LoaderCircle className="size-6 animate-spin text-indigo-600" />
      {message}
    </div>
  );
}
