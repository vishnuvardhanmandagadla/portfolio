import { useState, useEffect, useRef } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    let activeSectionTimeout = null;
    let lastActiveSectionUpdate = 0;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Faster hide/show with reduced threshold
          if (currentScrollY > lastScrollY && currentScrollY > 50) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
          setLastScrollY(currentScrollY);
          
          // Throttle active section updates (only every 100ms)
          const now = Date.now();
          if (now - lastActiveSectionUpdate > 100) {
            updateActiveSection();
            lastActiveSectionUpdate = now;
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    const updateActiveSection = () => {
      const sections = ['home', 'about', 'skills', 'work', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(
          section === 'home' ? 'hero' : 
          section === 'work' ? 'video' :
          section === 'projects' ? 'projects' : section
        );
        if (element) {
          const rect = element.getBoundingClientRect();
          const offsetTop = rect.top + window.scrollY;
          const offsetBottom = offsetTop + rect.height;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(prev => prev !== section ? section : prev);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateActiveSection();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (activeSectionTimeout) {
        clearTimeout(activeSectionTimeout);
      }
    };
  }, [lastScrollY]);

  const handleNavClick = (section) => {
    setIsMenuOpen(false);
    const element = document.getElementById(
      section === 'home' ? 'hero' : 
      section === 'work' ? 'video' :
      section === 'projects' ? 'projects' : section
    );
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Close menu when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Backdrop overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="menu-backdrop"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <nav className={`navbar ${isVisible ? "show" : "hide"}`} ref={navRef}>
        <div className="navbar-container">
          <h1 
            className="logo" 
            onClick={() => handleNavClick('home')}
          >
            Vishnu Vardhan
          </h1>
          
          <div 
            className={`menu-toggle ${isMenuOpen ? "open" : ""}`} 
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          
          <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <li className={activeSection === 'home' ? 'active' : ''}>
            <a 
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('home');
              }}
            >
              Home
              <span className="progress-mask"></span>
            </a>
          </li>
          <li className={activeSection === 'about' ? 'active' : ''}>
            <a 
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('about');
              }}
            >
              About
              <span className="progress-mask"></span>
            </a>
          </li>
          <li className={activeSection === 'skills' ? 'active' : ''}>
            <a 
              href="#skills"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('skills');
              }}
            >
              Skills
              <span className="progress-mask"></span>
            </a>
          </li>
          <li className={activeSection === 'work' ? 'active' : ''}>
            <a 
              href="#video"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('work');
              }}
            >
              Work
              <span className="progress-mask"></span>
            </a>
          </li>
          <li className={activeSection === 'projects' ? 'active' : ''}>
            <a 
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('projects');
              }}
            >
              Projects
              <span className="progress-mask"></span>
            </a>
          </li>
          <li className={activeSection === 'contact' ? 'active' : ''}>
            <a 
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('contact');
              }}
            >
              Contact
              <span className="progress-mask"></span>
            </a>
          </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;