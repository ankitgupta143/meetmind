const fields = [
  ["firstName", "First Name"],
  ["lastName", "Last Name"],
  ["email", "Email Address", "email"],
  ["phone", "Phone Number", "tel"],
  ["company", "Company / Organization"],
  ["role", "Job Title / Role"],
  ["timezone", "Primary Timezone"],
  ["country", "Country"],
  ["language", "Interface Language"],
];

const PersonalInformation = ({ values, onChange, errors = {} }) => (
  <section className="rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-6 sm:p-8 shadow-xl backdrop-blur-2xl">
    <div className="mb-6">
      <h2 className="text-base font-bold text-white">
        Personal Information
      </h2>
      <p className="mt-0.5 text-xs text-slate-400">
        Keep your profile details up to date for meeting attributions.
      </p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map(([key, label, type = "text"]) => (
        <div key={key} className={`space-y-1.5 ${key === "language" ? "sm:col-span-2" : ""}`}>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-300">
              {label}
            </span>
            <input
              type={type}
              readOnly={key === "email"}
              value={values[key] ?? ""}
              onChange={(event) => onChange(key, event.target.value)}
              className={`h-10 w-full rounded-xl border px-3.5 text-xs outline-none transition ${
                key === "email"
                  ? "cursor-not-allowed bg-slate-900/50 text-slate-500 border-white/[0.04]"
                  : errors[key]
                  ? "border-rose-500 bg-slate-900 text-white focus:ring-2 focus:ring-rose-500/20"
                  : "border-white/[0.08] bg-slate-900 text-slate-100 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
              }`}
            />
          </label>
          {errors[key] && (
            <p className="text-[11px] text-rose-400">{errors[key]}</p>
          )}
        </div>
      ))}
    </div>
  </section>
);

export default PersonalInformation;
