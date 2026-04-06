export default function NumberInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  min = 0,
  step = "any",
  required = false,
  disabled = false,
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={name} className="text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        step={step}
        required={required}
        disabled={disabled}
        className={`rounded-2xl border px-4 py-3 text-slate-900 outline-none transition ${
          error
            ? "border-rose-400 bg-rose-50 focus:border-rose-500"
            : "border-slate-300 bg-white focus:border-teal-500"
        } ${disabled ? "cursor-not-allowed bg-slate-100" : ""}`}
      />

      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  );
}
