import { useEffect, useState } from 'react';
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
        console.log('Projects:', projectsData);
        if (mounted) {
          setProjects(projectsData);
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

    // Auto-refresh frequently so CRM changes show up quickly.
    const interval = setInterval(loadProjects, 5000);
    window.addEventListener('focus', refreshOnFocus);

    return () => {
      mounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', refreshOnFocus);
    };
  }, []);


  return (
    <>
      <HeroSection
        eyebrow="Portfolio"
        title="Our solar projects"
        copy="A curated look at installations delivered for industrial, commercial, and residential clients across India."
        image="/projects.jpg"
      />
      {loading || !projects ? (
        <Loader label="Loading projects" />
      ) : (
        <ProjectsSection projectData={projects} />
      )}
    </>
  );
}
