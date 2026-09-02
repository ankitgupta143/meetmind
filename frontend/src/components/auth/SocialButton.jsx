export default function SocialButton({ provider, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-xs font-semibold text-slate-200 transition hover:bg-white/[0.08] hover:text-white cursor-pointer"
    >
      <span
        className={`flex size-4 items-center justify-center rounded-full text-[10px] font-bold text-white ${
          provider === "Google" ? "bg-rose-600" : "bg-slate-700"
        }`}
      >
        {provider === "Google" ? "G" : "GH"}
      </span>
      <span>{provider}</span>
    </button>
  );
}
