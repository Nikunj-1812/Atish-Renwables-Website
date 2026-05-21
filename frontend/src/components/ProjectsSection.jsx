import React, { useMemo, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, Star, Zap } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Button from './Button';
import { projectFilters } from '../data/siteData';
import { sectionMotion } from '../utils/motion';

// ─── Animation variants ───────────────────────────────────────────────────────

const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, when: 'beforeChildren' },
  },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] } },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const normCat = (val) => String(val || '').trim().toLowerCase();

// ─── ProjectImage — always fills its container, never stretches ───────────────
// Uses object-fit: cover so any image shape looks clean in the card.

function ProjectImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      draggable={false}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
        display: 'block',
        transition: 'transform 420ms cubic-bezier(0.2,0.9,0.2,1)',
      }}
    />
  );
}

// ─── Regular project card ─────────────────────────────────────────────────────

function ProjectCard({ project }) {
  return (
    <motion.article className="project-card card-hover" variants={cardVariants}>
      {/* Media — fixed 16:10 aspect ratio, image always covers */}
      <div className="project-card__media">
        <ProjectImage
          src={project.imageUrl || project.image}
          alt={project.projectName || project.title}
        />
        <span
          className="pill"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(8px)',
            textTransform: 'capitalize',
            fontSize: '0.78rem',
            padding: '6px 12px',
          }}
        >
          {project.category}
        </span>
      </div>

      {/* Body */}
      <div className="project-card__body">
        <h3 className="project-card__title">{project.projectName || project.title}</h3>
        <div className="project-card__location">
          <MapPin size={14} />
          {project.location}
        </div>
        <div className="project-card__footer">
          <div>
            <div className="project-card__label">System Size</div>
            <div className="project-card__value">
              {project.systemSizeKw ? `${project.systemSizeKw} kW` : project.size || '—'}
            </div>
          </div>
          <Button
            to={project._id ? `/projects/${project._id}` : '/projects'}
            variant="secondary"
            className="project-card__cta"
            aria-label={`Open ${project.projectName || project.title} case study`}
          >
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Mega project card — same layout, different badge ────────────────────────

function MegaCard({ project }) {
  return (
    <motion.article className="project-card project-card--mega card-hover" variants={cardVariants}>
      <div className="project-card__media">
        <ProjectImage
          src={project.imageUrl || project.image}
          alt={project.projectName || project.title}
        />
        <span
          className="pill"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(15,106,115,0.92)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            fontSize: '0.78rem',
            padding: '6px 12px',
          }}
        >
          <Zap size={12} />
          Mega Project
        </span>
      </div>
      <div className="project-card__body">
        <h3 className="project-card__title">{project.projectName || project.title}</h3>
        <div className="project-card__location">
          <MapPin size={14} />
          {project.location}
        </div>
        <div className="project-card__footer">
          <div>
            <div className="project-card__label">System Size</div>
            <div className="project-card__value">
              {project.systemSizeKw ? `${project.systemSizeKw} kW` : project.size || '—'}
            </div>
          </div>
          <Button
            to={project._id ? `/projects/${project._id}` : '/projects'}
            variant="secondary"
            className="project-card__cta"
            aria-label={`Open ${project.projectName || project.title} case study`}
          >
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Featured hero card (first mega project on "All" view) ───────────────────

function FeaturedCard({ project }) {
  return (
    <motion.article
      key="featured-hero"
      className="featured-project-card panel"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Image — fills left half on desktop, full width on mobile */}
      <div className="featured-project-card__media">
        <ProjectImage src={project.imageUrl} alt={project.projectName} />
        <span
          className="pill"
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: 'rgba(15,106,115,0.92)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            fontSize: '0.78rem',
            padding: '6px 12px',
          }}
        >
          <Zap size={12} />
          Mega Project
        </span>
      </div>

      {/* Content */}
      <div className="featured-project-card__content">
        <span
          className="pill"
          style={{
            width: 'fit-content',
            background: 'rgba(15,106,115,0.08)',
            color: 'var(--primary-strong)',
          }}
        >
          <Star size={14} /> Featured Installation
        </span>

        <h3 className="featured-project-card__title">{project.projectName}</h3>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center', color: 'var(--muted)', fontSize: '0.9rem' }}>
          <MapPin size={14} />
          {project.location}
        </div>

        {project.description && (
          <p className="text-muted" style={{ fontSize: '0.93rem', lineHeight: 1.65, margin: 0 }}>
            {project.description}
          </p>
        )}

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <span
            className="pill"
            style={{
              background: 'rgba(15,106,115,0.08)',
              color: 'var(--primary-strong)',
              textTransform: 'capitalize',
              fontSize: '0.8rem',
              padding: '6px 12px',
            }}
          >
            {project.category}
          </span>
          <span
            className="pill"
            style={{
              background: 'rgba(253,188,19,0.18)',
              color: 'var(--accent-ink)',
              fontSize: '0.8rem',
              padding: '6px 12px',
            }}
          >
            {project.systemSizeKw ? `${project.systemSizeKw} kW` : '—'}
          </span>
        </div>

        <div>
          <Button
            to={project._id ? `/projects/${project._id}` : '/projects'}
            variant="secondary"
          >
            View Case Study
            <ArrowRight size={15} />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function ProjectsSection({ projectData }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const allProjects = projectData || [];

  const megaProjects = useMemo(
    () => allProjects.filter((p) => Boolean(p.isMegaProject)),
    [allProjects]
  );

  // Only the FIRST mega project gets the featured hero card.
  // ALL other projects (regular + remaining mega) go into the card grid.
  const featured = megaProjects[0] || null;

  // ── Filter logic ────────────────────────────────────────────────────────
  // All        → featured hero (mega[0]) at top + ALL remaining projects as cards
  // Mega       → ALL mega projects as cards (no featured hero)
  // Industrial/Commercial/Residential → matching projects only (regular + mega)
  // ────────────────────────────────────────────────────────────────────────

  const showFeaturedHero = activeFilter === 'All' && Boolean(featured);

  // Cards shown in the main grid (no separate mega grid row)
  const visibleCards = useMemo(() => {
    // All remaining projects after the featured one
    const nonFeatured = featured
      ? allProjects.filter((p) => p._id !== featured._id)
      : allProjects;

    if (activeFilter === 'All') return nonFeatured;

    if (activeFilter === 'Mega') return megaProjects;

    // Category filter — includes both regular and mega projects of that category
    return nonFeatured.filter((p) => normCat(p.category) === normCat(activeFilter));
  }, [activeFilter, allProjects, featured, megaProjects]);

  const isEmpty = !showFeaturedHero && visibleCards.length === 0;

  return (
    <motion.section className="section" {...sectionMotion}>
      <div className="container">
        <SectionHeading
          eyebrow="Projects"
          title="Solar projects delivered across sectors"
          copy="Industrial, commercial, and residential installations designed for performance, reliability, and clean execution."
        />

        {/* Filter chips */}
        <div className="chip-group" style={{ justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
          {projectFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`chip${activeFilter === filter ? ' chip--active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* ── Featured hero card ── */}
        <AnimatePresence mode="wait">
          {showFeaturedHero && <FeaturedCard key="featured" project={featured} />}
        </AnimatePresence>

        {/* ── All remaining projects in one unified grid ── */}
        <AnimatePresence mode="wait">
          {visibleCards.length > 0 ? (
            <motion.div
              key={`grid-${activeFilter}`}
              className="projects-grid"
              data-count={Math.min(visibleCards.length, 3)}
              variants={gridVariants}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {visibleCards.map((p) =>
                p.isMegaProject ? (
                  <MegaCard key={p._id || p.projectName} project={p} />
                ) : (
                  <ProjectCard key={p._id || p.projectName} project={p} />
                )
              )}
            </motion.div>
          ) : isEmpty ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="panel" style={{ padding: 28, textAlign: 'center', color: 'var(--muted)' }}>
                No projects available for this filter.
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Button to="/contact" variant="secondary">
            Start a Similar Project
          </Button>
        </div>
      </div>
    </motion.section>
  );
}

export default memo(ProjectsSection);
