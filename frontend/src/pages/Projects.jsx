import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import ProjectsSection from '../components/ProjectsSection';
import Loader from '../components/Loader';
import { getProjects } from '../utils/api';
import { projects as fallbackProjects } from '../data/siteData';

export default function Projects() {
  const [projects, setProjects] = useState(() => {
    try {
      const cached = localStorage.getItem('atish_projects');
      return cached ? JSON.parse(cached) : fallbackProjects;
    } catch {
      return fallbackProjects;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadProjects = async () => {
      try {
        const response = await getProjects();
        const projectsData = response?.data?.projects || response?.projects || [];
        if (mounted && projectsData.length > 0) {
          setProjects([...projectsData]);
          try {
            localStorage.setItem('atish_projects', JSON.stringify(projectsData));
          } catch (e) {}
        }
      } catch (error) {
        // silently use cached/fallback data
      }
    };

    loadProjects();

    const refreshOnFocus = () => { loadProjects(); };
    window.addEventListener('focus', refreshOnFocus);

    return () => {
      mounted = false;
      window.removeEventListener('focus', refreshOnFocus);
    };
  }, []);


  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1], delay: 0.08 }}
    >
      <HeroSection
        eyebrow="Portfolio"
        title="Our solar projects"
        copy="A curated look at installations delivered for industrial, commercial, and residential clients across India."
        image="/projects.webp"
        isHomePage={false}
      />
      <div className="content-area-wrapper" style={{ minHeight: '100vh' }}>
        {loading || !projects ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Loader fullPage label="Loading projects" />
          </div>
        ) : (
          <ProjectsSection projectData={projects} />
        )}
      </div>
    </motion.div>
  );
}
