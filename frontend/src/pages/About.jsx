import { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import TeamSection from '../components/TeamSection';
import Loader from '../components/Loader';
import { getTeam } from '../utils/api';
import { team as fallbackTeam } from '../data/siteData';

export default function About() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadTeam = async () => {
      try {
        const response = await getTeam();
        if (mounted) {
          setTeamMembers(response?.teamMembers || []);
        }
      } catch {
        if (mounted) {
          setTeamMembers([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadTeam();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <HeroSection
        eyebrow="About"
        title="About ATISH RENEWABLES"
        copy="A modern EPC team focused on sustainable solar delivery, long-term reliability, and practical engineering discipline."
        image="/about.jpg"
      />
      <AboutSection />
      {loading ? <Loader label="Loading team" /> : <TeamSection teamMembers={teamMembers.length ? teamMembers : fallbackTeam} />}
    </>
  );
}
