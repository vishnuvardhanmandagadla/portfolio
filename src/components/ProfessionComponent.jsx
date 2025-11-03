import React, { useEffect, useRef, useState } from 'react';
import './ProfessionComponent.css';

const ProfessionComponent = () => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          startSequence();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const startSequence = () => {
    // Animate words one by one
    const sequence = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= 2) {
          clearInterval(sequence);
          return 2;
        }
        return prev + 1;
      });
    }, 800);
  };

  return (
    <section className="profession-section" ref={containerRef}>
      <div className="light-bg"></div>
      
      <div className={`profession-container ${isVisible ? 'visible' : ''}`}>
        <div className="words-wrapper">
          {/* Developer */}
          <div className={`word-container ${currentIndex >= 0 ? 'active' : ''}`}>
            <h1 className="profession-word word-1">DEVELOPER</h1>
            <div className="word-underline"></div>
          </div>

          {/* Designer */}
          <div className={`word-container ${currentIndex >= 1 ? 'active' : ''}`}>
            <h1 className="profession-word word-2">DESIGNER</h1>
            <div className="word-underline"></div>
          </div>

          {/* Dreamer */}
          <div className={`word-container ${currentIndex >= 2 ? 'active' : ''}`}>
            <h1 className="profession-word word-3">DREAMER</h1>
            <div className="word-underline"></div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>

        {/* Background Pattern */}
        <div className="background-pattern"></div>
      </div>
    </section>
  );
};

export default ProfessionComponent;