import { Check } from "lucide-react";

const ConnectedBadge = () => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
    <Check className="size-3.5" />
    Connected
  </span>
);
export default ConnectedBadge;
