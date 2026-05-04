const statusMap = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  in_progress: 'bg-amber-50 text-amber-700 border-amber-200',
  contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  converted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
};

const labels = {
  new: 'New',
  in_progress: 'In Progress',
  contacted: 'In Progress',
  converted: 'Converted',
  rejected: 'Rejected',
};

export default function StatusBadge({ status }) {
  const normalized = status || 'new';
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusMap[normalized] || statusMap.new}`}>
      {labels[normalized] || normalized}
    </span>
  );
}
