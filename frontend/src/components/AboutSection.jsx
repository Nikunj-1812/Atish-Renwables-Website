import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Button from './Button';
import ParallaxImage from './ParallaxImage';
import { hoverLift, mediaHover, sectionMotion, staggerContainer, staggerItem } from '../utils/motion';
import { aboutHighlights } from '../data/siteData';

export default function AboutSection() {
  return (
    <motion.section className="section about-section" {...sectionMotion}>
      <div className="container">
        <div className="split split--2">
          <div className="about-media">
            <ParallaxImage
              alt="Solar installation"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZ6eAD7xPCgr2LLyDYLIFbNAtwM0SCtrEPKrZ8uSwDiMN2yWS1VH8a_d8Ta4LQRr_6qKHg2jGToBuIOP5CEekOxcU4kY2LT4GXzHpgLUNHhLIjvsEf1-qEOXNgt7t_TXgjEAZ9-2FhZjyp0C3DIynoF0IzxwoI0CHIi14paXb5nKq63RQEILRguDUEkZO1rWzRKASqzPaQAN5JkjFQQBxmsCXAIUychohNqC0noZIosMZSZVgN76uiLOa7us1Fk4NIbbDtSc6EtA8H"
              className="about-media__img"
            />
          </div>

          <div className="about-content">
            <SectionHeading
              align="left"
              eyebrow="About us"
              title="Building solar infrastructure with precision and care"
              copy="ATISH RENEWABLES delivers end-to-end EPC execution for homes, businesses, and industrial sites. The focus is simple: clean design, disciplined delivery, and systems that keep performing long after commissioning."
            />

            <motion.div className="stack" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
              {aboutHighlights.map((item) => (
                <motion.div key={item} className="stack-item" variants={staggerItem}>
                  <div className="stack-item__icon">
                    <CheckCircle2 size={18} />
                  </div>
                  <span>{item}</span>
                </motion.div>
              ))}
            </motion.div>

            <div style={{ marginTop: 24 }} className="about-cta">
              <Button to="/about" variant="secondary">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
