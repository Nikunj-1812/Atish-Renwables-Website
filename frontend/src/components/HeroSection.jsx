import { motion } from 'framer-motion';
import { ArrowDownToLine, ArrowRight } from 'lucide-react';
import Button from './Button';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function HeroSection({
  eyebrow,
  title,
  copy,
  image,
  actions = [],
  stats = [],
  priority = true,
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
      </div>

      <div className="container">
        <motion.div
          className="hero__content"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="hero__intro-copy" variants={staggerContainer}>
            {eyebrow ? (
              <motion.span className="section-eyebrow" style={{ color: '#ffd768' }} variants={fadeUp}>
                {eyebrow}
              </motion.span>
            ) : null}
            <motion.h1 className="hero__headline" variants={fadeUp}>
              {title}
            </motion.h1>

            <motion.p className="hero__copy" variants={fadeUp}>
              {copy}
            </motion.p>

            {actions.length > 0 ? (
              <motion.div className="hero__actions" variants={fadeUp}>
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
              </motion.div>
            ) : null}
          </motion.div>

          {stats.length > 0 ? (
            <motion.div className="hero__stats" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
              {stats.map((stat) => (
                <motion.div key={stat.label} className="hero-stat" variants={staggerItem}>
                  <strong>{stat.value}</strong>
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
