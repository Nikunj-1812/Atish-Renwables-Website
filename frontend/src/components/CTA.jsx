import { ArrowRight, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './Button';
import { hoverLift } from '../utils/motion';

const PHONE_NUMBER = 'tel:+916359260330';
const PHONE_DISPLAY = '+91 63592 60330';

// Subtle pulse ring for the call button
const pulseVariants = {
  animate: {
    scale: [1, 1.18, 1],
    opacity: [0.55, 0, 0.55],
    transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
  },
};

// Stagger children into view
const innerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export default function CTA() {
  const cardStyle = {
    background: 'linear-gradient(135deg, #005058, #0f6a73 56%, #3f4b43)',
  };

  return (
    <section className="cta">
      <div className="container">
        <motion.div className="cta__card" style={cardStyle} {...hoverLift}>
          {/* Decorative background waves */}
          <div className="cta__bg" aria-hidden="true">
            <svg className="cta__bg-wave cta__bg-wave--left" viewBox="0 0 520 300" fill="none">
              <path d="M-8 110C72 60 158 46 244 78C328 110 398 154 478 150C520 148 552 134 586 114V304H-8V110Z" fill="url(#ctaWL)" />
              <path d="M6 148C88 102 166 98 244 124C326 150 392 192 474 194C526 196 568 176 606 154" stroke="url(#ctaWLS)" strokeWidth="3" strokeLinecap="round" />
              <defs>
                <linearGradient id="ctaWL" x1="-8" y1="78" x2="520" y2="200" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#E8F5E9" stopOpacity="0.26" />
                  <stop offset="0.55" stopColor="#0F6A73" stopOpacity="0.16" />
                  <stop offset="1" stopColor="#F4B400" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="ctaWLS" x1="0" y1="130" x2="590" y2="174" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#E8F5E9" stopOpacity="0.34" />
                  <stop offset="0.55" stopColor="#0F6A73" stopOpacity="0.2" />
                  <stop offset="1" stopColor="#F4B400" stopOpacity="0.14" />
                </linearGradient>
              </defs>
            </svg>

            <svg className="cta__bg-wave cta__bg-wave--right" viewBox="0 0 560 300" fill="none">
              <path d="M-26 146C62 94 152 74 248 96C338 118 410 164 498 174C552 180 604 172 658 146V306H-26V146Z" fill="url(#ctaWR)" />
              <path d="M-6 168C82 120 164 108 248 130C332 152 404 194 490 202C544 206 594 192 650 164" stroke="url(#ctaWRS)" strokeWidth="3" strokeLinecap="round" />
              <defs>
                <linearGradient id="ctaWR" x1="-20" y1="100" x2="560" y2="210" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0F6A73" stopOpacity="0.2" />
                  <stop offset="0.62" stopColor="#E8F5E9" stopOpacity="0.18" />
                  <stop offset="1" stopColor="#F4B400" stopOpacity="0.12" />
                </linearGradient>
                <linearGradient id="ctaWRS" x1="-6" y1="148" x2="640" y2="200" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0F6A73" stopOpacity="0.24" />
                  <stop offset="0.58" stopColor="#E8F5E9" stopOpacity="0.22" />
                  <stop offset="1" stopColor="#F4B400" stopOpacity="0.18" />
                </linearGradient>
              </defs>
            </svg>

            <div className="cta__bg-glow" />
          </div>

          {/* Content */}
          <motion.div
            className="cta__inner"
            variants={innerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
          >
            <motion.div variants={itemVariants}>
              <p className="section-eyebrow" style={{ color: 'rgba(255,255,255,0.78)' }}>
                Start your solar transition
              </p>
              <h2 className="cta__title">Ready to Switch to Solar?</h2>
              <p className="cta__tagline">Raise Your Green Energy Today</p>
              <p className="cta__copy">
                Join businesses and homeowners already lowering energy costs with reliable EPC delivery,
                precision engineering, and a long-term support mindset.
              </p>
            </motion.div>

            {/* CTA buttons */}
            <motion.div className="cta__actions" variants={itemVariants}>
              {/* Get Free Quote */}
              <motion.div
                whileHover={{ scale: 1.045, y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 340, damping: 22 }}
              >
                <Button to="/contact" variant="accent" className="cta__btn-quote">
                  Get Free Quote
                  <ArrowRight size={16} />
                </Button>
              </motion.div>

              {/* Call Now */}
              <motion.div
                className="cta__call-wrap"
                whileHover={{ scale: 1.045, y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 340, damping: 22 }}
              >
                {/* Pulse ring */}
                <motion.span
                  className="cta__call-pulse"
                  variants={pulseVariants}
                  animate="animate"
                  aria-hidden="true"
                />
                <a
                  href={PHONE_NUMBER}
                  className="cta__btn-call"
                  aria-label={`Call us at ${PHONE_DISPLAY}`}
                >
                  <Phone size={17} />
                  Call Now
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
