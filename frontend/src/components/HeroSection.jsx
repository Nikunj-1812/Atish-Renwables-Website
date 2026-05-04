import { motion } from 'framer-motion';
import { ArrowDownToLine, ArrowRight, SunMedium } from 'lucide-react';
import Button from './Button';
import CountUp from './CountUp';
import { fadeUp, floatingIcon, heroStagger, sectionMotion, staggerContainer, staggerItem } from '../utils/motion';

export default function HeroSection({
  eyebrow,
  title,
  copy,
  image,
  actions = [],
  stats = [],
}) {
  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true">
        <img
          alt="Solar installation"
          src={image}
          loading="lazy"
          style={{ objectPosition: 'center' }}
          onError={(e) => {
            // fallback to an inline SVG if remote image is blocked or fails
            e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"><rect width="100%" height="100%" fill="%23005058"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="36" fill="%23fff">Image unavailable</text></svg>';
            e.currentTarget.style.objectFit = 'cover';
          }}
        />
        <div className="hero__orb hero__orb--one" />
        <div className="hero__orb hero__orb--two" />
        <motion.svg
          className="hero__energy-line"
          viewBox="0 0 960 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <motion.path
            d="M24 164C126 70 256 52 360 104C456 152 535 188 655 156C775 124 844 68 936 36"
            stroke="rgba(255,255,255,0.26)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="10 12"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.8, ease: 'easeOut', delay: 0.35 }}
          />
        </motion.svg>
        <div className="hero__animated" aria-hidden="true" />
        <div className="hero__overlay" />
      </div>

      <div className="container">
        <motion.div className="hero__content" variants={heroStagger} initial="hidden" animate="show" {...sectionMotion}>
          <motion.div className="hero__intro-copy" variants={staggerContainer}>
            {eyebrow ? <span className="section-eyebrow" style={{ color: '#ffd768' }}>{eyebrow}</span> : null}
            <motion.h1 className="hero__headline" variants={fadeUp} transition={{ duration: 0.55, ease: 'easeOut' }}>
              {title}
            </motion.h1>

            <motion.p className="hero__tagline" variants={fadeUp} transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}>
              <motion.span className="icon-sun" aria-hidden="true" {...floatingIcon}>
                <SunMedium size={18} />
              </motion.span>
              Raise Your Green Energy
            </motion.p>

            <motion.p className="hero__copy" variants={fadeUp} transition={{ duration: 0.48, ease: 'easeOut', delay: 0.08 }}>
              {copy}
            </motion.p>

            {actions.length > 0 ? (
              <div className="hero__actions">
                {actions.map((action) => (
                  <motion.div key={action.label} variants={fadeUp} transition={{ duration: 0.35, ease: 'easeOut' }}>
                    <Button
                      to={action.to}
                      href={action.href}
                      download={action.download}
                      variant={action.variant ?? 'primary'}
                    >
                      {action.label}
                      {action.icon === 'arrow' ? <ArrowRight size={16} /> : null}
                      {action.icon === 'download' ? <ArrowDownToLine size={16} /> : null}
                    </Button>
                  </motion.div>
                ))}
              </div>
            ) : null}
          </motion.div>

          {stats.length > 0 ? (
            <motion.div className="hero__stats" variants={staggerContainer} initial="hidden" animate="show">
              {stats.map((stat) => (
                <motion.div key={stat.label} className="hero-stat" variants={staggerItem}>
                  <strong><CountUp value={stat.value} /></strong>
                  <span>{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
