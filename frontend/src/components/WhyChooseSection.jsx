import { motion } from 'framer-motion';
import { Gauge, Wrench, LifeBuoy, Wallet } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { hoverLift, sectionMotion, staggerContainer, staggerItem } from '../utils/motion';

const items = [
  {
    icon: Gauge,
    title: 'High Efficiency Systems',
    text: 'Maximizing energy output with cutting-edge photovoltaic technology.',
  },
  {
    icon: Wrench,
    title: 'Expert Engineering',
    text: 'Precision design and structural integrity for lasting performance.',
  },
  {
    icon: LifeBuoy,
    title: 'Reliable Support',
    text: 'Comprehensive O&M support to keep your systems running optimally.',
  },
  {
    icon: Wallet,
    title: 'Cost Optimization',
    text: 'Strategic planning to ensure maximum return on your solar investment.',
  },
];

export default function WhyChooseSection() {
  return (
    <motion.section className="section section--tight" {...sectionMotion}>
      <div className="container">
        <SectionHeading eyebrow="Why Choose Us" title="Why Choose Us" />

        <motion.div
          className="benefit-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {items.map((item) => (
            <motion.article key={item.title} className="panel card-hover" variants={staggerItem} style={{ padding: 24 }} {...hoverLift}>
              <div className="icon-badge icon-badge--accent" style={{ marginBottom: 16 }}>
                <item.icon size={18} />
              </div>
              <h3 className="service-card__title">{item.title}</h3>
              <p className="text-muted">{item.text}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
