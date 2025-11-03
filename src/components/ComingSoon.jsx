import React, { useEffect, useRef, useState } from 'react';
import './ComingSoon.css';

const ComingSoon = () => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="coming-soon-section" ref={containerRef}>
      <div className="elegant-bg"></div>
      
      <div className={`coming-soon-container ${isVisible ? 'visible' : ''}`}>
        {/* Animated Border Frame */}
        <div className="border-frame">
          <div className="frame-line top"></div>
          <div className="frame-line right"></div>
          <div className="frame-line bottom"></div>
          <div className="frame-line left"></div>
          <div className="frame-corner tl"></div>
          <div className="frame-corner tr"></div>
          <div className="frame-corner bl"></div>
          <div className="frame-corner br"></div>
        </div>

        {/* Directional Indicators */}
        <div className="directional-arrow arrow-top">
          <div className="arrow-shape">↓</div>
        </div>
        <div className="directional-arrow arrow-bottom">
          <div className="arrow-shape">↑</div>
        </div>
        <div className="directional-arrow arrow-left">
          <div className="arrow-shape">→</div>
        </div>
        <div className="directional-arrow arrow-right">
          <div className="arrow-shape">←</div>
        </div>

        {/* Main Content */}
        <div 
          className="content-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="text-container">
            <div className="text-line-wrapper">
              <h1 className="elegant-text line-1">DROPPING</h1>
            </div>
            <div className="text-line-wrapper">
              <h1 className="elegant-text line-2">SOON</h1>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="progress-indicator">
            <div className="progress-track">
              <div className="progress-fill"></div>
            </div>
            <div className="progress-dots">
              <div className="dot active"></div>
              <div className="dot active"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="particles-container">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                '--particle-delay': `${i * 0.5}s`,
                '--particle-duration': `${4 + (i % 3)}s`,
                '--particle-size': `${2 + (i % 4)}px`,
                '--particle-opacity': `${0.3 + (i % 7) * 0.1}`
              }}
            />
          ))}
        </div>

        {/* Center Focus Element */}
        <div className="center-focus">
          <div className="focus-ring ring-1"></div>
          <div className="focus-ring ring-2"></div>
          <div className="focus-dot"></div>
        </div>
      </div>
    </section>
  );
};

export default ComingSoon;