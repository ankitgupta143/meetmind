const fields = [
  ["firstName", "First Name"],
  ["lastName", "Last Name"],
  ["email", "Email", "email"],
  ["phone", "Phone", "tel"],
  ["company", "Company"],
  ["role", "Job Title"],
  ["timezone", "Timezone"],
  ["country", "Country"],
  ["language", "Language"],
];

const PersonalInformation = ({ values, onChange, errors = {} }) => (
  <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
    <div className="mb-6">
      <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
        Personal Information
      </h2>
      <p className="mt-1 text-sm text-zinc-500">
        Keep your profile details up to date.
      </p>
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      {fields.map(([key, label, type = "text"]) => (
        <div key={key} className={`space-y-1 ${key === "language" ? "md:col-span-2" : ""}`}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              {label}
            </span>
            <input
              type={type}
              // email field is read-only — cannot be changed from the profile page
              readOnly={key === "email"}
              value={values[key] ?? ""}
              onChange={(event) => onChange(key, event.target.value)}
              className={`h-11 w-full rounded-xl border px-3 text-sm outline-none transition focus:ring-4 dark:bg-zinc-950 ${
                key === "email"
                  ? "cursor-not-allowed bg-zinc-50 text-zinc-400 border-zinc-200 dark:border-zinc-700"
                  : errors[key]
                  ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                  : "border-zinc-200 focus:border-indigo-400 focus:ring-indigo-100 dark:border-zinc-700 dark:focus:ring-indigo-950"
              }`}
            />
          </label>
          {errors[key] && (
            <p className="text-xs text-red-500">{errors[key]}</p>
          )}
        </div>
      ))}
    </div>
  </section>
);

export default PersonalInformation;
