import { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import TeamSection from '../components/TeamSection';
import Loader from '../components/Loader';
import { getTeam } from '../utils/api';

export default function About() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadTeam = async () => {
      try {
        const response = await getTeam();
        const teamData = response?.data?.teamMembers || response?.teamMembers || [];
        console.log('Team API response:', response);
        console.log('Team members:', teamData);
        if (mounted) {
          setTeamMembers(teamData);
        }
      } catch (error) {
        console.error('Team fetch error:', error);
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

    const refreshOnFocus = () => {
      loadTeam();
    };

    // Auto-refresh frequently so CRM changes show up quickly.
    const interval = setInterval(loadTeam, 5000);
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
        eyebrow="About"
        title="About ATISH RENEWABLES"
        copy="A modern EPC team focused on sustainable solar delivery, long-term reliability, and practical engineering discipline."
        image="/about.jpg"
      />
      <AboutSection />
      {loading ? <Loader label="Loading team" /> : <TeamSection teamMembers={teamMembers} />}
    </>
  );
}
