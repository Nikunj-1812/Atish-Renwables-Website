import { useEffect, useMemo, useState } from 'react';
import { Edit3, ExternalLink, Plus, Trash2, UserRound, X } from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';
import Loader from '../components/Loader';
import ImageDropzone from '../components/ImageDropzone';
import { api } from '../services/api';

const initialForm = {
  name: '',
  role: '',
  imageUrl: '',
  virtualCardLink: '',
};

export default function TeamPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const sortedMembers = useMemo(() => members, [members]);

  const fetchTeam = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getTeam();
      setMembers(data.teamMembers || []);
    } catch (err) {
      setError(err.message || 'Failed to load team members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const openCreateModal = () => {
    setEditingId('');
    setForm(initialForm);
    setPreviewUrl('');
    setModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingId(member._id);
    setForm({
      name: member.name || '',
      role: member.role || '',
      imageUrl: member.imageUrl || '',
      virtualCardLink: member.virtualCardLink || '',
    });
    setPreviewUrl(member.imageUrl || '');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId('');
    setSaving(false);
    setUploading(false);
    setUploadProgress(0);
  };

  const handleImageSelect = async (file) => {
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setUploading(true);
    setUploadProgress(0);

    try {
      const uploaded = await api.uploadImage(file, (event) => {
        if (!event.total) return;
        const progress = Math.round((event.loaded * 100) / event.total);
        setUploadProgress(progress);
      });

      setForm((prev) => ({ ...prev, imageUrl: uploaded.secureUrl }));
      setUploadProgress(100);
    } catch (err) {
      setError(err.message || 'Failed to upload team image.');
      setPreviewUrl(form.imageUrl || '');
    } finally {
      setUploading(false);
      window.setTimeout(() => setUploadProgress(0), 600);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = { ...form };

      if (editingId) {
        await api.updateTeamMember(editingId, payload);
      } else {
        await api.createTeamMember(payload);
      }

      await fetchTeam();
      closeModal();
    } catch (err) {
      setError(err.message || 'Failed to save team member.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (member) => {
    const confirmed = window.confirm(`Delete ${member.name}?`);
    if (!confirmed) return;

    setError('');
    try {
      await api.deleteTeamMember(member._id);
      await fetchTeam();
    } catch (err) {
      setError(err.message || 'Failed to delete team member.');
    }
  };

  return (
    <AdminLayout title="Team" subtitle="Manage leadership profiles and virtual card links">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">Add, update, and remove team members while keeping the same public presentation.</p>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus size={14} />
          Add Team Member
        </button>
      </div>

      {error ? <p className="mb-4 rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</p> : null}
      {loading ? <Loader label="Loading team" /> : null}

      {!loading ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedMembers.map((member) => (
            <article key={member._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
              <div className="grid place-items-center bg-slate-50 p-5">
                <img src={member.imageUrl} alt={member.name} className="h-40 w-40 rounded-2xl object-cover" loading="lazy" />
              </div>
              <div className="grid gap-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{member.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{member.role}</p>
                  </div>
                  {member.isDefault && (
                    <span className="flex-shrink-0 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 whitespace-nowrap">Default</span>
                  )}
                </div>

                <a
                  href={member.virtualCardLink || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100"
                >
                  <ExternalLink size={14} />
                  View Virtual Card
                </a>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(member)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Edit3 size={14} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(member)}
                    className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : null}

      {modalOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{editingId ? 'Edit Team Member' : 'Add Team Member'}</h3>
                <p className="text-sm text-slate-500">Drag and drop a square profile image and save the Cloudinary URL.</p>
              </div>
              <button type="button" onClick={closeModal} className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto p-5">
              <div className="grid gap-4">
                <div>
                  <ImageDropzone previewUrl={previewUrl} uploading={uploading} progress={uploadProgress} onFileSelect={handleImageSelect} />
                </div>

                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Name
                  <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none" required />
                </label>

                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Role
                  <input value={form.role} onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none" required />
                </label>

                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Virtual Card Link
                  <input value={form.virtualCardLink} onChange={(event) => setForm((prev) => ({ ...prev, virtualCardLink: event.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none" placeholder="https://..." />
                </label>
              </div>

              <div className="mt-5 flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
                <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving || uploading} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70">
                  {saving ? 'Saving...' : editingId ? 'Update Member' : 'Create Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}