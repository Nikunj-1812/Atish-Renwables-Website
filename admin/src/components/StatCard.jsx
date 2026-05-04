export default function StatCard({ title, value, icon: Icon, accent = 'brand' }) {
  const iconClass = accent === 'emerald' ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-100 text-brand-700';

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <span className={`grid h-9 w-9 place-items-center rounded-lg ${iconClass}`}>
          <Icon size={17} />
        </span>
      </div>
      <p className="text-3xl font-semibold text-slate-900">{value}</p>
    </article>
  );
}
