import { useEffect, useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';
import Loader from '../components/Loader';
import LeadFilters from '../components/LeadFilters';
import LeadTable from '../components/LeadTable';
import Pagination from '../components/Pagination';
import LeadDetailModal from '../components/LeadDetailModal';
import { api } from '../services/api';

const initialFilters = {
  search: '',
  requirement: '',
  status: '',
  dateFrom: '',
  dateTo: '',
};

export default function LeadsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [leadsData, setLeadsData] = useState({ leads: [], pagination: { page: 1, totalPages: 1 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const [selectedLead, setSelectedLead] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [savingLead, setSavingLead] = useState(false);
  const [updatingId, setUpdatingId] = useState('');

  const query = useMemo(
    () => ({ ...filters, page, limit: 10, sortBy, sortOrder }),
    [filters, page, sortBy, sortOrder]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const fetchLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getLeads(query);
      setLeadsData({ leads: data.leads || [], pagination: data.pagination || { page: 1, totalPages: 1 } });
    } catch (err) {
      setError(err.message || 'Failed to load leads.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortBy(column);
    setSortOrder('asc');
  };

  const handleViewLead = async (id) => {
    setUpdatingId(id);
    try {
      const data = await api.getLeadDetail(id);
      setSelectedLead(data);
      setModalOpen(true);
    } catch (err) {
      setError(err.message || 'Failed to load lead details.');
    } finally {
      setUpdatingId('');
    }
  };

  const handleDeleteLead = async (id) => {
    const confirmed = window.confirm('Delete this lead permanently?');
    if (!confirmed) {
      return;
    }

    setUpdatingId(id);
    try {
      await api.deleteLead(id);
      await fetchLeads();
    } catch (err) {
      setError(err.message || 'Failed to delete lead.');
    } finally {
      setUpdatingId('');
    }
  };

  const handleSaveLead = async (payload) => {
    if (!selectedLead?._id) {
      return;
    }

    setSavingLead(true);
    try {
      const updated = await api.updateLead(selectedLead._id, payload);
      setSelectedLead(updated);
      await fetchLeads();
      setModalOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to update lead.');
    } finally {
      setSavingLead(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await api.exportLeadsCsv({ ...filters, sortBy, sortOrder });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `leads-${Date.now()}.csv`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Failed to export leads.');
    }
  };

  return (
    <AdminLayout title="Leads" subtitle="Search, filter, update and export your CRM leads">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-500">Manage and track lead lifecycle efficiently.</p>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      <LeadFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={() => {
          setFilters(initialFilters);
          setPage(1);
        }}
      />

      {error ? <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</p> : null}
      {loading ? <Loader label="Loading leads" /> : null}

      {!loading ? (
        <>
          <div className="mt-4">
            <LeadTable
              leads={leadsData.leads}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              onView={handleViewLead}
              onDelete={handleDeleteLead}
              updatingId={updatingId}
            />
          </div>

          <Pagination
            page={leadsData.pagination.page || 1}
            totalPages={leadsData.pagination.totalPages || 1}
            onPageChange={setPage}
          />
        </>
      ) : null}

      <LeadDetailModal
        lead={selectedLead}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveLead}
        saving={savingLead}
      />
    </AdminLayout>
  );
}
