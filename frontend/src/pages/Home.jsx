import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import WhyChooseSection from '../components/WhyChooseSection';
import ProcessSection from '../components/ProcessSection';
import HomeServicesSection from '../components/HomeServicesSection';
import { heroStats } from '../data/siteData';

export default function Home() {
  return (
    <>
      <HeroSection
        eyebrow="Solar EPC solutions"
        title={<>Switch to <span>Solar</span> &amp; save on electricity bills</>}
        copy="Empowering homes, businesses, and industrial facilities with high-performance solar engineering, transparent delivery, and measurable returns."
        image="/home.jpg"
        actions={[
          { label: 'Get Free Quote', to: '/contact', variant: 'primary', icon: 'arrow' },
          { label: 'Calculate Savings', to: '/calculator', variant: 'secondary' },
          { label: 'Download Brochure', href: '/assets/brochure.pdf', download: true, variant: 'secondary', icon: 'download' },
        ]}
        stats={heroStats}
      />

      <AboutSection />
      <WhyChooseSection />
      <ProcessSection />
      <HomeServicesSection />
    </>
  );
}
