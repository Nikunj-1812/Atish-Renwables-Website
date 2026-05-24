import { ArrowDownToLine, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './Button';

// Stagger animation for stat cards
const statsContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.55 } },
};

const statItem = {
  hidden: { opacity: 0, y: 20, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function HeroSection({
  eyebrow,
  title,
  copy,
  image,
  actions = [],
  stats = [],
  priority = false,
  isHomePage = false,
}) {
  return (
    <section className={`hero ${isHomePage ? 'hero--home' : 'hero--page'}`}>
      <div className="hero__bg" aria-hidden="true">
        <img
          alt="Solar installation"
          src={image}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'low'}
          decoding="async"
          style={{ objectPosition: 'center' }}
        />
        <div className="hero__overlay" aria-hidden="true" />
      </div>

      <div className="container">
        <div className="hero__content" role="region" aria-label="Hero content">
          <div className="hero__intro-copy">
            {eyebrow ? (
              <span className="section-eyebrow hero__eyebrow">{eyebrow}</span>
            ) : null}

            <h1 className="hero__headline">{title}</h1>
            <p className="hero__copy">{copy}</p>

            {actions.length > 0 ? (
              <div className="hero__actions">
                {actions.map((action) => (
                  <Button
                    key={action.label}
                    to={action.to}
                    href={action.href}
                    download={action.download}
                    variant={action.variant ?? 'primary'}
                  >
                    {action.label}
                    {action.icon === 'arrow' ? <ArrowRight size={16} /> : null}
                    {action.icon === 'download' ? <ArrowDownToLine size={16} /> : null}
                  </Button>
                ))}
              </div>
            ) : null}
          </div>

          {stats.length > 0 ? (
            <motion.div
              className="hero__stats"
              variants={statsContainer}
              initial="hidden"
              animate="show"
            >
              {stats.map((stat) => (
                  <motion.div
                    key={stat.label}
                    className="hero-stat"
                    variants={statItem}
                    whileHover={{
                      y: -5,
                      scale: 1.04,
                      transition: { type: 'spring', stiffness: 320, damping: 20 },
                    }}
                  >
                    <strong className="hero-stat__value">{stat.value}</strong>
                    <span className="hero-stat__label">{stat.label}</span>
                  </motion.div>
              ))}
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
