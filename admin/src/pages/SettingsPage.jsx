import AdminLayout from '../layout/AdminLayout';

export default function SettingsPage() {
  const apiBaseUrl = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5000/api';

  return (
    <AdminLayout title="Settings" subtitle="Environment and panel configuration">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <h3 className="text-lg font-semibold text-slate-900">Admin Panel Configuration</h3>
        <p className="mt-1 text-sm text-slate-500">Review current environment values and status workflow.</p>

        <div className="mt-4 grid gap-3 text-sm">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="font-semibold text-slate-700">API Base URL</p>
            <p className="mt-1 break-all text-slate-600">{apiBaseUrl}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="font-semibold text-slate-700">Lead Status Workflow</p>
            <p className="mt-1 text-slate-600">New → In Progress → Converted / Rejected</p>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
