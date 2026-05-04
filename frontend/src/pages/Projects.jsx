import { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import ProjectsSection from '../components/ProjectsSection';
import Loader from '../components/Loader';
import { getProjects } from '../utils/api';
import { projects as fallbackProjects } from '../data/siteData';

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
          setProjects(fallbackProjects);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      mounted = false;
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
        <ProjectsSection projectData={projects.length > 0 ? projects : fallbackProjects} />
      )}
    </>
  );
}
