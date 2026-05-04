import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import StatusBadge from './StatusBadge';

const statusOptions = ['new', 'in_progress', 'contacted', 'converted', 'rejected'];

export default function LeadDetailModal({ lead, open, onClose, onSave, saving }) {
  const [status, setStatus] = useState('new');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (lead) {
      setStatus(lead.status || 'new');
      setNotes(lead.notes || '');
    }
  }, [lead]);

  if (!open || !lead) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({ status, notes });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Lead Details</h3>
            <p className="text-sm text-slate-500">Full user profile and CRM updates</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <X size={16} />
          </button>
        </div>

        <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-2">
          <p><span className="font-semibold">Name:</span> {lead.name}</p>
          <p><span className="font-semibold">Phone:</span> {lead.phone}</p>
          <p><span className="font-semibold">Email:</span> {lead.email}</p>
          <p><span className="font-semibold">City:</span> {lead.city}</p>
          <p className="capitalize"><span className="font-semibold">Requirement:</span> {lead.requirement}</p>
          <p><span className="font-semibold">Monthly Bill:</span> {lead.monthlyBill ?? '-'}</p>
          <p className="sm:col-span-2"><span className="font-semibold">Message:</span> {lead.message || '-'}</p>
          <p className="sm:col-span-2"><span className="font-semibold">Current Status:</span> <StatusBadge status={lead.status} /></p>
        </div>

        <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Update Status
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            >
              {statusOptions.map((item) => (
                <option key={item} value={item}>
                  {item === 'in_progress' || item === 'contacted' ? 'In Progress' : item[0].toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Notes
            <textarea
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              placeholder="Add internal notes for follow-up..."
            />
          </label>

          {Array.isArray(lead.statusHistory) && lead.statusHistory.length > 0 ? (
            <div className="rounded-xl border border-slate-200 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Timeline</p>
              <div className="grid gap-2">
                {lead.statusHistory.slice().reverse().map((item, index) => (
                  <div key={`${item.status}-${item.changedAt}-${index}`} className="flex items-center justify-between text-sm">
                    <StatusBadge status={item.status} />
                    <span className="text-slate-500">{new Date(item.changedAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
