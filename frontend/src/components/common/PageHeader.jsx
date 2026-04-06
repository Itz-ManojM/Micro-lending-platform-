export default function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-teal-800 p-6 text-white shadow-xl md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-amber-300">
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl font-bold">{title}</h2>
        {subtitle && <p className="mt-2 max-w-2xl text-slate-200">{subtitle}</p>}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}
