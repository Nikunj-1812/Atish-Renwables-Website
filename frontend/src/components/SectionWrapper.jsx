import React from 'react';
import { motion } from 'framer-motion';
import { sectionMotion } from '../utils/motion';

export default function SectionWrapper({ children, className = 'section' }) {
  return (
    <motion.section className={className} {...sectionMotion}>
      <div className="container">{children}</div>
    </motion.section>
  );
}
