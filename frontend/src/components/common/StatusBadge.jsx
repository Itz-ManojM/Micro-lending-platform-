const statusStyles = {
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-rose-100 text-rose-800",
  MANUAL_REVIEW: "bg-amber-100 text-amber-800",
  LOW: "bg-emerald-100 text-emerald-800",
  MEDIUM: "bg-amber-100 text-amber-800",
  HIGH: "bg-rose-100 text-rose-800",
  PENDING: "bg-sky-100 text-sky-800",
  PAID: "bg-emerald-100 text-emerald-800",
  OVERDUE: "bg-red-100 text-red-800",
  APPLIED: "bg-violet-100 text-violet-800",
  SUCCESS: "bg-emerald-100 text-emerald-800",
  FAILED: "bg-rose-100 text-rose-800",
};

function formatLabel(value) {
  return value.replaceAll("_", " ");
}

export default function StatusBadge({ value }) {
  if (!value) {
    return null;
  }

  const classes =
    statusStyles[value] || "bg-slate-100 text-slate-800";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${classes}`}
    >
      {formatLabel(value)}
    </span>
  );
}
