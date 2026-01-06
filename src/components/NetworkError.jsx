import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import "./NetworkError.css";

const NetworkError = ({ onRetry }) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const glitchRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);
  const cableRef = useRef(null);

  useEffect(() => {
    // Track mouse movement for interactive effect
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animate elements on mount
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (containerRef.current) {
      // Glitch effect
      gsap.to(glitchRef.current, {
        x: () => Math.random() * 10 - 5,
        y: () => Math.random() * 10 - 5,
        duration: 0.1,
        repeat: 20,
        yoyo: true,
        ease: "power1.inOut",
      });

      // Main animation
      tl.from(containerRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
      })
        .from(
          cableRef.current,
          {
            scaleY: 0,
            transformOrigin: "top",
            duration: 1,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .from(
          textRef.current?.children || [],
          {
            y: 50,
            opacity: 0,
            rotationX: 90,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.7)",
          },
          "-=0.6"
        )
        .from(
          buttonRef.current,
          {
            y: 30,
            opacity: 0,
            scale: 0.8,
            rotation: -5,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)",
          },
          "-=0.4"
        );
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      tl.kill();
    };
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    
    // Animate button
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });

    // Check if online
    if (navigator.onLine) {
      try {
        await fetch(window.location.origin, { 
          method: 'HEAD',
          cache: 'no-cache',
          mode: 'no-cors'
        });
        
        if (onRetry) {
          onRetry();
        } else {
          window.location.reload();
        }
      } catch (error) {
        setIsRetrying(false);
      }
    } else {
      setIsRetrying(false);
    }
  };

  return (
    <div className="network-error" ref={containerRef}>
      {/* Animated background with parallax */}
      <div 
        className="network-error__background"
        style={{
          backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
        }}
      >
        <div className="network-error__grid"></div>
        <div className="network-error__gradient-orb"></div>
        <div className="network-error__noise"></div>
      </div>

      {/* Disconnected Cable Animation */}
      <div className="network-error__cable-container">
        <svg
          ref={cableRef}
          className="network-error__cable"
          viewBox="0 0 200 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cable */}
          <path
            d="M100 0 Q 80 50, 100 100 T 100 200 Q 120 250, 100 300"
            stroke="url(#cableGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <defs>
            <linearGradient id="cableGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#63133b" />
              <stop offset="50%" stopColor="#802754" />
              <stop offset="100%" stopColor="#994D74" />
            </linearGradient>
          </defs>
          
          {/* Disconnected ends with sparks */}
          <circle cx="100" cy="150" r="12" fill="#63133b" className="network-error__spark-1" />
          <circle cx="100" cy="160" r="12" fill="#802754" className="network-error__spark-2" />
        </svg>
      </div>

      {/* Glitch Text Effect */}
      <div className="network-error__glitch-container" ref={glitchRef}>
        <div className="network-error__glitch-text" data-text="NO SIGNAL">
          NO SIGNAL
        </div>
      </div>

      {/* Main Content */}
      <div className="network-error__content">
        {/* 3D Error Number */}
        <div className="network-error__error-number">
          <span className="network-error__error-digit">4</span>
          <span className="network-error__error-digit network-error__error-digit--pulse">0</span>
          <span className="network-error__error-digit">4</span>
        </div>

        {/* Text Content */}
        <div className="network-error__text" ref={textRef}>
          <h1 className="network-error__title">
            <span className="network-error__title-line">Connection</span>
            <span className="network-error__title-line network-error__title-line--highlight">Interrupted</span>
          </h1>
          <p className="network-error__description">
            The digital highway has hit a roadblock.
            <br />
            <span className="network-error__description-accent">Your signal got lost in the void.</span>
          </p>
        </div>

        {/* Interactive Retry Button */}
        <button
          className="network-error__button"
          onClick={handleRetry}
          disabled={isRetrying}
          ref={buttonRef}
        >
          <span className="network-error__button-bg"></span>
          <span className="network-error__button-text">
            {isRetrying ? (
              <>
                <span className="network-error__button-loading">Reconnecting</span>
                <span className="network-error__button-dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </>
            ) : (
              "Reconnect"
            )}
          </span>
          <svg
            className="network-error__button-icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 4V10H7M23 20V14H17M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Floating particles */}
        <div className="network-error__particles">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="network-error__particle"
              style={{
                left: `${10 + (i * 6)}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${3 + (i % 3)}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NetworkError;

