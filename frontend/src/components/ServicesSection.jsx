import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Button from './Button';
import { processSteps, services, whyUs } from '../data/siteData';
import { sectionMotion, staggerContainer, staggerItem } from '../utils/motion';

function ServicesSection() {
  return (
    <>
      <motion.section className="section" {...sectionMotion}>
        <div className="container">
          <SectionHeading
            eyebrow="Services"
            title="Solar solutions built for every stage of your project"
            copy="From industrial EPC to commercial rooftops and premium residential systems, the delivery model stays disciplined and repeatable."
          />
 
          <motion.div className="service-grid block" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            {services.map((service) => (
              <motion.article key={service.title} className="service-card card-hover" variants={staggerItem}>
                <div className="service-card__media card-media">
                  <img alt={service.title} src={service.image} loading="lazy" />
                </div>
                <div className="service-card__body">
                  <span className="pill" style={{ background: 'rgba(15,106,115,0.08)', color: 'var(--primary-strong)', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                    <service.icon size={16} />
                    {service.tag}
                  </span>
                  <h3 className="service-card__title" style={{ marginBottom: 10 }}>{service.title}</h3>
                  <p className="text-muted" style={{ marginBottom: 20 }}>{service.text}</p>
                  <div>
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

      <motion.section className="section section--tight" {...sectionMotion}>
        <div className="container">
          <SectionHeading
            eyebrow="Process"
            title="A simple EPC flow that keeps the project moving"
            copy="Every project follows the same sequence: plan carefully, execute cleanly, and support the system after handover."
          />

          <motion.div className="process-grid block" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            {processSteps.map((step, index) => (
              <motion.article key={step.title} className="process-card card-hover" variants={staggerItem}>
                <div className="service-card__media card-media">
                  <img alt={step.title} src={step.image} loading="lazy" />
                </div>
                <div className="process-card__body">
                  <div className="icon-badge" style={{ marginBottom: 16 }}>
                    <step.icon size={18} />
                  </div>
                  <h3 className="process-card__title">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-muted">{step.text}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section className="section section--tight" {...sectionMotion}>
        <div className="container">
          <SectionHeading
            eyebrow="Why Atish"
            title="What makes the delivery model different"
            copy="The emphasis is not just on solar equipment. It is on engineering quality, execution discipline, and support that lasts."
          />

          <motion.div className="benefit-grid block" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            {whyUs.map((item) => (
              <motion.article key={item.title} className="panel card-hover" style={{ padding: 22 }} variants={staggerItem}>
                <div className="icon-badge icon-badge--accent" style={{ marginBottom: 16 }}>
                  <item.icon size={18} />
                </div>
                <h3 className="service-card__title">{item.title}</h3>
                <p className="text-muted">{item.text}</p>
                <div style={{ marginTop: 16, color: 'var(--primary-strong)', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
                  <CheckCircle2 size={16} />
                  Included in every project
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}

export default memo(ServicesSection);
