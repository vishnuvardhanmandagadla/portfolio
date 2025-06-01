import { useState, useEffect, useRef } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [sectionProgress, setSectionProgress] = useState({
    home: 100,
    about: 0,
    work: 0, // Combined progress for Video and Projects
    contact: 0
  });
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false); // Hide on scroll down
      } else {
        setIsVisible(true); // Show on scroll up
      }
      setLastScrollY(window.scrollY);

      // Calculate section progress
      updateSectionProgress();
    };

    const updateSectionProgress = () => {
      const sections = ['home', 'about', 'work', 'contact'];
      const newProgress = {};
      let newActiveSection = activeSection;

      sections.forEach(section => {
        let visible = 0;
        
        if (section === 'home') {
          const element = document.getElementById('hero');
          if (element) visible = calculateVisibility(element);
        } 
        else if (section === 'about') {
          const element = document.getElementById('about');
          if (element) visible = calculateVisibility(element);
        }
        else if (section === 'work') {
          // Calculate combined visibility for both Video and Projects
          const videoElement = document.getElementById('video');
          const projectsElement = document.getElementById('projects');
          let videoVisible = videoElement ? calculateVisibility(videoElement) : 0;
          let projectsVisible = projectsElement ? calculateVisibility(projectsElement) : 0;
          visible = Math.max(videoVisible, projectsVisible);
        }
        else if (section === 'contact') {
          const element = document.getElementById('contact');
          if (element) visible = calculateVisibility(element);
        }
        
        newProgress[section] = Math.min(100, Math.max(0, Math.round(visible)));
        
        // Determine active section (whichever is most visible)
        if (visible > (newProgress[newActiveSection] || 0) || !newActiveSection) {
          newActiveSection = section;
        }
      });

      setSectionProgress(newProgress);
      setActiveSection(newActiveSection);
    };

    const calculateVisibility = (element) => {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementHeight = rect.height;
      
      if (rect.top <= 0 && rect.bottom >= viewportHeight) {
        // Element is taller than viewport and completely covers it
        return 100;
      } else if (rect.top >= 0 && rect.bottom <= viewportHeight) {
        // Element is fully visible
        return 100;
      } else if (rect.top < viewportHeight && rect.bottom > 0) {
        // Element is partially visible
        const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        return (visibleHeight / elementHeight) * 100;
      }
      return 0;
    };

    window.addEventListener("scroll", handleScroll);
    updateSectionProgress(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, activeSection]);

  return (
    <nav className={`navbar ${isVisible ? "show" : "hide"}`} ref={navRef}>
      <div className="navbar-container">
        <h1 className="logo">Vishnu Vardhan</h1>
        <div className={`menu-toggle ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <li className={activeSection === 'home' ? 'active' : ''}>
            <a href="#hero">
              Home
              <span className="progress-mask" style={{ width: `${sectionProgress.home}%` }}></span>
            </a>
          </li>
          <li className={activeSection === 'about' ? 'active' : ''}>
            <a href="#about">
              About
              <span className="progress-mask" style={{ width: `${sectionProgress.about}%` }}></span>
            </a>
          </li>
          <li className={activeSection === 'work' ? 'active' : ''}>
            <a href="#video">
              Work
              <span className="progress-mask" style={{ width: `${sectionProgress.work}%` }}></span>
            </a>
          </li>
          <li className={activeSection === 'contact' ? 'active' : ''}>
            <a href="#contact">
              Contact Us
              <span className="progress-mask" style={{ width: `${sectionProgress.contact}%` }}></span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;