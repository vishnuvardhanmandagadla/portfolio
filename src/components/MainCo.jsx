import React, { useEffect, useRef, useState, useCallback, memo, useMemo } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LocomotiveScrollProvider, useLocomotiveScroll } from 'react-locomotive-scroll';
import Navbar from './Navbar';
import Hero from './Hero';
import WhatIDo from './WhatIDo';
// Lazy load heavy components for better initial load performance
const BioSection = React.lazy(() => import('./BioSection'));
const Skills = React.lazy(() => import('./Skills'));
const Projects = React.lazy(() => import('./Projects'));
const Contact = React.lazy(() => import('./Contacts'));
const World3D = React.lazy(() => import('./3d/World3D'));
const Footer = React.lazy(() => import('./Footer'));
const MouseFollower = React.lazy(() => import("./MouseFollower"));
const Vido = React.lazy(() => import("./video"));

// Loading fallback component
const SectionLoader = () => (
  <div style={{ 
    minHeight: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    opacity: 0.5
  }} />
);

// Portfolio Sections Component - Contains all portfolio content
const PortfolioSections = memo(({ containerRef, scrollTarget, instantScroll, onScrollComplete, isLoaderDone }) => {
  const { scroll } = useLocomotiveScroll();
  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    // Debounce resize handler for better performance
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setDeviceType(window.innerWidth < 768 ? 'mobile' : 'desktop');
        if (scroll && typeof scroll.update === 'function') {
          setTimeout(() => scroll.update(), 100);
        }
      }, 150);
    };
    
    setDeviceType(window.innerWidth < 768 ? 'mobile' : 'desktop');
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [scroll]);

  // Initialize scroll and update on mount/device change
  useEffect(() => {
    if (!scroll) return;

    const initTimeout = setTimeout(() => {
      if (scroll && typeof scroll.update === 'function') {
        scroll.update();
      }
    }, 200);

    return () => {
      clearTimeout(initTimeout);
    };
  }, [scroll, deviceType]);

  // Update scroll when lazy-loaded sections mount
  useEffect(() => {
    if (!scroll || !isLoaderDone) return;

    let updateDebounce = null;
    let updateCount = 0;
    const maxUpdates = 3; // Limit updates to prevent infinite loops

    const observer = new MutationObserver(() => {
      if (updateCount >= maxUpdates) return;

      clearTimeout(updateDebounce);
      updateDebounce = setTimeout(() => {
        if (scroll && typeof scroll.update === 'function') {
          scroll.update();
          updateCount++;
        }
      }, 300);
    });

    const container = containerRef.current;
    if (container) {
      observer.observe(container, {
        childList: true,
        subtree: false, // Only watch direct children
      });
    }

    // Initial update after sections load
    const updateTimeout = setTimeout(() => {
      if (scroll && typeof scroll.update === 'function') {
        scroll.update();
      }
    }, 500);

    return () => {
      observer.disconnect();
      clearTimeout(updateTimeout);
      clearTimeout(updateDebounce);
    };
  }, [scroll, isLoaderDone, containerRef]);

  // Update scroll when Footer loads (prevents white space at bottom)
  useEffect(() => {
    if (!scroll || !isLoaderDone) return;

    const timeoutId = setTimeout(() => {
      const footerSection = document.getElementById('footer');
      if (footerSection && scroll && typeof scroll.update === 'function') {
        scroll.update();
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [scroll, isLoaderDone]);

  // Handle scroll to target section
  useEffect(() => {
    if (!scrollTarget) return;
    const targetSection = document.getElementById(scrollTarget);
    if (!targetSection) return;

    // Use instant scroll (duration: 0) when coming from page transition
    const scrollDuration = instantScroll ? 0 : 800;

    if (scroll && typeof scroll.scrollTo === 'function') {
      scroll.scrollTo(targetSection, {
        offset: 0,
        duration: scrollDuration,
        disableLerp: true,
      });
    } else {
      targetSection.scrollIntoView({
        behavior: instantScroll ? 'instant' : 'smooth',
        block: 'start'
      });
    }

    // Clear scroll target and notify completion after scroll
    if (onScrollComplete) {
      onScrollComplete();
    }
  }, [scrollTarget, scroll, instantScroll, onScrollComplete]);

  const baseSectionStyles = useMemo(() => ({
    width: '100%',
    maxWidth: '100vw',
    overflowX: 'hidden',
    boxSizing: 'border-box',
  }), []);

  const scrollToContact = useCallback(() => {
    const contactSection = document.getElementById('contact');
    if (!contactSection) return;

    if (scroll && typeof scroll.scrollTo === 'function') {
      scroll.scrollTo(contactSection, {
        offset: 0,
        duration: 800,
        disableLerp: true,
      });
    } else {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [scroll]);

  return (
    <motion.div
      data-scroll-container
      ref={containerRef}
      className="parallax-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '100vw', 
        overflowX: 'hidden',
        minHeight: '100vh'
      }}
    >
      <Navbar />

      <main id="main-content" role="main" style={{ position: 'relative' }}>
        {/* Hero Section */}
        <section
          id="hero"
          data-scroll-id="home"
          aria-labelledby="hero-heading"
          data-scroll-section
          style={baseSectionStyles}
        >
          <Hero onScrollToContact={scrollToContact} isLoaderDone={isLoaderDone} />
        </section>

        {/* What I Do Section */}
        <section
          id="what-i-do"
          data-scroll-id="what-i-do"
          aria-label="What I Do"
          data-scroll-section
          data-scroll-section-inview
          style={{
            ...baseSectionStyles,
            overflow: 'hidden',
          }}
        >
          <WhatIDo />
        </section>

        {/* About Section */}
        <section
          id="about"
          data-scroll-id="about"
          aria-labelledby="bio-heading"
          data-scroll-section
          style={baseSectionStyles}
        >
          <React.Suspense fallback={<SectionLoader />}>
            <BioSection />
          </React.Suspense>
        </section>

        {/* Skills Section */}
        <section
          id="skills"
          data-scroll-id="skills"
          aria-labelledby="skills-heading"
          data-scroll-section
          style={baseSectionStyles}
        >
          <React.Suspense fallback={<SectionLoader />}>
            <Skills />
          </React.Suspense>
        </section>

        {/* Video Section */}
        <section
          id="video"
          data-scroll-id="work"
          aria-labelledby="projects-showcase-heading"
          data-scroll-section
          style={baseSectionStyles}
        >
          <React.Suspense fallback={<SectionLoader />}>
            <Vido />
          </React.Suspense>
        </section>

        {/* Projects Section */}
        <section
          id="projects"
          data-scroll-id="projects"
          aria-label="Projects"
          data-scroll-section
          style={baseSectionStyles}
        >
          <React.Suspense fallback={<SectionLoader />}>
            <Projects />
          </React.Suspense>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          data-scroll-id="contact"
          aria-labelledby="contact-heading"
          data-scroll-section
          style={{
            ...baseSectionStyles,
            minHeight: '100vh',
          }}
        >
          <React.Suspense fallback={<SectionLoader />}>
            <Contact />
          </React.Suspense>
        </section>

        {/* 3D World Section */}
        <section
          id="3d-world"
          data-scroll-id="3d-world"
          aria-label="3D World Experience"
          data-scroll-section
          style={baseSectionStyles}
        >
          <React.Suspense fallback={<SectionLoader />}>
            <World3D />
          </React.Suspense>
        </section>

        {/* Footer */}
        <section
          id="footer"
          data-scroll-id="footer"
          aria-labelledby="footer-heading"
          data-scroll-section
          style={{
            ...baseSectionStyles,
            position: 'relative',
            zIndex: 10,
            paddingBottom: '0',
          }}
        >
          <React.Suspense fallback={<SectionLoader />}>
            <Footer />
          </React.Suspense>
        </section>
      </main>
      
      <React.Suspense fallback={null}>
        <MouseFollower />
      </React.Suspense>
    </motion.div>
  );
});

PortfolioSections.displayName = 'PortfolioSections';

// Main Portfolio Content Component - Wraps sections with Locomotive Scroll
const MainCo = ({ isLoaderDone }) => {
  const containerRef = useRef(null);
  // Default to true on desktop, will be updated in useEffect
  const [enableSmoothScroll, setEnableSmoothScroll] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth > 768;
  });
  const [scrollTarget, setScrollTarget] = useState(null);
  const [instantScroll, setInstantScroll] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const checkAndSetSmooth = () => {
      const isMobile = window.innerWidth <= 768;
      const shouldEnable = !mediaQuery.matches && !isMobile;
      setEnableSmoothScroll(shouldEnable);
    };

    // Initial check
    checkAndSetSmooth();

    // Listen for motion preference changes
    mediaQuery.addEventListener('change', checkAndSetSmooth);

    // Listen for resize
    window.addEventListener('resize', checkAndSetSmooth, { passive: true });

    return () => {
      mediaQuery.removeEventListener('change', checkAndSetSmooth);
      window.removeEventListener('resize', checkAndSetSmooth);
    };
  }, []);

  // Handle scroll target from route state - use instant scroll for page transitions
  useEffect(() => {
    if (!location.state?.scrollTo) return;

    const targetId = location.state.scrollTo;

    // Clear the state immediately to prevent re-triggering
    navigate(location.pathname, { replace: true, state: null });

    // Small delay to ensure DOM is ready, then scroll
    const scrollTimer = setTimeout(() => {
      setInstantScroll(true);
      setScrollTarget(targetId);
    }, 50);

    return () => clearTimeout(scrollTimer);
  }, [location.state?.scrollTo, navigate]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      <LocomotiveScrollProvider
        options={{
          smooth: enableSmoothScroll,
          lerp: enableSmoothScroll ? 0.05 : 1,
          multiplier: 0.5,
          class: 'is-inview',
          getDirection: true,
          resetNativeScroll: true,
          firefoxMultiplier: 25,
          touchMultiplier: 2.5,
          scrollFromAnywhere: false,
          reloadOnContextChange: false,
          smartphone: {
            smooth: false,
            lerp: 1,
            multiplier: 1,
          },
          tablet: {
            smooth: false,
            lerp: 1,
            multiplier: 1,
          },
        }}
        watch={[enableSmoothScroll]}
        containerRef={containerRef}
      >
        <PortfolioSections
          containerRef={containerRef}
          scrollTarget={scrollTarget}
          instantScroll={instantScroll}
          onScrollComplete={() => {
            setInstantScroll(false);
            setScrollTarget(null);
          }}
          isLoaderDone={isLoaderDone}
        />
      </LocomotiveScrollProvider>
    </motion.div>
  );
};

export default MainCo;
