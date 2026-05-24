import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Copy, MapPin, PanelTop, Share2, Sparkles } from 'lucide-react';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { getProjectById } from '../utils/api';

const fallbackCaseStudy =
  'This project was delivered with a focus on clean execution, durable system design, and long-term energy yield. The final installation balanced engineering quality, site constraints, and operational reliability.';

const formatCategory = (value = '') => String(value || '').charAt(0).toUpperCase() + String(value || '').slice(1);

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copyToast, setCopyToast] = useState(false); // "Link copied" feedback

  useEffect(() => {
    let mounted = true;

    const loadProject = async () => {
      setLoading(true);
      const response = await getProjectById(projectId);
      if (!mounted) return;
      if (response.success) {
        setProject(response.data);
      } else {
        setProject(null);
      }
      setLoading(false);
    };

    loadProject();
    return () => { mounted = false; };
  }, [projectId]);

  const handleShare = async () => {
    const url = window.location.href;
    const title = project?.projectName || 'Atish Renewables — Solar Project';
    const text = project?.description
      ? `${project.description} — View the full case study:`
      : 'Check out this solar project by Atish Renewables:';

    // Use native Web Share API if available (mobile browsers, modern desktop)
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    // Fallback: copy link to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2500);
    } catch {
      // Last resort: prompt with the URL
      window.prompt('Copy this link to share:', url);
    }
  };

  const caseStudy = project?.caseStudy?.trim() || fallbackCaseStudy;

  const projectHighlights = useMemo(
    () => [
      { label: 'Location', value: project?.location || '—', icon: MapPin },
      { label: 'System Size', value: project?.systemSizeKw ? `${project.systemSizeKw} kW` : '—', icon: PanelTop },
      { label: 'Category', value: formatCategory(project?.category), icon: Sparkles },
    ],
    [project]
  );

  if (loading) {
    return <Loader fullPage label="Loading project" />;
  }

  if (!project) {
    return (
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="text-muted">Project not found.</p>
          <Button to="/projects" variant="secondary">
            <ArrowLeft size={16} />
            Back to Projects
          </Button>
        </div>
      </section>
    );
  }

  return (
    <motion.section className="section" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}>
      <div className="container">
        <div className="project-detail-nav">
          <Button to="/projects" variant="secondary" className="btn-icon project-detail-nav__btn" aria-label="Back to Projects">
            <ArrowLeft size={20} />
          </Button>

          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="btn btn-secondary btn-icon project-detail-nav__btn"
              aria-label="Share Project"
              onClick={handleShare}
            >
              <Share2 size={20} />
            </button>

            {/* "Link copied" toast */}
            <AnimatePresence>
              {copyToast && (
                <motion.div
                  className="share-toast"
                  initial={{ opacity: 0, y: 6, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  role="status"
                  aria-live="polite"
                >
                  <Copy size={13} />
                  Link copied!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <article className="panel project-detail-hero" style={{ overflow: 'hidden' }}>
          <div className="split split--2 project-detail-split" style={{ gap: 0, alignItems: 'stretch' }}>
            <div className="media-frame media-frame--cover project-detail-media">
              <img src={project.imageUrl || project.image} alt={project.projectName} loading="eager" fetchPriority="high" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div className="project-detail-content">
              <span className="pill" style={{ width: 'fit-content', background: 'rgba(15,106,115,0.08)', color: 'var(--primary-strong)' }}>
                Featured Case Study
              </span>

              <h1 className="section-title" style={{ textAlign: 'left', fontSize: 'clamp(2rem, 3.4vw, 3rem)' }}>
                {project.projectName}
              </h1>

              <div style={{ display: 'grid', gap: 12 }}>
                <p className="text-muted" style={{ margin: 0 }}>
                  {project.description}
                </p>

                <div style={{ display: 'grid', gap: 12 }}>
                  {projectHighlights.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="stack-item" style={{ padding: '12px 16px' }}>
                        <div className="stack-item__icon">
                          <Icon size={18} />
                        </div>
                        <div>
                          <div style={{ fontSize: '.76rem', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--muted)', fontWeight: 800 }}>
                            {item.label}
                          </div>
                          <div style={{ fontWeight: 800 }}>{item.value}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <span className="pill" style={{ background: 'rgba(15,106,115,0.08)', color: 'var(--primary-strong)' }}>
                  {project.city}
                </span>
                <span className="pill" style={{ background: 'rgba(253,188,19,0.18)', color: 'var(--accent-ink)' }}>
                  {project.district}
                </span>
              </div>
            </div>
          </div>
        </article>

        <section className="section section--tight project-detail-body">
          <div className="grid-responsive grid-2">
            <article className="panel project-detail-panel">
              <h2 className="service-card__title">Project Overview</h2>
              <p className="text-muted" style={{ marginBottom: 0, lineHeight: 1.8 }}>
                {project.description}
              </p>
            </article>

            <article className="panel project-detail-panel">
              <h2 className="service-card__title">Case Study</h2>
              <p className="text-muted" style={{ marginBottom: 16, lineHeight: 1.8 }}>
                {caseStudy}
              </p>
              <div className="stack" style={{ gap: 10 }}>
                {[
                  'Site survey and system sizing',
                  'Layout planning and installation coordination',
                  'Performance-optimized commissioning',
                ].map((item) => (
                  <div key={item} className="stack-item project-detail-checklist-item">
                    <div className="stack-item__icon" style={{ width: 36, height: 36, flexShrink: 0 }}>
                      <CheckCircle2 size={16} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
      </div>
    </motion.section>
  );
}