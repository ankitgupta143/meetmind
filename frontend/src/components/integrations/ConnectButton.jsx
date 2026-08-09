import { ArrowUpRight, Check } from "lucide-react";

const ConnectButton = ({ connected, onClick, compact = false }) => (
  <button
    onClick={(event) => {
      event.stopPropagation();
      onClick();
    }}
    className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition ${connected ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-indigo-600 text-white shadow-sm shadow-indigo-600/25 hover:bg-indigo-700"}`}
  >
    {connected ? (
      <>
        <Check className="size-4" />
        {compact ? "Connected" : "Manage"}
      </>
    ) : (
      <>
        Connect
        <ArrowUpRight className="size-4" />
      </>
    )}
  </button>
);
export default ConnectButton;
