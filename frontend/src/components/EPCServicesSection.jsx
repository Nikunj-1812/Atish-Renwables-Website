import React, { memo } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Zap,
  MapPin,
  PenTool,
  ShoppingCart,
  Wrench,
  BarChart3,
  Users,
  Cog,
  CheckCircle2,
} from 'lucide-react';
import SectionHeading from './SectionHeading';
import { sectionMotion, staggerContainer, staggerItem } from '../utils/motion';

const defaultEpcServices = [
  {
    id: 1,
    title: 'Turnkey Solar EPC Services',
    description:
      'Complete end-to-end solar power plant execution with integrated engineering, procurement, and commissioning for industrial, commercial, and residential projects.',
    icon: Settings,
  },
  {
    id: 2,
    title: 'EPC Solutions for Renewable Energy Projects',
    description:
      'Specialized engineering and project management for utility-scale and distributed renewable energy installations with transparent cost and timeline delivery.',
    icon: Zap,
  },
  {
    id: 3,
    title: 'Solar Feasibility Study & Site Assessment',
    description:
      'Comprehensive on-site evaluation covering solar potential, shading analysis, structural assessment, and economic viability for informed project planning.',
    icon: MapPin,
  },
  {
    id: 4,
    title: 'Solar Design and Engineering Services',
    description:
      'Custom system design optimized for energy yield, grid compliance, and structural safety with detailed technical specifications and compliance documentation.',
    icon: PenTool,
  },
  {
    id: 5,
    title: 'Procurement Services',
    description:
      'Strategic sourcing and procurement of quality solar equipment, inverters, balance-of-system components with supplier management and warranty coordination.',
    icon: ShoppingCart,
  },
  {
    id: 6,
    title: 'Construction Management',
    description:
      'Professional project management covering site coordination, quality assurance, safety protocols, and timely execution of installation and commissioning.',
    icon: Wrench,
  },
  {
    id: 7,
    title: 'Solar Plant Operation and Maintenance',
    description:
      'Scheduled preventive maintenance, performance optimization, and corrective services to ensure peak system efficiency and longevity.',
    icon: CheckCircle2,
  },
  {
    id: 8,
    title: 'Solar Performance Monitoring and Reporting',
    description:
      'Real-time monitoring dashboards, performance analytics, and detailed monthly/annual reports to track system health and energy production.',
    icon: BarChart3,
  },
  {
    id: 9,
    title: 'Training and Support',
    description:
      'Comprehensive operator training, troubleshooting guides, technical support, and regular maintenance workshops for long-term system reliability.',
    icon: Users,
  },
  {
    id: 10,
    title: 'Customized Turnkey Solar Solutions',
    description:
      'Tailored solar solutions designed to meet specific project requirements, regulatory compliance, and financial objectives for maximum ROI.',
    icon: Cog,
  },
];

function EPCServicesSection({ servicesData }) {
  const epcServices = Array.isArray(servicesData) && servicesData.length > 0
    ? servicesData.map((service, index) => ({
        ...defaultEpcServices[index % defaultEpcServices.length],
        ...service,
        icon: defaultEpcServices[index % defaultEpcServices.length].icon,
        id: service.id || index + 1,
      }))
    : defaultEpcServices;
  const visibleServices = epcServices?.length > 0 ? epcServices : [];

  return (
    <motion.section className="section" {...sectionMotion}>
      <div className="container">
        <SectionHeading
          eyebrow="Our Solutions"
          title="Our Solar EPC Services"
          copy="End-to-end solar solutions designed for efficiency, reliability, and long-term performance."
        />
        <motion.div
          className="epc-services-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {visibleServices.length > 0 ? visibleServices.map((service) => {
            const IconComponent = service.icon;
            return (
              <motion.article key={service.id} className="epc-service-card card-hover" variants={staggerItem}>
                <div className="epc-service-card__icon">
                  <IconComponent size={32} />
                </div>
                <h3 className="epc-service-card__title">{service.title}</h3>
                <p className="epc-service-card__description">{service.description}</p>
              </motion.article>
            );
          }) : (
            <p style={{ margin: 0, color: 'var(--muted)' }}>No services found</p>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default memo(EPCServicesSection);
