import React, { useEffect, useRef, useState } from "react";
import "./WhatIDo.css";

const WhatIDo = () => {
  const words = ["Design", "Develop", "Build", "Automate", "Optimize"];
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const wordWrapperRefs = useRef([]);
  const headingRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [headingLeft, setHeadingLeft] = useState('8%');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Calculate heading position to align with words
  useEffect(() => {
    const updateHeadingPosition = () => {
      if (sectionRef.current && wordWrapperRefs.current[0]) {
        const sectionRect = sectionRef.current.getBoundingClientRect();
        const firstWordWrapper = wordWrapperRefs.current[0];
        const firstWordElement = firstWordWrapper?.querySelector('.what-i-do-word');
        
        if (firstWordElement) {
          const wordRect = firstWordElement.getBoundingClientRect();
          
          // Get the actual left position where the text starts
          const wordLeft = wordRect.left - sectionRect.left;
          const leftPercent = (wordLeft / sectionRect.width) * 100;
          
          setHeadingLeft(`${leftPercent}%`);
        }
      }
    };

    // Update on mount and resize
    const resizeObserver = new ResizeObserver(() => {
      updateHeadingPosition();
    });
    
    if (sectionRef.current) {
      resizeObserver.observe(sectionRef.current);
    }

    // Initial update
    updateHeadingPosition();
    
    // Update after words are animated into view
    if (isInView) {
      const timeout = setTimeout(updateHeadingPosition, 1500);
      const timeout2 = setTimeout(updateHeadingPosition, 2000);
      
      return () => {
        clearTimeout(timeout);
        clearTimeout(timeout2);
        resizeObserver.disconnect();
      };
    }

    window.addEventListener('resize', updateHeadingPosition);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeadingPosition);
    };
  }, [isInView]);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
    
    // Calculate position for amoeba transformation
    requestAnimationFrame(() => {
      if (sectionRef.current && wordWrapperRefs.current[index]) {
        const sectionRect = sectionRef.current.getBoundingClientRect();
        const wordRect = wordWrapperRefs.current[index].getBoundingClientRect();
        
        // Calculate the right half of the word box
        const rightHalfLeft = wordRect.left + (wordRect.width * 0.5);
        const rightHalfWidth = wordRect.width * 0.5;
        
        // Convert to percentages relative to section
        const topPercent = ((wordRect.top - sectionRect.top) / sectionRect.height) * 100;
        const rightPercent = ((sectionRect.right - (rightHalfLeft + rightHalfWidth)) / sectionRect.width) * 100;
        const widthPercent = (rightHalfWidth / sectionRect.width) * 100;
        const heightPercent = (wordRect.height / sectionRect.height) * 100;
        
        // Update CSS custom properties on the main amoeba
        const amoeba = sectionRef.current.querySelector('.what-i-do-amoeba--main');
        if (amoeba) {
          amoeba.style.setProperty('--target-top', `${topPercent}%`);
          amoeba.style.setProperty('--target-right', `${rightPercent}%`);
          amoeba.style.setProperty('--target-width', `${widthPercent}%`);
          amoeba.style.setProperty('--target-height', `${heightPercent}%`);
        }
      }
    });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    
    // Clear target variables to allow smooth transition back to default
    requestAnimationFrame(() => {
      if (sectionRef.current) {
        const amoeba = sectionRef.current.querySelector('.what-i-do-amoeba--main');
        if (amoeba) {
          // Remove target variables so it transitions back to default position smoothly
          amoeba.style.removeProperty('--target-top');
          amoeba.style.removeProperty('--target-right');
          amoeba.style.removeProperty('--target-width');
          amoeba.style.removeProperty('--target-height');
        }
      }
    });
  };

  return (
    <div ref={sectionRef} className={`what-i-do ${isInView ? "in-view" : ""}`}>
      {/* "what i do" heading - now aligned with words */}
      <div 
        ref={headingRef}
        className="what-i-do-heading"
        style={{ left: headingLeft }}
      >
        what i do
      </div>
      
      {/* Main Amoeba - transforms into word box on hover */}
      <div 
        className={`what-i-do-amoeba what-i-do-amoeba--main ${hoveredIndex !== null ? 'transformed' : ''}`}
        data-hover-index={hoveredIndex}
      ></div>
      
      {/* Secondary background amoeba - always visible */}
      <div className="what-i-do-amoeba what-i-do-amoeba--bg"></div>
      
      <div ref={containerRef} className="what-i-do-container">
        {words.map((word, index) => (
          <div 
            key={index} 
            ref={(el) => (wordWrapperRefs.current[index] = el)}
            className={`what-i-do-word-wrapper ${hoveredIndex === index ? 'hovered' : ''}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            data-word-index={index}
          >
            <div
              className="what-i-do-word"
              style={{
                animationDelay: `${index * 0.1 + 0.1}s`,
              }}
            >
              {word}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatIDo;