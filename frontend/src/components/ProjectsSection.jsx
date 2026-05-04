import React, { useMemo, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Button from './Button';
import { featuredProject, projectFilters, projects } from '../data/siteData';
import { sectionMotion, staggerContainer, staggerItem } from '../utils/motion';

function ProjectsSection({ projectData }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const allProjects = projectData?.length
    ? projectData
    : projects;

  const featured = allProjects.find((p) => p.isMegaProject) || featuredProject;

  const visibleProjects = useMemo(() => {
    const regularProjects = allProjects.filter((project) => !project.isMegaProject);

    if (activeFilter === 'All') {
      return regularProjects;
    }

    return regularProjects.filter(
      (project) => String(project.category || '').toLowerCase() === activeFilter.toLowerCase()
    );
  }, [activeFilter, allProjects]);

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

        <motion.article className="panel" style={{ padding: 0, overflow: 'visible', marginBottom: 28 }} {...sectionMotion}>
          <div className="split split--2" style={{ gap: 0 }}>
            <div className="media-frame media-frame--cover" style={{ minHeight: 360, borderRadius: 0 }}>
              <img
                className="media-frame__img"
                alt={featured?.projectName || featuredProject?.title}
                src={featured?.imageUrl || featuredProject?.image}
                loading="lazy"
              />
            </div>
            <div style={{ padding: 28, display: 'grid', gap: 16, alignContent: 'center' }}>
              <span className="pill" style={{ width: 'fit-content', background: 'rgba(15,106,115,0.08)', color: 'var(--primary-strong)' }}>
                <Star size={16} /> Featured Installation
              </span>
                <h3 className="section-title" style={{ textAlign: 'left', fontSize: 'clamp(1.7rem, 3vw, 2.6rem)' }}>
                {featured?.projectName || featuredProject?.title}
              </h3>
              <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center', color: 'var(--muted)' }}>
                <MapPin size={16} />
                {featured?.location || featuredProject?.location}
              </div>
              <p className="text-muted">{featured?.description || featuredProject?.text}</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <span className="pill" style={{ background: 'rgba(15,106,115,0.08)', color: 'var(--primary-strong)' }}>
                  {featured?.category || featuredProject?.category}
                </span>
                <span className="pill" style={{ background: 'rgba(253,188,19,0.18)', color: 'var(--accent-ink)' }}>
                  {featured?.systemSizeKw ? `${featured.systemSizeKw} kW` : featuredProject?.size}
                </span>
              </div>
              <div style={{ marginTop: 8 }}>
                <Button to="/projects" variant="secondary">
                  View Case Study
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        </motion.article>

        <motion.div className="project-grid block" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          {visibleProjects?.length > 0 ? visibleProjects.map((project) => (
            <motion.article key={project._id || project.title} className="project-card card-hover" variants={staggerItem}>
              <div className="project-card__media card-media">
                <img alt={project.projectName || project.title} src={project.imageUrl || project.image} loading="lazy" />
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
                    <div style={{ fontSize: '.78rem', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--muted)', fontWeight: 800 }}>
                      System Size
                    </div>
                    <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.1rem', color: 'var(--primary-strong)', fontWeight: 800 }}>
                      {project.systemSizeKw ? `${project.systemSizeKw} kW` : project.size}
                    </div>
                  </div>
                  <div className="icon-badge">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </motion.article>
          )) : (
            <div className="panel" style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>
              No projects available right now.
            </div>
          )}
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
