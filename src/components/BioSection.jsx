import React, { useEffect, useRef, useState } from "react";
import { useLocomotiveScroll } from "react-locomotive-scroll";
import "./BioSection.css";

const BioSection = () => {
  const bioSectionRef = useRef(null);
  const bioHeadingRef = useRef(null);
  const bioMaxViewProgressRef = useRef(0);
  const bioMaxScrollProgressRef = useRef(0);
  const [isBioVisible, setIsBioVisible] = useState(false);
  const [bioScrollProgress, setBioScrollProgress] = useState(0);
  const [bioMaxScrollProgress, setBioMaxScrollProgress] = useState(0);
  const [bioMaxViewProgress, setBioMaxViewProgress] = useState(0);
  const { scroll } = useLocomotiveScroll();

  const bioContentText = `"I turn complex ideas into experiences that feel effortless.  
Simplicity isn't easy; it's my favorite problem to solve."`;

  const bioLines = bioContentText.split(/\r?\n/);
  const bioTotalChars = bioContentText.replace(/\r?\n/g, "").length;

  useEffect(() => {
    const bioSection = bioSectionRef.current;
    const bioHeading = bioHeadingRef.current;
    if (!bioSection || !bioHeading) return;

    const bioObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isVisible = entry.isIntersecting && entry.intersectionRatio > 0.1;
        
        requestAnimationFrame(() => {
          setIsBioVisible(isVisible);
        });
      },
      {
        threshold: [0, 0.1, 0.5, 1],
        rootMargin: '-10% 0px -10% 0px',
      }
    );

    bioObserver.observe(bioSection);

    let lastBioVisibleState = false;
    const handleBioScroll = () => {
      requestAnimationFrame(() => {
        const rect = bioSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const sectionTop = rect.top;
        const sectionBottom = rect.bottom;
        const sectionHeight = rect.height;
        
        const isVisible = sectionTop < windowHeight && sectionBottom > 0;
        
        if (isVisible !== lastBioVisibleState) {
          lastBioVisibleState = isVisible;
          setIsBioVisible(isVisible);
        }
        
        let currentBioViewProgress = 0;
        if (sectionTop < windowHeight && sectionBottom > 0) {
          const viewportTop = 0;
          const sectionEntered = sectionTop <= viewportTop;
          const sectionExited = sectionBottom <= viewportTop;
          
          if (sectionExited) {
            currentBioViewProgress = 1;
          } else if (sectionEntered) {
            const scrolled = viewportTop - sectionTop;
            currentBioViewProgress = Math.min(1, scrolled / sectionHeight);
          } else {
            const visibleHeight = windowHeight - sectionTop;
            currentBioViewProgress = Math.min(1, visibleHeight / sectionHeight);
          }
        } else if (sectionBottom <= 0) {
          currentBioViewProgress = 1;
        } else if (sectionTop >= windowHeight) {
          currentBioViewProgress = 0;
        }
        
        const newBioMaxViewProgress = Math.max(bioMaxViewProgressRef.current, currentBioViewProgress);
        bioMaxViewProgressRef.current = newBioMaxViewProgress;
        setBioMaxViewProgress(newBioMaxViewProgress);
        
        const bioViewProgressForText = newBioMaxViewProgress >= 0.7 
          ? Math.max(currentBioViewProgress, newBioMaxViewProgress)
          : currentBioViewProgress;
        
        let currentBioProgress = 0;
        if (bioViewProgressForText >= 0.7) {
          const revealStart = 0.7;
          const revealRange = 1.0 - revealStart;
          const revealProgress = (bioViewProgressForText - revealStart) / revealRange;
          currentBioProgress = Math.pow(Math.min(1, Math.max(0, revealProgress)), 0.8);
        } else {
          currentBioProgress = 0;
        }
        
        const newBioMaxScrollProgress = Math.max(bioMaxScrollProgressRef.current, currentBioProgress);
        bioMaxScrollProgressRef.current = newBioMaxScrollProgress;
        setBioMaxScrollProgress(newBioMaxScrollProgress);
        setBioScrollProgress(currentBioProgress);
        
        if (bioHeading) {
          const hasBeenHidden = newBioMaxViewProgress >= 0.7;
          
          if (hasBeenHidden) {
            bioHeading.style.setProperty('opacity', '0', 'important');
          } else {
            const targetOpacity = currentBioViewProgress < 0.7 ? "1" : "0";
            bioHeading.style.setProperty('opacity', targetOpacity, 'important');
          }
        }
      });
    };

    if (scroll) {
      scroll.on("scroll", handleBioScroll);
      return () => {
        scroll.off("scroll", handleBioScroll);
        bioObserver.disconnect();
      };
    }

    window.addEventListener("scroll", handleBioScroll, { passive: true });
    handleBioScroll();

    return () => {
      bioObserver.disconnect();
      window.removeEventListener("scroll", handleBioScroll);
    };
  }, [scroll]);

  const renderBioLine = (line, lineIndex) => {
    let globalBioCharIndex = 0;
    for (let i = 0; i < lineIndex; i++) {
      globalBioCharIndex += bioLines[i].replace(/\r?\n/g, "").length;
    }
    
    const bioChars = line.split("");
    return bioChars.map((bioChar, localIndex) => {
      const isSpace = bioChar === " ";
      const isPeriod = bioChar === ".";
      const globalBioIndex = globalBioCharIndex + localIndex;
      
      const bioCharProgress = bioTotalChars > 0 ? globalBioIndex / bioTotalChars : 0;
      const bioCharHasBeenRevealed = bioMaxScrollProgressRef.current >= bioCharProgress;
      
      const bioEffectiveProgress = bioCharHasBeenRevealed
        ? bioMaxScrollProgressRef.current
        : bioScrollProgress;
      
      const bioIsRevealed = bioEffectiveProgress >= bioCharProgress;
      
      let bioCharOpacity = 0;
      if (bioCharHasBeenRevealed) {
        bioCharOpacity = 1;
      } else if (bioEffectiveProgress > 0 && bioIsRevealed) {
        const revealThreshold = 0.01;
        const fadeStart = Math.max(0, bioCharProgress - revealThreshold);
        const fadeEnd = bioCharProgress + revealThreshold;
        
        if (bioEffectiveProgress >= fadeEnd) {
          bioCharOpacity = 1;
        } else if (bioEffectiveProgress >= fadeStart) {
          const fadeRange = fadeEnd - fadeStart;
          bioCharOpacity = fadeRange > 0 ? (bioEffectiveProgress - fadeStart) / fadeRange : 1;
        } else {
          bioCharOpacity = 0;
        }
      } else {
        bioCharOpacity = 0;
      }
      
      let shouldBreakAfterPeriod = false;
      if (isPeriod) {
        let nextIndex = localIndex + 1;
        while (nextIndex < bioChars.length && bioChars[nextIndex] === " ") {
          nextIndex++;
        }
        if (nextIndex < bioChars.length) {
          const nextChar = bioChars[nextIndex];
          const nextIsClosingQuote = nextChar === '"' || nextChar === '"' || nextChar === '"' || nextChar === "'" || nextChar === "'";
          shouldBreakAfterPeriod = !nextIsClosingQuote;
        } else {
          shouldBreakAfterPeriod = false;
        }
      }

      return (
        <React.Fragment key={`bio-${lineIndex}-${localIndex}`}>
          <span 
            className={`bio-char ${isSpace ? "bio-space-char" : ""}`}
            style={{ 
              opacity: bioCharHasBeenRevealed ? 1 : bioCharOpacity,
              transition: 'opacity 0.1s ease-out',
              willChange: 'opacity'
            }}
          >
            {bioChar}
          </span>
          {shouldBreakAfterPeriod && <br />}
        </React.Fragment>
      );
    });
  };

  const renderBioText = () => {
    return bioLines
      .map((line, lineIndex) => {
        if (line.trim().length === 0) {
          return lineIndex < bioLines.length - 1 ? <br key={`bio-empty-${lineIndex}`} /> : null;
        }
        return (
          <React.Fragment key={`bio-line-${lineIndex}`}>
            {renderBioLine(line, lineIndex)}
            {lineIndex < bioLines.length - 1 && <br />}
          </React.Fragment>
        );
      })
      .filter(Boolean);
  };

  useEffect(() => {
    if (bioHeadingRef.current) {
      bioHeadingRef.current.style.setProperty('opacity', '1', 'important');
    }
  }, []);

  return (
    <section className="bio-section" ref={bioSectionRef}>
      <h2 id="bio-heading" ref={bioHeadingRef} className="bio-heading">
        About
      </h2>
      <div className={`bio-content ${isBioVisible ? "bio-visible" : ""}`}>
        <p className="bio-text">
          <strong>{renderBioText()}</strong>
        </p>
      </div>
    </section>
  );
};

export default BioSection;

