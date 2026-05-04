import { useEffect, useState } from 'react';
import { CalendarDays, CheckCircle2, ChartNoAxesCombined, Users } from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';
import Loader from '../components/Loader';
import StatCard from '../components/StatCard';
import { api } from '../services/api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      try {
        const data = await api.getLeadStats();
        if (mounted) {
          setStats(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to load stats.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AdminLayout title="Dashboard" subtitle="High-level CRM metrics for your lead pipeline">
      {loading ? <Loader label="Loading dashboard stats" /> : null}
      {error ? <p className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</p> : null}

      {stats ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Leads" value={stats.totalLeads} icon={Users} />
          <StatCard title="Today Leads" value={stats.todayLeads} icon={CalendarDays} accent="emerald" />
          <StatCard title="Monthly Leads" value={stats.monthlyLeads} icon={ChartNoAxesCombined} />
          <StatCard title="Conversion Rate" value={`${stats.conversionRate}%`} icon={CheckCircle2} accent="emerald" />
        </section>
      ) : null}
    </AdminLayout>
  );
}
