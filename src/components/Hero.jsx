import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import ReactTypingEffect from "react-typing-effect";
import { gsap } from "gsap";
import "./Hero.css";
import resumePDF from '../assets/Vishnu_Resume.pdf';

const RIPPLE_GROWTH_RATE = 0.012;
const RIPPLE_MAX_PROGRESS = 1.2;
const HERO_RIPPLE_LIFETIME = 1600;

// Memoize shape generation function
const generateNonCollidingShapes = (count) => {
  const newShapes = [];
  const types = ['circle', 'square', 'triangle'];
  const colors = [
    'hsla(290, 70%, 60%, 0.7)', 
    'hsla(300, 70%, 60%, 0.7)',
    'hsla(310, 70%, 60%, 0.7)'
  ];
  
  const gridSize = 10;
  const grid = Array(gridSize).fill().map(() => Array(gridSize).fill(false));
  
  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let placed = false;
    
    while (!placed && attempts < 100) {
      attempts++;
      const type = types[Math.floor(Math.random() * types.length)];
      const isLeftSide = Math.random() > 0.5;
      
      const xGrid = isLeftSide 
        ? Math.floor(Math.random() * (gridSize * 0.3))
        : Math.floor(gridSize * 0.7 + Math.random() * (gridSize * 0.3));
      
      const yGrid = Math.floor(Math.random() * gridSize);
      
      if (!grid[xGrid][yGrid]) {
        const x = (xGrid / gridSize) * 100;
        const y = (yGrid / gridSize) * 100;
        
        newShapes.push({
          id: Date.now() + i,
          type,
          x,
          y,
          size: 20 + Math.random() * 30,
          rotation: Math.random() * 360,
          opacity: 0,
          color: colors[Math.floor(Math.random() * colors.length)],
          scale: 1,
          active: false,
          activationIntensity: 0,
          lastActivatedBy: null
        });
        
        grid[xGrid][yGrid] = true;
        placed = true;
      }
    }
  }
  return newShapes;
};

const Hero = memo(({ onScrollToContact, isLoaderDone = false }) => {
  const nameRef = useRef(null);
  const wordsRef = useRef(null);
  const heroRef = useRef(null);
  const [ripples, setRipples] = useState([]);
  const [shapes, setShapes] = useState([]);
  const shapeDecayRef = useRef(null);

  useEffect(() => {
    // Wait for loader to complete before starting animations
    if (!isLoaderDone) {
      return;
    }

    // Small delay after loader completes to prevent jitter
    const isMobile = window.innerWidth <= 768;
    const initTimer = setTimeout(() => {
      // Reduce shapes on mobile for better performance
      const shapeCount = isMobile ? 5 : 20;
      const initialShapes = generateNonCollidingShapes(shapeCount);
      setShapes(initialShapes);

      // Skip shape animations on mobile for better performance
      if (!isMobile) {
        // Animate shapes in on load
        gsap.to(".hidden-shape", {
          opacity: 0.7,
          duration: 1.5,
          ease: "power2.out",
          stagger: 0.05
        });

        // Then fade them out after 2 seconds
        gsap.to(".hidden-shape", {
          opacity: 0,
          duration: 1,
          delay: 2,
          ease: "power2.in"
        });
      } else {
        // On mobile, just hide shapes immediately
        gsap.set(".hidden-shape", { opacity: 0 });
      }
    }, 100);

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && isLoaderDone) {
          reverseDisperseEffect();
          animateWords();
        }
      });
    };

    // Lower threshold for mobile to trigger animation earlier
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: isMobile ? 0.1 : 0.5,
    });

    const currentNameRef = nameRef.current;
    const currentWordsRef = wordsRef.current;
    
    if (currentNameRef && isLoaderDone) {
      observer.observe(currentNameRef);
    }
    if (currentWordsRef && isLoaderDone) {
      observer.observe(currentWordsRef);
    }

    // Also trigger animation immediately on mobile if already visible (but only after loader)
    if (isMobile && currentWordsRef && isLoaderDone) {
      const rect = currentWordsRef.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (isVisible) {
        setTimeout(() => {
          animateWords();
        }, 600);
      }
    }

    return () => {
      clearTimeout(initTimer);
      if (currentNameRef) {
        observer.unobserve(currentNameRef);
      }
      if (currentWordsRef) {
        observer.unobserve(currentWordsRef);
      }
      observer.disconnect();
    };
  }, [isLoaderDone]);

  useEffect(() => {
    return () => {
      if (shapeDecayRef.current) {
        cancelAnimationFrame(shapeDecayRef.current);
      }
    };
  }, []);

  const reverseDisperseEffect = () => {
    const letters = nameRef.current?.querySelectorAll(".letter");
    if (letters) {
      gsap.fromTo(
        letters,
        {
          x: () => Math.random() * 200 - 100,
          y: () => Math.random() * 200 - 100,
          opacity: 0,
        },
        {
          duration: 1,
          x: 0,
          y: 0,
          opacity: 1,
          stagger: 0.06,
          ease: "power4.out",
        }
      );
    }
  };

  const animateWords = () => {
    const words = wordsRef.current?.querySelectorAll(".word");
    if (words) {
      // Apply CSS animation by adding active class
      words.forEach((word, index) => {
        setTimeout(() => {
          word.classList.add('word-active');
        }, index * 300);
      });
    }
  };

  const decayActiveShapes = useCallback(() => {
    let nextHasActive = false;

    setShapes((prevShapes) =>
      prevShapes.map((shape) => {
        const currentIntensity = shape.activationIntensity ?? 0;
        if (currentIntensity > 0.01) {
          const nextIntensity = Math.max(0, currentIntensity - 0.06);
          if (nextIntensity > 0.01) {
            nextHasActive = true;
          }
          return {
            ...shape,
            activationIntensity: nextIntensity,
            active: nextIntensity > 0.03,
            scale: 1 + nextIntensity * 0.25,
          };
        }
        return shape;
      })
    );

    if (nextHasActive) {
      shapeDecayRef.current = requestAnimationFrame(decayActiveShapes);
    } else {
      shapeDecayRef.current = null;
    }
  }, []);

  const createRipple = (e) => {
    // Disable ripples on mobile for better performance
    const isMobile = window.innerWidth <= 768;
    if (isMobile || !heroRef.current) return;
    
    const rect = heroRef.current.getBoundingClientRect();
    if (shapeDecayRef.current) {
      cancelAnimationFrame(shapeDecayRef.current);
      shapeDecayRef.current = null;
    }
    const rippleId = Date.now();
    const newRipple = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      id: rippleId,
      size: Math.min(rect.width, rect.height) * 0.1,
      progress: 0,
      radius: 0
    };

    setRipples((prev) => [...prev, newRipple]);

    let currentProgress = 0;

    const animateRipple = () => {
      currentProgress += RIPPLE_GROWTH_RATE;
      const clampedProgress = Math.min(currentProgress, 1);
      const radius = newRipple.size * 7.5 * clampedProgress;

      setRipples((prev) =>
        prev
          .map((r) =>
            r.id === rippleId
              ? {
                  ...r,
                  progress: currentProgress,
                  radius,
                }
              : r
          )
          .filter(Boolean)
      );

      setShapes((prevShapes) =>
        prevShapes.map((shape) => {
          const shapeX = (shape.x / 100) * rect.width;
          const shapeY = (shape.y / 100) * rect.height;
          const distance = Math.sqrt(
            Math.pow(newRipple.x - shapeX, 2) + Math.pow(newRipple.y - shapeY, 2)
          );

          const ringThickness = Math.max(shape.size * 0.75, 45);
          const innerRadius = Math.max(0, radius - ringThickness);
          const outerRadius = radius + ringThickness;
          const isWithinRing = distance >= innerRadius && distance <= outerRadius;

          let activationIntensity = shape.activationIntensity ?? 0;

          if (isWithinRing) {
            activationIntensity = Math.min(1, activationIntensity + 0.22);
          } else {
            activationIntensity = Math.max(0, activationIntensity - 0.05);
          }

          const nextScale = 1 + activationIntensity * 0.25;

          return {
            ...shape,
            activationIntensity,
            active: activationIntensity > 0.03,
            scale: nextScale,
            lastActivatedBy: isWithinRing ? rippleId : shape.lastActivatedBy,
          };
        })
      );

      if (currentProgress < RIPPLE_MAX_PROGRESS) {
        requestAnimationFrame(animateRipple);
      } else if (!shapeDecayRef.current) {
        shapeDecayRef.current = requestAnimationFrame(decayActiveShapes);
      }
    };
    
    requestAnimationFrame(animateRipple);
    
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, HERO_RIPPLE_LIFETIME);
  };

  const scrollToContact = useCallback(() => {
    if (typeof onScrollToContact === 'function') {
      onScrollToContact();
      return;
    }

    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [onScrollToContact]);

  const downloadResume = () => {
  const link = document.createElement('a');
  link.href = resumePDF;
  link.download = 'Vishnu_Vardhan_Resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
  

  const renderShape = (shape) => {
    const activation =
      Math.min(Math.max(shape.activationIntensity ?? (shape.active ? 1 : 0), 0), 1);
    const style = {
      left: `${shape.x}%`,
      top: `${shape.y}%`,
      width: `${shape.size}px`,
      height: `${shape.size}px`,
      opacity: activation * 0.7,
      transform: `translate(-50%, -50%) rotate(${shape.rotation}deg) scale(${shape.scale ?? 1})`,
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: 1,
      transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
      transformOrigin: 'center',
    };

    switch (shape.type) {
      case 'circle':
        return (
          <div
            key={shape.id}
            className="hidden-shape circle"
            style={{
              ...style,
              borderRadius: '50%',
              backgroundColor: shape.color,
            }}
          />
        );
      case 'square':
        return (
          <div
            key={shape.id}
            className="hidden-shape square"
            style={{
              ...style,
              backgroundColor: shape.color,
            }}
          />
        );
      case 'triangle':
        return (
          <div
            key={shape.id}
            className="hidden-shape triangle"
            style={{
              ...style,
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderLeft: `${shape.size/2}px solid transparent`,
              borderRight: `${shape.size/2}px solid transparent`,
              borderBottom: `${shape.size}px solid ${shape.color}`,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <section
      id="home"
      className="hero"
      ref={heroRef}
      onClick={createRipple}
    >
      {/* Background shapes - concentrated on sides */}
      <div className="shapes-container">
        {shapes.map(renderShape)}
      </div>
      
      {/* Ripples - behind content */}
      <div className="ripples-container">
        {ripples.map((ripple) => {
          const normalizedProgress = Math.min(Math.max(ripple.progress, 0), 1);
          const easedFade = 1 - Math.pow(normalizedProgress, 1.5);
          return (
          <div
            key={ripple.id}
            className="ripple"
            style={{
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
              width: `${ripple.size}px`,
              height: `${ripple.size}px`,
              transform: `translate(-50%, -50%) scale(${normalizedProgress * 15})`,
              opacity: Math.max(0, 0.28 * easedFade),
            }}
          />
        );
        })}
      </div>

      {/* Content */}
      <div className="content-container">
        <div className="intro">
          <ReactTypingEffect
            text={["<HELLO WORLD/>"]}
            speed={100}
            eraseSpeed={50}
            typingDelay={500}
            eraseDelay={10000}
            className="typing-effect"
          />
        </div>

        <div className="name-section">
          <h1 id="hero-heading" className="name-animation" ref={nameRef}>
            <span className="resume-text-style"> THIS IS </span>
            <br />
            <span className="bold-text">
              {"VISHNU VARDHAN".split("").map((letter, index) => (
                <span key={index} className="letter">
                  {letter}
                </span>
              ))}
            </span>
          </h1>

          <div className="words-container" ref={wordsRef}>
            <span className="word">Developer</span>
            <span className="word">Designer</span>
            <span className="word">Dreamer</span>
          </div>

          {/* Action Buttons */}
          <div className="hero-buttons">
            <button className="btn-talk" onClick={scrollToContact}>
              <span className="btn-text">Let's Talk</span>
              <span className="btn-hover-text">Contact Us</span>
              <div className="arrow-circle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
            {/* Resume Download Button - Mobile Only */}
            <button className="btn-resume-mobile" onClick={downloadResume}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Download Resume</span>
            </button>
          </div>
        </div>
      </div>

      {/* Resume Text - Bottom Right Corner, Vertical */}
      <div className="resume-text-container" onClick={downloadResume}>
        <div className="resume-text">RESUME</div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;