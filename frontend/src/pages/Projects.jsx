import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import ProjectsSection from '../components/ProjectsSection';
import Loader from '../components/Loader';
import { getProjects } from '../utils/api';

export default function Projects() {
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProjects = async () => {
      try {
        const response = await getProjects();
        const projectsData = response?.data?.projects || response?.projects || [];
        if (mounted) {
          // Spread into a new array so React.memo always detects the change
          setProjects([...projectsData]);
        }
      } catch (error) {
        console.error('Projects fetch error:', error);
        if (mounted) {
          setProjects([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    const refreshOnFocus = () => {
      loadProjects();
    };

    // Auto-refresh every 3s so CRM changes show up quickly.
    const interval = setInterval(loadProjects, 3000);
    window.addEventListener('focus', refreshOnFocus);

    return () => {
      mounted = false;
      clearInterval(interval);
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
