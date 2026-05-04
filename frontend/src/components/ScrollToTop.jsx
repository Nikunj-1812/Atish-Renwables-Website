import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    // Use multiple approaches to ensure scroll happens:
    // 1. Immediate scroll
    window.scrollTo(0, 0);
    
    // 2. requestAnimationFrame for DOM updates
    const raf = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}
