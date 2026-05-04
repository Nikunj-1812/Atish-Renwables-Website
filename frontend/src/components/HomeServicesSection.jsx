import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BriefcaseBusiness, Factory, Home } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Button from './Button';
import { hoverLift, mediaHover, sectionMotion, staggerContainer, staggerItem } from '../utils/motion';

const services = [
  {
    icon: Factory,
    title: 'Industrial EPC',
    text: 'Utility-scale solar power plants designed for maximum yield and grid stability.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAwM_Mqc0AAQaRfeS18-Lq4x_o0lw5LTabJz-NwU0vvIfaACZC6HApza0NaGQNaDd_Ai5RbbcrjMZ60tDZKKpJoT13v3an5YXWIiNdwlXpFhTDnMlR058MuNuvxTeTJog6o0YO6i1tDD6kiY32R-HMDC-H9EFNY8b2wF8eatFleOYWs40U26ziUEvKA4f9PZwyaKmbPW17kMttM88DUK-9ZhMAuyWFG3NpR_da3lemfL-6qRqI1WSaMAKsxdLXvgVy_fY3onVcUupQB',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Commercial Systems',
    text: 'Tailored rooftop and carport solutions to power corporate sustainability goals.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDB7lRt-g7iAnIMZH4LCwHpVo4Mq--H1WVHLYfn5NNK71jRQ-2mD9l9nqVCrHX1LTr_SMbzvBBOHBq8vjvJwCcM3BUC8TZvAdyt80WINmmF5JEZSnD5t9SMnn3fibBbJ46AoXdDV0kKombKgARmNf_Ly20RCfkqAN9FTpiTdUAE-9S6ZbUT1ssZCc87xijmPLBHI6M5TZCxb9qLTiq4x2V9VoNslgRk5FR_1j_4FipJ4Xnbud33UFJ8cplMM_w2RAEBsYW4mP9L0tWT',
  },
  {
    icon: Home,
    title: 'Residential Solar',
    text: 'Premium home solar integrations designed for aesthetic appeal and efficiency.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAAdypSsqvgU_hQBlFLfBfCCw5Sb4JGDUaGwUr-Ocy3Ix45XWDq-TMH7KohGI4rAlG9h6kVa37LLFWbpKOGUroT6VvXHT0gKyealMMBOxegfWdjKKdB7M21MDiCnVa1MuNjpcZ3sr41eBZXj4EBwWnNV0k8C8fXhUADvGq_-TEd4iUIB8BiQyGwowfYe9Zw6oOu9nGMdgfgPyNnW0-rqT7F_O8wOnR5Qu5gwyyNSURYQOTQq6zte4rThldeV6y_gK5CmBHLC1rTrcrN',
  },
];

function HomeServicesSection() {
  return (
    <motion.section className="section" {...sectionMotion}>
      <div className="container">
        <SectionHeading eyebrow="Services" title="Our Solar Services" />

        <motion.div
          className="service-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {services.map((service) => (
            <motion.article key={service.title} className="service-card card-hover" variants={staggerItem} {...hoverLift}>
              <motion.div className="service-card__media card-media" {...mediaHover}>
                <img alt={service.title} src={service.image} loading="lazy" />
              </motion.div>
              <div className="service-card__body">
                <span className="pill" style={{ background: 'rgba(253,188,19,0.14)', color: 'var(--accent-ink)' }}>
                  <service.icon size={16} />
                  Service
                </span>
                <h3 className="service-card__title">{service.title}</h3>
                <p className="text-muted">{service.text}</p>
                <div style={{ marginTop: 14 }}>
                  <Button to="/services" variant="secondary">
                    Explore
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default memo(HomeServicesSection);
