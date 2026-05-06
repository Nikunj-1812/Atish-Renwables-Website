import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Edit3, ExternalLink, FolderKanban, Plus, Trash2, X } from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';
import Loader from '../components/Loader';
import ImageDropzone from '../components/ImageDropzone';
import { api } from '../services/api';

const initialForm = {
  projectName: '',
  imageUrl: '',
  location: '',
  city: '',
  district: '',
  category: 'industrial',
  systemSizeKw: '',
  description: '',
  caseStudy: '',
  isMegaProject: false,
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const featuredProject = useMemo(() => projects.find((project) => project.isMegaProject), [projects]);
  const regularProjects = useMemo(
    () => projects.filter((project) => !project.isMegaProject),
    [projects]
  );

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getProjects();
      setProjects(data.projects || []);
    } catch (err) {
      setError(err.message || 'Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingId('');
    setForm(initialForm);
    setPreviewUrl('');
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingId(project._id);
    setForm({
      projectName: project.projectName || '',
      imageUrl: project.imageUrl || '',
      location: project.location || '',
      city: project.city || '',
      district: project.district || '',
      category: project.category || 'industrial',
      systemSizeKw: project.systemSizeKw ?? '',
      description: project.description || '',
      caseStudy: project.caseStudy || '',
      isMegaProject: Boolean(project.isMegaProject),
    });
    setPreviewUrl(project.imageUrl || '');
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
      setError(err.message || 'Failed to upload project image.');
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
      const payload = {
        ...form,
        systemSizeKw: Number(form.systemSizeKw),
      };

      if (editingId) {
        await api.updateProject(editingId, payload);
      } else {
        await api.createProject(payload);
      }

      await fetchProjects();
      closeModal();
    } catch (err) {
      setError(err.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project) => {
    const confirmed = window.confirm(`Delete ${project.projectName}?`);
    if (!confirmed) return;

    setError('');
    try {
      await api.deleteProject(project._id);
      await fetchProjects();
    } catch (err) {
      setError(err.message || 'Failed to delete project.');
    }
  };

  return (
    <AdminLayout title="Projects" subtitle="Manage public case studies and featured installations">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">Add, edit, and feature projects without changing the public layout.</p>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus size={14} />
          Add Project
        </button>
      </div>

      {error ? <p className="mb-4 rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</p> : null}
      {loading ? <Loader label="Loading projects" /> : null}

      {!loading && featuredProject ? (
        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-brand-700">
            <FolderKanban size={16} />
            Featured Project
          </div>
          <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
            <img
              src={featuredProject.imageUrl}
              alt={featuredProject.projectName}
              className="h-56 w-full rounded-2xl object-cover"
              loading="lazy"
            />
            <div className="grid content-center gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">Mega Project</span>
                {featuredProject.isDefault && (
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Default</span>
                )}
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{featuredProject.category}</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{featuredProject.systemSizeKw} kW</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{featuredProject.projectName}</h2>
              <p className="text-sm text-slate-500">{featuredProject.location} · {featuredProject.city}, {featuredProject.district}</p>
              <p className="text-sm leading-6 text-slate-600">{featuredProject.description}</p>
              <div className="flex flex-wrap gap-2 text-sm text-slate-500">
                <span className="rounded-lg bg-slate-50 px-3 py-2">Case Study: {featuredProject.caseStudy || 'Not Available'}</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => openEditModal(featuredProject)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Edit3 size={14} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(featuredProject)}
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {!loading ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {regularProjects.map((project) => (
            <article key={project._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
              <div className="relative">
                <img src={project.imageUrl} alt={project.projectName} className="h-44 w-full object-cover" loading="lazy" />
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">{project.category}</span>
              </div>
              <div className="grid gap-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{project.projectName}</h3>
                    <p className="mt-1 text-sm text-slate-500">{project.location}</p>
                  </div>
                  {project.isDefault && (
                    <span className="flex-shrink-0 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 whitespace-nowrap">Default</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{project.city}, {project.district}</span>
                  <span className="font-semibold text-brand-700">{project.systemSizeKw} kW</span>
                </div>

                <p className="text-sm leading-6 text-slate-600">{project.description}</p>
                <p className="text-sm text-slate-500">Case Study: {project.caseStudy || 'Not Available'}</p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(project)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Edit3 size={14} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(project)}
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
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{editingId ? 'Edit Project' : 'Add Project'}</h3>
                <p className="text-sm text-slate-500">Upload images via drag and drop and save only the secure Cloudinary URL.</p>
              </div>
              <button type="button" onClick={closeModal} className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
                  Project Name
                  <input
                    value={form.projectName}
                    onChange={(event) => setForm((prev) => ({ ...prev, projectName: event.target.value }))}
                    className="rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none"
                    required
                  />
                </label>

                <div className="md:col-span-2">
                  <ImageDropzone previewUrl={previewUrl} uploading={uploading} progress={uploadProgress} onFileSelect={handleImageSelect} />
                </div>

                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Location
                  <input value={form.location} onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none" required />
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  City
                  <input value={form.city} onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none" required />
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  District
                  <input value={form.district} onChange={(event) => setForm((prev) => ({ ...prev, district: event.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none" required />
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Category
                  <select value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none" required>
                    <option value="industrial">Industrial</option>
                    <option value="commercial">Commercial</option>
                    <option value="residential">Residential</option>
                  </select>
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  System Size (kW)
                  <input type="number" min="0" step="0.1" value={form.systemSizeKw} onChange={(event) => setForm((prev) => ({ ...prev, systemSizeKw: event.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none" required />
                </label>

                <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
                  Description
                  <textarea value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} rows="4" className="rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none" required />
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
                  Case Study (optional)
                  <textarea value={form.caseStudy} onChange={(event) => setForm((prev) => ({ ...prev, caseStudy: event.target.value }))} rows="3" className="rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none" />
                </label>

                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                  <input type="checkbox" checked={form.isMegaProject} onChange={(event) => setForm((prev) => ({ ...prev, isMegaProject: event.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                  Mega Project / Featured
                </label>
              </div>

              <div className="mt-5 flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
                <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving || uploading} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70">
                  {saving ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}