import { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import EPCServicesSection from '../components/EPCServicesSection';
import ServicesSection from '../components/ServicesSection';
import Loader from '../components/Loader';
import { getServices } from '../utils/api';
import { services as fallbackServices } from '../data/siteData';

export default function Services() {
  const [servicesData, setServicesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadServices = async () => {
      try {
        const response = await getServices();
        const nextServices = response?.data?.services || response?.services || [];
        console.log('Services:', nextServices);
        if (mounted) {
          setServicesData(nextServices.length > 0 ? nextServices : fallbackServices);
        }
      } catch (error) {
        console.error('Services fetch error:', error);
        if (mounted) {
          setServicesData(fallbackServices);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadServices();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <HeroSection
        eyebrow="Services"
        title="Our solar services"
        copy="Industrial EPC, commercial rooftops, and residential solutions designed for efficiency, reliability, and long-term savings."
        image="/service.jpg"
      />
      {loading || !servicesData ? <Loader label="Loading services" /> : <EPCServicesSection servicesData={servicesData} />}
      <ServicesSection />
    </>
  );
}
