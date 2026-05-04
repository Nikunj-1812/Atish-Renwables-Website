import React, { memo } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { hoverLift, mediaHover, sectionMotion, staggerContainer, staggerItem } from '../utils/motion';

const steps = [
  {
    index: 1,
    title: 'Precision Planning',
    text: 'Custom solar designs optimized for your energy needs and site specifics.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDB7lRt-g7iAnIMZH4LCwHpVo4Mq--H1WVHLYfn5NNK71jRQ-2mD9l9nqVCrHX1LTr_SMbzvBBOHBq8vjvJwCcM3BUC8TZvAdyt80WINmmF5JEZSnD5t9SMnn3fibBbJ46AoXdDV0kKombKgARmNf_Ly20RCfkqAN9FTpiTdUAE-9S6ZbUT1ssZCc87xijmPLBHI6M5TZCxb9qLTiq4x2V9VoNslgRk5FR_1j_4FipJ4Xnbud33UFJ8cplMM_w2RAEBsYW4mP9L0tWT',
  },
  {
    index: 2,
    title: 'Seamless Execution',
    text: 'Hassle-free installations with rigorous quality checks at every stage.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAwM_Mqc0AAQaRfeS18-Lq4x_o0lw5LTabJz-NwU0vvIfaACZC6HApza0NaGQNaDd_Ai5RbbcrjMZ60tDZKKpJoT13v3an5YXWIiNdwlXpFhTDnMlR058MuNuvxTeTJog6o0YO6i1tDD6kiY32R-HMDC-H9EFNY8b2wF8eatFleOYWs40U26ziUEvKA4f9PZwyaKmbPW17kMttM88DUK-9ZhMAuyWFG3NpR_da3lemfL-6qRqI1WSaMAKsxdLXvgVy_fY3onVcUupQB',
  },
  {
    index: 3,
    title: 'Long-Term Partnership',
    text: 'Continuous monitoring and support for peak system performance.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAAdypSsqvgU_hQBlFLfBfCCw5Sb4JGDUaGwUr-Ocy3Ix45XWDq-TMH7KohGI4rAlG9h6kVa37LLFWbpKOGUroT6VvXHT0gKyealMMBOxegfWdjKKdB7M21MDiCnVa1MuNjpcZ3sr41eBZXj4EBwWnNV0k8C8fXhUADvGq_-TEd4iUIB8BiQyGwowfYe9Zw6oOu9nGMdgfgPyNnW0-rqT7F_O8wOnR5Qu5gwyyNSURYQOTQq6zte4rThldeV6y_gK5CmBHLC1rTrcrN',
  },
];

function ProcessSection() {
  return (
    <motion.section className="section" {...sectionMotion}>
      <div className="container">
        <SectionHeading
          eyebrow="Process"
          title="We Always Follow the Best Solar Ways"
          copy="We follow a complete end-to-end solar approach from detailed planning and expert execution to ongoing support."
        />

        <div className="process-rail-wrap">
          <motion.svg
            className="process-rail"
            viewBox="0 0 1200 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <motion.path
              d="M32 84C154 26 268 28 388 64C508 100 602 122 718 94C836 64 932 22 1168 40"
              stroke="rgba(15,106,115,0.22)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="14 12"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
            />
            <motion.circle cx="70" cy="82" r="10" fill="#F4B400" initial={{ scale: 0.6, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }} />
            <motion.circle cx="604" cy="82" r="10" fill="#E8F5E9" initial={{ scale: 0.6, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.25 }} />
            <motion.circle cx="1130" cy="52" r="10" fill="#F4B400" initial={{ scale: 0.6, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.35 }} />
          </motion.svg>

          <motion.div
            className="process-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
          {steps.map((step) => (
            <motion.article key={step.title} className="process-card card-hover" variants={staggerItem} {...hoverLift}>
              <motion.div className="service-card__media card-media" {...mediaHover}>
                <img alt={step.title} src={step.image} loading="lazy" />
              </motion.div>
              <div className="process-card__body">
                <div className="pill" style={{ width: 'fit-content', marginBottom: 12, background: 'rgba(15,106,115,0.08)', color: 'var(--primary-strong)' }}>
                  Step {step.index}
                </div>
                <h3 className="process-card__title">{step.title}</h3>
                <p className="text-muted">{step.text}</p>
              </div>
            </motion.article>
          ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

export default memo(ProcessSection);
