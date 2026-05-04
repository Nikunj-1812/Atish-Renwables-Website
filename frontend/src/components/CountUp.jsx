import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

function parseValue(value) {
  const match = String(value).match(/([0-9,.]+)\s*(.*)/);
  if (!match) return { num: 0, suffix: String(value) };
  const raw = match[1].replace(/,/g, '');
  return { num: Number(raw), suffix: match[2] ?? '' };
}

export default function CountUp({ value = '0', duration = 1100, format = (n) => n }) {
  const { num, suffix } = parseValue(value);
  const [display, setDisplay] = useState(num ? 0 : value);
  const rafRef = useRef();
  const startRef = useRef();
  const counterRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(counterRef, { once: true, amount: 0.45 });

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplay(num ? num : value);
      return undefined;
    }

    if (!num) return setDisplay(value);
    if (!isInView) {
      setDisplay(0);
      return undefined;
    }

    startRef.current = null;
    const step = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(num * eased);
      setDisplay(current);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, num, duration, shouldReduceMotion, isInView]);

  const suffixString = suffix ? (/^[A-Za-z0-9]/.test(suffix) ? ` ${suffix}` : suffix) : '';
  return <span ref={counterRef}>{format(display)}{suffixString}</span>;
}
