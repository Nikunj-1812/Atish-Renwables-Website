import HeroSection from '../components/HeroSection';
import HomeImg from '../assets/Home.png';
import AboutSection from '../components/AboutSection';
import WhyChooseSection from '../components/WhyChooseSection';
import ProcessSection from '../components/ProcessSection';
import HomeServicesSection from '../components/HomeServicesSection';
import { heroStats } from '../data/siteData';

export default function Home() {
  return (
    <>
      <HeroSection
        eyebrow="Portfolio"
        title={<>Switch to <span>Solar</span> &amp; save on electricity bills</>}
        copy="Empowering homes, businesses, and industrial facilities with high-performance solar engineering, transparent delivery, and measurable returns."
        image={HomeImg}
        isHomePage={true}
        priority={true}
        actions={[
          { label: 'Get Free Quote', to: '/contact', variant: 'primary', icon: 'arrow' },
          { label: 'Calculate Savings', to: '/calculator', variant: 'ghost' },
          { label: 'Download Brochure', href: '/assets/Atish%20Renewables%20Brochure.pdf', download: true, variant: 'ghost', icon: 'download' },
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
