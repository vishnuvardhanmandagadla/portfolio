import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useLocomotiveScroll } from 'react-locomotive-scroll';
import styles from './Video.module.css';
import ComingSoon from './ComingSoon'; // Import your ComingSoon component

const Video = () => {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const animationFrameRef = useRef();
  const locomotiveHandlerRef = useRef(null);
  const { scroll } = useLocomotiveScroll();

  // Scroll handler with debouncing and performance optimization
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    
    // Batch DOM reads and writes to prevent forced reflows
    animationFrameRef.current = requestAnimationFrame(() => {
      // Read: Get bounding rect once
      const rect = containerRef.current.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / window.innerHeight));
      
      // Write: Apply all styles in one batch
      const scale = 0.8 + (progress * 0.2);
      const opacity = progress;
      const blur = 5 - (progress * 5);
      const borderRadius = 16 - (progress * 14);
      const shadowIntensity = progress * 0.8;

      // Use transform and opacity for composited animations (GPU accelerated)
      containerRef.current.style.transform = `scale(${scale})`;
      containerRef.current.style.opacity = opacity;
      // Filter and background are less performant but needed for effect
      containerRef.current.style.filter = `blur(${blur}px)`;
      containerRef.current.style.borderRadius = `${borderRadius}px`;
      containerRef.current.style.boxShadow = `0 10px 60px rgba(0, 0, 0, ${shadowIntensity})`;
      
      // Background gradient effect
      containerRef.current.style.background = `linear-gradient(
        ${135 + progress * 45}deg,
        hsl(${progress * 360}, 70%, 15%),
        hsl(${progress * 360 + 120}, 70%, 15%)
      )`;
      
      setScrollProgress(progress);
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (scroll) {
            locomotiveHandlerRef.current = () => handleScroll();
            scroll.on('scroll', locomotiveHandlerRef.current);
            handleScroll();
          } else {
            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll(); // Initial trigger
          }
        } else {
          setIsVisible(false);
          if (scroll && locomotiveHandlerRef.current) {
            scroll.off('scroll', locomotiveHandlerRef.current);
            locomotiveHandlerRef.current = null;
          } else {
            window.removeEventListener('scroll', handleScroll);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (scroll && locomotiveHandlerRef.current) {
        scroll.off('scroll', locomotiveHandlerRef.current);
        locomotiveHandlerRef.current = null;
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
      if (containerRef.current) observer.unobserve(containerRef.current);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [handleScroll, scroll]);

  return (
    <div 
      ref={containerRef} 
      className={`${styles.videoContainer} ${scrollProgress > 0.1 ? styles.visible : ''}`}
    >
      <div className={styles.videoWrapper}>
        {/* Replace video with ComingSoon component */}
        <div className={styles.comingSoonPlaceholder}>
          <ComingSoon />
        </div>

        <div className={styles.contentOverlay}>
          <h2
            id="projects-showcase-heading"
            style={{ opacity: 1 - scrollProgress * 1.2 }}
          >
            Project Showcase
          </h2>
          <p style={{ opacity: Math.max(0, 0.8 - scrollProgress * 1.5) }}>
            {scrollProgress < 0.2 ? 'Scroll to interact' : 'Coming Soon'}
          </p>
        </div>

        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Video;