import React, { useMemo, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Button from './Button';
import { projectFilters } from '../data/siteData';
import { sectionMotion, staggerContainer, staggerItem } from '../utils/motion';
import ImageCard from './ImageCard';

function ProjectsSection({ projectData }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const allProjects = projectData || [];
  const megaProjects = useMemo(
    () => allProjects.filter((project) => Boolean(project.isMegaProject)),
    [allProjects]
  );
  const featured = megaProjects[0] || null;
  const additionalMegaProjects = useMemo(
    () => megaProjects.slice(1),
    [megaProjects]
  );

  const visibleProjects = useMemo(() => {
    const regularProjects = allProjects.filter((project) => !project.isMegaProject);

    if (activeFilter === 'All') {
      return regularProjects;
    }

    if (activeFilter === 'Mega') {
      // Show all projects flagged as mega/featured when Mega filter is selected
      return megaProjects;
    }

    return regularProjects.filter(
      (project) => String(project.category || '').toLowerCase() === activeFilter.toLowerCase()
    );
  }, [activeFilter, allProjects, megaProjects]);

  const showFeaturedCard = activeFilter !== 'Mega' && Boolean(featured);
  const megaGridProjects = activeFilter === 'Mega' ? megaProjects : additionalMegaProjects;
  const hasProjectsToRender =
    visibleProjects.length > 0 || megaGridProjects.length > 0 || showFeaturedCard;

  return (
    <motion.section className="section" {...sectionMotion}>
      <div className="container">
        <SectionHeading
          eyebrow="Projects"
          title="Solar projects delivered across sectors"
          copy="Industrial, commercial, and residential installations designed for performance, reliability, and clean execution."
        />

        <motion.div className="chip-group block" style={{ justifyContent: 'center', marginBottom: 28 }} variants={staggerContainer} initial="hidden" animate="show">
          {projectFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`chip ${activeFilter === filter ? 'chip--active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {showFeaturedCard ? (
          <motion.article className="panel featured-project-card" style={{ padding: 16, overflow: 'visible', marginBottom: 28 }} {...sectionMotion}>
          <div className="split featured-split" style={{ gap: 0 }}>
            <div className="media-frame media-frame--cover featured-media" >
              {featured ? (
                <ImageCard src={featured.imageUrl} alt={featured.projectName} height="h-64" />
              ) : null}
            </div>
            <div className="featured-project__content" style={{ padding: '24px 32px', display: 'grid', gap: 12, alignContent: 'center' }}>
              <span className="pill" style={{ width: 'fit-content', background: 'rgba(15,106,115,0.08)', color: 'var(--primary-strong)' }}>
                <Star size={16} /> Featured Installation
              </span>
                <h3 className="section-title featured-project__title" style={{ textAlign: 'left' }}>
                {featured?.projectName || 'No featured project available'}
              </h3>
              <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center', color: 'var(--muted)' }}>
                <MapPin size={16} />
                {featured?.location || 'Add a featured project in CRM'}
              </div>
              <p className="text-muted">{featured?.description || 'The featured project will appear here once one is marked as Mega Project in CRM.'}</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <span className="pill" style={{ background: 'rgba(15,106,115,0.08)', color: 'var(--primary-strong)' }}>
                  {featured?.category || 'Featured'}
                </span>
                <span className="pill" style={{ background: 'rgba(253,188,19,0.18)', color: 'var(--accent-ink)' }}>
                  {featured?.systemSizeKw ? `${featured.systemSizeKw} kW` : '—'}
                </span>
              </div>
              <div style={{ marginTop: 8 }}>
                <Button to={featured?._id ? `/projects/${featured._id}` : '/projects'} variant="secondary">
                  View Case Study
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </div>
          </motion.article>
        ) : null}

        {megaGridProjects.length > 0 ? (
          <motion.div
            className={`project-grid block ${megaGridProjects.length <= 2 ? 'project-grid--center' : ''}`}
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            style={{ marginBottom: 28 }}
          >
            {megaGridProjects.map((project) => (
              <motion.article key={project._id || project.title} className="project-card card-hover" variants={staggerItem}>
                <div className="project-card__media card-media">
                  <ImageCard src={project.imageUrl || project.image} alt={project.projectName || project.title} height="h-56" />
                  <div className="pill" style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.88)' }}>
                    Mega Project
                  </div>
                </div>
                <div className="project-card__body">
                  <h3 className="project-card__title">{project.projectName || project.title}</h3>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--muted)', marginBottom: 16 }}>
                    <MapPin size={16} />
                    {project.location}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid rgba(15,106,115,0.12)' }}>
                    <div>
                      <div style={{ fontSize: '.78rem', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)', fontWeight: 800, whiteSpace: 'nowrap' }}>
                        System Size
                      </div>
                      <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.1rem', color: 'var(--primary-strong)', fontWeight: 800 }}>
                        {project.systemSizeKw ? `${project.systemSizeKw} kW` : project.size}
                      </div>
                    </div>
                    <Button
                      to={project._id ? `/projects/${project._id}` : '/projects'}
                      variant="secondary"
                      className="project-card__cta"
                      aria-label={`Open ${project.projectName || project.title} case study`}
                    >
                      <ArrowRight size={18} />
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : null}

        <motion.div
          className={`project-grid block ${visibleProjects && visibleProjects.length <= 2 ? 'project-grid--center' : ''}`}
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {visibleProjects?.length > 0 ? visibleProjects.map((project) => (
            <motion.article key={project._id || project.title} className="project-card card-hover" variants={staggerItem}>
              <div className="project-card__media card-media">
                <ImageCard src={project.imageUrl || project.image} alt={project.projectName || project.title} height="h-56" />
                <div className="pill" style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.88)' }}>
                  {project.category}
                </div>
              </div>
              <div className="project-card__body">
                <h3 className="project-card__title">{project.projectName || project.title}</h3>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--muted)', marginBottom: 16 }}>
                  <MapPin size={16} />
                  {project.location}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid rgba(15,106,115,0.12)' }}>
                  <div>
                    <div style={{ fontSize: '.78rem', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)', fontWeight: 800, whiteSpace: 'nowrap' }}>
                      System Size
                    </div>
                    <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.1rem', color: 'var(--primary-strong)', fontWeight: 800 }}>
                      {project.systemSizeKw ? `${project.systemSizeKw} kW` : project.size}
                    </div>
                  </div>
                  <Button
                    to={project._id ? `/projects/${project._id}` : '/projects'}
                    variant="secondary"
                    className="project-card__cta"
                    aria-label={`Open ${project.projectName || project.title} case study`}
                  >
                    <ArrowRight size={18} />
                  </Button>
                </div>
              </div>
            </motion.article>
          )) : !hasProjectsToRender ? (
            <div className="panel" style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>
              No projects available right now.
            </div>
          ) : null}
        </motion.div>

        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <Button to="/contact" variant="secondary">
            Start a Similar Project
          </Button>
        </div>
      </div>
    </motion.section>
  );
}

export default memo(ProjectsSection);
