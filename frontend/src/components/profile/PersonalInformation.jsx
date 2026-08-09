const fields = [
  ["firstName", "First Name"],
  ["lastName", "Last Name"],
  ["email", "Email", "email"],
  ["phone", "Phone", "tel"],
  ["company", "Company"],
  ["role", "Role"],
  ["timezone", "Timezone"],
  ["country", "Country"],
  ["language", "Language"],
];
const PersonalInformation = ({ values, onChange }) => (
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
        <label key={key} className={key === "language" ? "md:col-span-2" : ""}>
          <span className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {label}
          </span>
          <input
            type={type}
            value={values[key]}
            onChange={(event) => onChange(key, event.target.value)}
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-indigo-950"
          />
        </label>
      ))}
    </div>
  </section>
);
export default PersonalInformation;
