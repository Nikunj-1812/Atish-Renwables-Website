import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Button from './Button';
import { team } from '../data/siteData';
import { sectionMotion, staggerContainer, staggerItem, hoverLift } from '../utils/motion';

function TeamSection({ teamMembers }) {
  const visibleTeam = teamMembers?.length ? teamMembers : team;

  return (
    <motion.section className="section" {...sectionMotion}>
      <div className="container">
        <SectionHeading
          eyebrow="Leadership"
          title="A small team with deep EPC execution experience"
          copy="The company is led by specialists who understand design quality, delivery discipline, and what long-term support actually requires."
        />

        <motion.div className="team-grid" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          {visibleTeam.map((member) => (
            <motion.article key={member._id || member.name} className="team-card card-hover" variants={staggerItem}>
              <div className="team-card__media team-card__media--square">
                <img alt={member.name} src={member.imageUrl || member.image} loading="lazy" />
              </div>
              <div className="team-card__body">
                <h3 className="team-card__title">{member.name}</h3>
                <p className="text-muted team-card__role">{member.role}</p>
                <div className="team-card__actions">
                  <Button
                    className="team-card__btn"
                    href={member.virtualCardLink || `/vcard/${encodeURIComponent(member.name)}.vcf`}
                    variant="secondary"
                  >
                    <User size={16} />
                    View Virtual Card
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default memo(TeamSection);
