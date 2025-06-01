import React, { useEffect, useState } from "react";
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Contact from './Contacts';
import Footer from './Footer';
import MouseFollower from "./MouseFollower";
import Vido from "./video";

const MainCo = () => {
  const [scrollY, setScrollY] = useState(0);
  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(window.innerWidth < 768 ? 'mobile' : 'desktop');
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getParallaxValue = (speed, offset = 0) => {
    if (deviceType === 'mobile') return 0;
    return Math.max(0, scrollY - offset) * speed;
  };

  const sectionOffsets = {
    hero: 0,
    about: 1000,
    skills: 2000,
    video: 3000,
    projects: 4000,
    contact: 5000,
    footer: 6000
  };

  return (
    <div className="parallax-scene" style={{ position: 'relative' }}>
      <Navbar scrollY={scrollY} />
      
      {/* Hero Section */}
      <div id="hero" style={{
        transform: `translateY(${getParallaxValue(0.3, sectionOffsets.hero)}px)`,
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
        opacity: 1 - Math.min(scrollY / 300, 0.2)
      }}>
        <Hero />
      </div>

      {/* About Section */}
      <div id="about" style={{
        transform: `translateY(${getParallaxValue(0.2, sectionOffsets.about)}px)`,
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform'
      }}>
        <About />
      </div>

      {/* Skills Section */}
      <div id="skills" style={{
        transform: `translateY(${getParallaxValue(0.15, sectionOffsets.skills)}px)`,
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform'
      }}>
        <Skills />
      </div>

      {/* Video Section */}
      <div id="video" style={{
        transform: `translateY(${getParallaxValue(0.1, sectionOffsets.video)}px)`,
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform'
      }}>
        <Vido />
      </div>

      {/* Projects Section */}
      <div id="projects" style={{
        transform: `translateY(${getParallaxValue(0.08, sectionOffsets.projects)}px)`,
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform'
      }}>
        <Projects />
      </div>

      {/* Contact Section */}
      <div id="contact" style={{
        transform: `translateY(${getParallaxValue(0.12, sectionOffsets.contact)}px)`,
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
        minHeight: '100vh'
      }}>
        <Contact />
      </div>

      {/* Footer */}
      <div id="footer" style={{
        transform: `translateY(${getParallaxValue(0.05, sectionOffsets.footer)}px)`,
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
        position: 'relative',
        zIndex: 10
      }}>
        <Footer />
      </div>
      
      <MouseFollower />
    </div>
  );
};

export default MainCo;
