import { Suspense } from "react";
import VerifyEmailCard from "@/components/auth/VerifyEmailCard";
import { Loader2 } from "lucide-react";

function VerifyEmailFallback() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
      <Loader2 className="size-6 animate-spin text-indigo-400 mb-2" />
      <p className="text-xs">Loading verification portal...</p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <section className="flex items-center justify-center p-6 sm:p-12">
      <Suspense fallback={<VerifyEmailFallback />}>
        <VerifyEmailCard />
      </Suspense>
    </section>
  );
}
