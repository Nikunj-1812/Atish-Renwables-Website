import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import EPCServicesSection from '../components/EPCServicesSection';
import ServicesSection from '../components/ServicesSection';
import Loader from '../components/Loader';
import { getServices } from '../utils/api';
import { services as fallbackServices } from '../data/siteData';
import ServiceImg from '../assets/Service.png';

export default function Services() {
  const [servicesData, setServicesData] = useState(() => {
    try {
      const cached = localStorage.getItem('atish_services');
      return cached ? JSON.parse(cached) : fallbackServices;
    } catch {
      return fallbackServices;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadServices = async () => {
      try {
        const response = await getServices();
        const nextServices = response?.data?.services || response?.services || [];
        console.log('Services:', nextServices);
        if (mounted && nextServices.length > 0) {
          setServicesData(nextServices);
          try {
            localStorage.setItem('atish_services', JSON.stringify(nextServices));
          } catch (e) {}
        }
      } catch (error) {
        console.error('Services fetch error:', error);
      }
    };

    loadServices();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1], delay: 0.08 }}
    >
      <HeroSection
        eyebrow="Services"
        title="Our solar services"
        copy="Industrial EPC, commercial rooftops, and residential solutions designed for efficiency, reliability, and long-term savings."
        image={ServiceImg}
        isHomePage={false}
      />
      <div className="content-area-wrapper" style={{ minHeight: '60vh' }}>
        {loading || !servicesData ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Loader fullPage label="Loading services" />
          </div>
        ) : (
          <EPCServicesSection servicesData={servicesData} />
        )}
      </div>
      <ServicesSection />
    </motion.div>
  );
}
