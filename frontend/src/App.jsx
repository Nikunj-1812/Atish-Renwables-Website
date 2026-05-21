import { AnimatePresence, motion } from 'framer-motion';
import { pageMotion } from './utils/motion';
import { useEffect, useState } from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import ScrollToTop from './components/ScrollToTop';
import Loader from './components/Loader';
import React, { Suspense, lazy } from 'react';

const pages = {
  '/': () => import('./pages/Home'),
  '/services': () => import('./pages/Services'),
  '/projects': () => import('./pages/Projects'),
  '/calculator': () => import('./pages/Calculator'),
  '/contact': () => import('./pages/Contact'),
  '/about': () => import('./pages/About'),
};

const Home = lazy(pages['/']);
const Services = lazy(pages['/services']);
const Projects = lazy(pages['/projects']);
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const CalculatorPage = lazy(pages['/calculator']);
const Contact = lazy(pages['/contact']);
const About = lazy(pages['/about']);

export const prefetchRoute = (path) => {
  if (pages[path]) {
    pages[path]();
  }
};
import introLogo from './assets/mainlogo.webp';

function Layout() {
  const location = useLocation();
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowIntro(false), 5200);
    return () => window.clearTimeout(timer);
  }, []);

  // Prevent background scroll/interactions while intro overlay is active
  useEffect(() => {
    if (showIntro) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
    return undefined;
  }, [showIntro]);

  // Disable browser scroll restoration for manual control
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <div className="app-shell">
      <ScrollToTop />
      <AnimatePresence>
        {showIntro ? (
          <motion.div
            className="intro-overlay"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
          >
            {/* Subtle background pulse ring */}
            <motion.div
              className="intro-overlay__ring"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.6, 1.4], opacity: [0.18, 0] }}
              transition={{ duration: 2.8, delay: 0.6, ease: 'easeOut', repeat: 1, repeatDelay: 0.4 }}
            />

            {/* Logo — fade in, hold, gentle scale, fade out */}
            <motion.img
              src={introLogo}
              alt="Atish Renewables"
              className="intro-overlay__logo"
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.92, 1, 1, 1.06],
                y: [8, 0, 0, -4],
              }}
              transition={{
                duration: 4.2,
                delay: 0.2,
                ease: [0.4, 0, 0.2, 1],
                times: [0, 0.2, 0.72, 1],
              }}
            />

            {/* Tagline — fades in after logo */}
            <motion.p
              className="intro-overlay__tagline"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: [0, 1, 1, 0], y: [6, 0, 0, -2] }}
              transition={{
                duration: 3.6,
                delay: 0.7,
                ease: [0.4, 0, 0.2, 1],
                times: [0, 0.22, 0.72, 1],
              }}
            >
              Raise Your Green Energy
            </motion.p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="app-main-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <AnimatePresence mode="sync">
          <motion.main
            key={location.pathname}
            initial={pageMotion.initial}
            animate={pageMotion.animate}
            exit={pageMotion.exit}
            transition={pageMotion.transition}
            style={{ flex: 1, willChange: 'transform, opacity', transform: 'translateZ(0)' }}
          >
            <Suspense fallback={<Loader fullPage label="Loading..." />}>
              <Outlet />
            </Suspense>
          </motion.main>
        </AnimatePresence>
        <CTA />
        <Footer />
        <Chatbot />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId" element={<ProjectDetail />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
}
