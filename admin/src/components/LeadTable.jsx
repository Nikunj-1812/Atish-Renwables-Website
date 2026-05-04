import { ArrowDownUp, Eye, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'city', label: 'City' },
  { key: 'requirement', label: 'Requirement' },
  { key: 'monthlyBill', label: 'Monthly Bill' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Date' },
];

export default function LeadTable({ leads, sortBy, sortOrder, onSort, onView, onDelete, updatingId }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-[0.08em] text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-semibold">
                <button
                  type="button"
                  onClick={() => onSort(column.key)}
                  className="inline-flex items-center gap-1"
                >
                  {column.label}
                  {sortBy === column.key ? (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  ) : (
                    <ArrowDownUp size={13} />
                  )}
                </button>
              </th>
            ))}
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {leads.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-10 text-center text-slate-500">
                No leads found.
              </td>
            </tr>
          ) : (
            leads.map((lead) => (
              <tr key={lead._id} className="border-b border-slate-100 text-slate-700 last:border-b-0">
                <td className="px-4 py-3 font-medium text-slate-900">{lead.name}</td>
                <td className="px-4 py-3">{lead.phone}</td>
                <td className="px-4 py-3">{lead.email}</td>
                <td className="px-4 py-3">{lead.city}</td>
                <td className="px-4 py-3 capitalize">{lead.requirement}</td>
                <td className="px-4 py-3">{lead.monthlyBill ? `INR ${lead.monthlyBill}` : '-'}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3">{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onView(lead._id)}
                      className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(lead._id)}
                      disabled={updatingId === lead._id}
                      className="rounded-lg border border-rose-200 p-2 text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
