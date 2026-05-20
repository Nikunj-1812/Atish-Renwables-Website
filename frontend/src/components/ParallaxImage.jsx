import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

export default function ParallaxImage({ src, alt = '', className = '', speed = 0.12 }) {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return undefined;

    const el = ref.current;
    if (!el) return;

    let frameId = 0;
    let active = false;

    const update = () => {
      if (!active || !el) return;

      const rect = el.getBoundingClientRect();
      const windowCenter = window.innerHeight / 2;
      const offset = (rect.top + rect.height / 2 - windowCenter) * speed;

      el.style.transform = `translate3d(0, ${offset * -1}px, 0)`;
      frameId = 0;
    };

    const requestUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active) requestUpdate();
        else if (el) el.style.transform = '';
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    requestUpdate();

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (el) el.style.transform = '';
    };
  }, [speed, shouldReduceMotion]);

  return <img ref={ref} src={src} alt={alt} className={className} loading="lazy" decoding="async" />;
}
