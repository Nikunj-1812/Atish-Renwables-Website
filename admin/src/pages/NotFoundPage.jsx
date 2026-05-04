import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">404</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-1 text-sm text-slate-500">The page you are looking for does not exist.</p>
        <Link
          to="/admin/dashboard"
          className="mt-4 inline-block rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
