import { AnimatePresence, motion } from 'framer-motion';
import { pageMotion } from './utils/motion';
import { useEffect, useState } from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Services from './pages/Services';
import Projects from './pages/Projects';
import CalculatorPage from './pages/Calculator';
import Contact from './pages/Contact';
import About from './pages/About';
import introLogo from './assets/mainlogo.png';

function Layout() {
  const location = useLocation();
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowIntro(false), 2050);
    return () => window.clearTimeout(timer);
  }, []);

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
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={introLogo}
              alt="ATISH RENEWABLES"
              className="intro-overlay__logo"
              initial={{ scale: 0.9, opacity: 0, filter: 'blur(0px) brightness(1)' }}
              animate={{
                scale: [0.9, 1, 1.2, 1.7],
                opacity: [0, 1, 1, 0],
                filter: [
                  'blur(0px) brightness(1)',
                  'blur(0px) brightness(1)',
                  'blur(6px) brightness(1.05)',
                  'blur(16px) brightness(1)',
                ],
              }}
              transition={{ duration: 1.75, delay: 0.25, ease: [0.4, 0, 0.2, 1], times: [0, 0.35, 0.68, 1] }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: showIntro ? 0 : 1 }} transition={{ duration: 0.7, ease: 'easeOut', delay: showIntro ? 0 : 0.05 }}>
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={pageMotion.initial}
            animate={pageMotion.animate}
            exit={pageMotion.exit}
            transition={pageMotion.transition}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
        <CTA />
        <Footer />
      </motion.div>
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
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
}
