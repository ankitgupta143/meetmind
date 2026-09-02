import { Check } from "lucide-react";

const ConnectedBadge = () => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
    <Check className="size-3" />
    Connected
  </span>
);

export default ConnectedBadge;
