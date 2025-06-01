import React, { useRef, useEffect, useState, useCallback } from 'react';
import styles from './Video.module.css';
import scVideo from "../assets/sc.mp4";

const Video = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const animationFrameRef = useRef();

  // Scroll handler with debouncing and performance optimization
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    
    animationFrameRef.current = requestAnimationFrame(() => {
      const rect = containerRef.current.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / window.innerHeight));
      setScrollProgress(progress);
      
      // Apply all animations
      applyAnimations(progress);
    });
  }, []);

  // All animations in one optimized function
  const applyAnimations = (progress) => {
    if (!videoRef.current) return;

    const scale = 0.5 + (progress * 0.5);
    const opacity = progress;
    const blur = 5 - (progress * 5);
    const tiltX = (progress - 0.5) * 15;
    const tiltY = (progress - 0.5) * 7;
    const parallaxY = progress * 40;
    const borderRadius = 16 - (progress * 14);
    const shadowIntensity = progress * 0.8;

    videoRef.current.style.transform = `
      scale(${scale})
      rotateX(${tiltX}deg)
      rotateY(${tiltY}deg)
      translateY(${parallaxY}px)
    `;
    videoRef.current.style.opacity = opacity;
    videoRef.current.style.filter = `blur(${blur}px)`;
    videoRef.current.style.borderRadius = `${borderRadius}px`;
    videoRef.current.style.boxShadow = `0 10px 60px rgba(0, 0, 0, ${shadowIntensity})`;
    
    // Background gradient effect
    if (containerRef.current) {
      containerRef.current.style.background = `linear-gradient(
        ${135 + progress * 45}deg,
        hsl(${progress * 360}, 70%, 15%),
        hsl(${progress * 360 + 120}, 70%, 15%)
      )`;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.addEventListener('scroll', handleScroll);
          handleScroll(); // Initial trigger
        } else {
          window.removeEventListener('scroll', handleScroll);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (containerRef.current) observer.unobserve(containerRef.current);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [handleScroll]);

  // Play/pause on hover
  useEffect(() => {
    if (!videoRef.current) return;
    isHovered ? videoRef.current.play() : videoRef.current.pause();
  }, [isHovered]);

  return (
    <div 
      ref={containerRef} 
      className={`${styles.videoContainer} ${scrollProgress > 0.1 ? styles.visible : ''}`}
    >
      <div className={styles.videoWrapper}>
        {!isLoaded && (
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
          </div>
        )}
        
        <video
          ref={videoRef}
          src={scVideo}
          autoPlay
          muted
          loop
          playsInline
          className={styles.video}
          onLoadedData={() => setIsLoaded(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => videoRef.current.muted = !videoRef.current.muted}
          loading="lazy"
        />

        <div className={styles.contentOverlay}>
          <h3 style={{ opacity: 1 - scrollProgress * 1.2 }}>
            Project Showcase
          </h3>
          <p style={{ opacity: Math.max(0, 0.8 - scrollProgress * 1.5) }}>
            {scrollProgress < 0.2 ? 'Scroll to interact' : 'Click to unmute'}
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