const DEFAULT_DURATION = 0.7;
const DEFAULT_EASE = 'easeOut';

export const pageMotion = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: DEFAULT_DURATION, ease: DEFAULT_EASE },
};

export const sectionMotion = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: DEFAULT_DURATION, ease: DEFAULT_EASE },
};

export const heroStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: DEFAULT_DURATION, ease: DEFAULT_EASE } },
};

export const mediaHover = {
  whileHover: { scale: 1.03 },
  transition: { duration: 0.28, ease: DEFAULT_EASE },
};

export const hoverLift = {
  whileHover: { scale: 1.02, y: -4 },
  transition: { duration: 0.24, ease: DEFAULT_EASE },
};

export const buttonHover = {
  whileHover: { scale: 1.03, y: -1 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.2, ease: DEFAULT_EASE },
};

export const floatingIcon = {
  animate: {
    y: [0, -4, 0],
    rotate: [0, 3, 0],
  },
  transition: {
    duration: 6,
    repeat: Number.POSITIVE_INFINITY,
    ease: 'easeInOut',
  },
};
