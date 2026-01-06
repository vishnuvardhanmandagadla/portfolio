import { useState, useEffect, useRef, useCallback } from "react";
import { useLocomotiveScroll } from "react-locomotive-scroll";
import "./Navbar.css";

const HIDE_SCROLL_THRESHOLD = 50;
const MIN_SCROLL_DELTA = 6;

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navRef = useRef(null);
  const lastScrollYRef = useRef(0);
  const { scroll } = useLocomotiveScroll();

  const resolveElementBySection = useCallback((section) => {
    const target = document.getElementById(
      section === 'home' ? 'hero' : 
      section === 'work' ? 'video' :
      section === 'projects' ? 'projects' : section
    );
    return target;
  }, []);

  const updateActiveSection = useCallback(() => {
    const sections = ['home', 'about', 'skills', 'work', 'projects', 'contact'];
    const viewportHeight = window.innerHeight;
    const checkpoint = viewportHeight * 0.4; // Slightly lower checkpoint for better detection
    let activeFound = false;

    // Check sections from bottom to top to prioritize sections that are more in view
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const element = resolveElementBySection(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top;
        const elementBottom = rect.bottom;
        const elementHeight = rect.height;
        
        // Check if section is in viewport
        // Section is active if:
        // 1. Top of section is above checkpoint and bottom is below checkpoint, OR
        // 2. Section takes up significant portion of viewport (at least 30%)
        const isInViewport = elementTop < checkpoint && elementBottom > checkpoint;
        const takesSignificantSpace = elementHeight > viewportHeight * 0.3 && 
                                      elementTop < viewportHeight * 0.7 && 
                                      elementBottom > viewportHeight * 0.3;
        
        if (isInViewport || takesSignificantSpace) {
          setActiveSection((prev) => {
            if (prev !== section) {
              return section;
            }
            return prev;
          });
          activeFound = true;
          break;
        }
      }
    }

    // If no section found and we're at the top, set home as active
    if (!activeFound) {
      const scrollY = scroll?.scroll?.instance?.scroll?.y ?? window.scrollY;
      if (scrollY < 100) {
        setActiveSection('home');
      }
    }
  }, [resolveElementBySection, scroll]);

  const handleScrollVisibility = useCallback((currentScrollY) => {
    const lastScrollY = lastScrollYRef.current;
    const delta = currentScrollY - lastScrollY;

    if (Math.abs(delta) < MIN_SCROLL_DELTA) {
      return;
    }

    if (!isMenuOpen) {
      if (delta > 0 && currentScrollY > HIDE_SCROLL_THRESHOLD) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    } else if (!isVisible) {
      setIsVisible(true);
    }

    lastScrollYRef.current = currentScrollY;
  }, [isMenuOpen, isVisible]);

  useEffect(() => {
    let rafId = null;
    let scrollTimeout = null;
    let lastUpdateTime = 0;
    const updateInterval = 100; // Only update active section every 100ms

    const throttledUpdate = () => {
      const now = Date.now();
      if (now - lastUpdateTime < updateInterval) return;

      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        updateActiveSection();
        lastUpdateTime = Date.now();
        rafId = null;
      });
    };

    if (scroll) {
      const handleScroll = (args) => {
        const currentScrollY = args.scroll.y;
        handleScrollVisibility(currentScrollY);
        throttledUpdate();
      };

      scroll.on('scroll', handleScroll);
      handleScrollVisibility(scroll.scroll?.instance?.scroll?.y ?? 0);

      // Initial update with slight delay to ensure DOM is ready
      scrollTimeout = setTimeout(() => {
        updateActiveSection();
      }, 100);

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scroll.off('scroll', handleScroll);
      };
    }

    const handleWindowScroll = () => {
      const currentScrollY = window.scrollY;
      handleScrollVisibility(currentScrollY);
      throttledUpdate();
    };

    window.addEventListener("scroll", handleWindowScroll, { passive: true });

    // Initial update
    scrollTimeout = setTimeout(() => {
      handleWindowScroll();
    }, 100);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, [handleScrollVisibility, scroll, updateActiveSection]);

  const handleNavClick = (section) => {
    setIsMenuOpen(false);
    // Immediately set the clicked section as active
    setActiveSection(section);
    const element = resolveElementBySection(section);
    if (element) {
      if (scroll) {
        // Update scroll limits before navigating
        scroll.update();

        setTimeout(() => {
          scroll.scrollTo(element, {
            offset: 0,
            duration: 1200,
            easing: [0.25, 0.0, 0.35, 1.0],
            callback: () => {
              // Update scroll limits after navigation completes
              setTimeout(() => {
                scroll.update();
              }, 100);
            }
          });
        }, 50);
      } else {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

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