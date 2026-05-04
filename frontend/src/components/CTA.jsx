import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './Button';
import { hoverLift } from '../utils/motion';

export default function CTA() {
  // Prefer a local image at /ready-hero.png if present; otherwise leave layout unchanged
  const localImage = '/ready-hero.png';
  const style = {
    background: 'linear-gradient(135deg, #005058, #0f6a73 56%, #3f4b43)'
  };

  try {
    // in browser this will always succeed; during build the file may 404 — we rely on browser fallback
    const img = new Image();
    img.src = localImage;
    img.onload = () => {
      // apply background image only if loaded successfully
      style.background = `url(${localImage}), linear-gradient(135deg, #005058, #0f6a73 56%, #3f4b43)`;
      style.backgroundSize = 'cover';
      style.backgroundPosition = 'center';
    };
  } catch (e) {
    // ignore
  }

  return (
    <section className="cta">
      <div className="container">
        <motion.div className="cta__card" style={style} {...hoverLift}>
          <div className="cta__bg" aria-hidden="true">
            <svg className="cta__bg-wave cta__bg-wave--left" viewBox="0 0 520 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M-8 110C72 60 158 46 244 78C328 110 398 154 478 150C520 148 552 134 586 114V304H-8V110Z"
                fill="url(#ctaWaveLeftFill)"
              />
              <path
                d="M6 148C88 102 166 98 244 124C326 150 392 192 474 194C526 196 568 176 606 154"
                stroke="url(#ctaWaveLeftStroke)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="ctaWaveLeftFill" x1="-8" y1="78" x2="520" y2="200" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#E8F5E9" stopOpacity="0.26" />
                  <stop offset="0.55" stopColor="#0F6A73" stopOpacity="0.16" />
                  <stop offset="1" stopColor="#F4B400" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="ctaWaveLeftStroke" x1="0" y1="130" x2="590" y2="174" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#E8F5E9" stopOpacity="0.34" />
                  <stop offset="0.55" stopColor="#0F6A73" stopOpacity="0.2" />
                  <stop offset="1" stopColor="#F4B400" stopOpacity="0.14" />
                </linearGradient>
              </defs>
            </svg>

            <svg className="cta__bg-wave cta__bg-wave--right" viewBox="0 0 560 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M-26 146C62 94 152 74 248 96C338 118 410 164 498 174C552 180 604 172 658 146V306H-26V146Z"
                fill="url(#ctaWaveRightFill)"
              />
              <path
                d="M-6 168C82 120 164 108 248 130C332 152 404 194 490 202C544 206 594 192 650 164"
                stroke="url(#ctaWaveRightStroke)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="ctaWaveRightFill" x1="-20" y1="100" x2="560" y2="210" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0F6A73" stopOpacity="0.2" />
                  <stop offset="0.62" stopColor="#E8F5E9" stopOpacity="0.18" />
                  <stop offset="1" stopColor="#F4B400" stopOpacity="0.12" />
                </linearGradient>
                <linearGradient id="ctaWaveRightStroke" x1="-6" y1="148" x2="640" y2="200" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0F6A73" stopOpacity="0.24" />
                  <stop offset="0.58" stopColor="#E8F5E9" stopOpacity="0.22" />
                  <stop offset="1" stopColor="#F4B400" stopOpacity="0.18" />
                </linearGradient>
              </defs>
            </svg>

            <div className="cta__bg-glow" />
          </div>

          <div className="cta__inner">
            <div>
              <p className="section-eyebrow" style={{ color: 'rgba(255,255,255,0.78)' }}>
                Start your solar transition
              </p>
              <h2 className="cta__title">Ready to Switch to Solar?</h2>
              <p className="cta__tagline">Raise Your Green Energy Today</p>
              <p className="cta__copy">
                Join businesses and homeowners already lowering energy costs with reliable EPC delivery,
                precision engineering, and a long-term support mindset.
              </p>
            </div>

            <Button to="/contact" variant="accent">
              Get Free Quote
              <ArrowRight size={16} />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
