import React, { useEffect, useRef, useState } from "react";
import "./About.css";

const About = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [revealedChars, setRevealedChars] = useState([]);
  
  // Properly spaced content with HTML tags preserved
  const contentText = `"I enjoy simplifying complex ideas into user-friendly apps, tackling challenges with flexibility, and creating solutions that connect technology with innovation."`;

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      const heading = headingRef.current;
      const sectionTop = section.getBoundingClientRect().top;
      const sectionHeight = section.offsetHeight;
      const windowHeight = window.innerHeight;

      const is70PercentVisible = sectionTop < windowHeight * 0.1 && sectionTop + sectionHeight > windowHeight * 0.1;

      if (is70PercentVisible) {
        setIsContentVisible(true);
        heading.style.opacity = "0";
      } else {
        setIsContentVisible(false);
        heading.style.opacity = "1";
        setRevealedChars([]);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isContentVisible) return;

    const totalChars = contentText.length;
    const revealDuration = 3000;
    const charDelay = 30;
    const fillDuration = 500;

    let currentChar = 0;
    const timers = [];

    const revealNextChar = () => {
      if (currentChar >= totalChars) return;

      const charIndex = currentChar;
      
      // Skip revealing the HTML tags - they should appear instantly
      if (contentText[charIndex] === '<') {
        const tagEnd = contentText.indexOf('>', charIndex);
        if (tagEnd !== -1) {
          // Reveal the entire tag at once
          for (let i = charIndex; i <= tagEnd; i++) {
            setRevealedChars(prev => [...prev, { index: i, phase: 'filled' }]);
          }
          currentChar = tagEnd + 1;
          timers.push(setTimeout(revealNextChar, charDelay));
          return;
        }
      }

      setRevealedChars(prev => [...prev, { index: charIndex, phase: 'transparent' }]);
      
      timers.push(setTimeout(() => {
        setRevealedChars(prev => {
          const newChars = [...prev];
          const charState = newChars.find(c => c.index === charIndex);
          if (charState) charState.phase = 'filling';
          return newChars;
        });
        
        timers.push(setTimeout(() => {
          setRevealedChars(prev => {
            const newChars = [...prev];
            const charState = newChars.find(c => c.index === charIndex);
            if (charState) charState.phase = 'filled';
            return newChars;
          });
        }, fillDuration));
      }, 100));

      currentChar++;
      timers.push(setTimeout(revealNextChar, charDelay));
    };

    revealNextChar();

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [isContentVisible]);

  const renderText = () => {
    let result = [];
    let charIndex = 0;
    let insideStrong1 = false;
    
    while (charIndex < contentText.length) {
      if (contentText[charIndex] === '<') {
        // Handle HTML tags
        const tagEnd = contentText.indexOf('>', charIndex);
        if (tagEnd === -1) break;
        
        const fullTag = contentText.substring(charIndex, tagEnd + 1);
        if (fullTag === '<strong1>') {
          insideStrong1 = true;
          result.push(<span key={charIndex} className="strong1-tag">{fullTag}</span>);
        } else if (fullTag === '</strong1>') {
          insideStrong1 = false;
          result.push(<span key={charIndex} className="strong1-tag">{fullTag}</span>);
        } else {
          result.push(fullTag);
        }
        charIndex = tagEnd + 1;
      } else {
        // Handle regular text and spaces
        const charState = revealedChars.find(c => c.index === charIndex);
        
        let charStyle = {};
        if (charState) {
          switch (charState.phase) {
            case 'transparent':
              charStyle = { 
                opacity: 0.3,
                color: insideStrong1 ? 'rgba(255,255,255,0.3)' : 'rgba(242,194,223,0.3)'
              };
              break;
            case 'filling':
              charStyle = { 
                opacity: 1,
                color: insideStrong1 ? '#ffffff' : '#f2c2df',
                textShadow: `0 0 8px ${insideStrong1 ? '#ffffff' : '#f2c2df'}`,
                transition: 'all 0.3s ease-out'
              };
              break;
            case 'filled':
              charStyle = { 
                opacity: 1,
                color: insideStrong1 ? '#ffffff' : '#f2c2df'
              };
              break;
            default:
              charStyle = { opacity: 0 };
          }
        } else {
          charStyle = { opacity: 0 };
        }

        const char = contentText[charIndex];
        const isSpace = char === ' ';
        
        const charElement = (
          <span 
            key={charIndex} 
            className={`char ${insideStrong1 ? 'strong1-char' : ''} ${isSpace ? 'space-char' : ''}`}
            style={charStyle}
          >
            {char}
          </span>
        );

        result.push(charElement);
        charIndex++;
      }
    }
    
    return result;
  };

  return (
    <section id="about" className="about" ref={sectionRef}>
      <h2 ref={headingRef} className="about-heading">About</h2>

      <div className={`about-content ${isContentVisible ? "visible" : ""}`}>
        <p>
          <strong>
            {renderText()}
          </strong>
        </p>
      </div>
    </section>
  );
};

export default About;