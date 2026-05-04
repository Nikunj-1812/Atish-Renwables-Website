const requirementOptions = [
  { value: '', label: 'All Requirements' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'residential', label: 'Residential' },
];

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'contacted', label: 'In Progress (Legacy)' },
  { value: 'converted', label: 'Converted' },
  { value: 'rejected', label: 'Rejected' },
];

export default function LeadFilters({ filters, onChange, onReset }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="grid gap-3 lg:grid-cols-5">
        <input
          value={filters.search}
          onChange={(event) => onChange('search', event.target.value)}
          placeholder="Search name, phone, email, city"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />

        <select
          value={filters.requirement}
          onChange={(event) => onChange('requirement', event.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          {requirementOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(event) => onChange('status', event.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          {statusOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.dateFrom}
          onChange={(event) => onChange('dateFrom', event.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.dateTo}
            onChange={(event) => onChange('dateTo', event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}
