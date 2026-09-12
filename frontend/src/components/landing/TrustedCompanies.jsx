const companies = [
  "Google Meet",
  "Zoom Video",
  "Slack Huddles",
  "Notion AI",
  "Microsoft Teams",
  "Linear Sync",
];

export default function TrustedCompanies() {
  return (
    <section className="relative border-y border-white/[0.06] bg-slate-950/40 py-10 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400">
          Seamlessly integrated with your daily stack
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {companies.map((company) => (
            <span
              key={company}
              className="text-sm sm:text-base font-semibold text-slate-400 transition-all duration-300 hover:text-white hover:scale-105"
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

