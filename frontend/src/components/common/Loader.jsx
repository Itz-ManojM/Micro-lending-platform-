export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </div>
  );
}
