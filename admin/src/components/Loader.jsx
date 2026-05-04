export default function Loader({ fullPage = false, label = 'Loading...' }) {
  const wrapperClass = fullPage
    ? 'min-h-screen flex items-center justify-center'
    : 'py-10 flex items-center justify-center';

  return (
    <div className={wrapperClass}>
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-card">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
    </div>
  );
}
