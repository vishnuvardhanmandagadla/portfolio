import React, { useEffect, useRef, useState } from "react";
import ReactTypingEffect from "react-typing-effect";
import { gsap } from "gsap";
import "./Hero.css";

const Hero = () => {
  const nameRef = useRef(null);
  const heroRef = useRef(null);
  const [ripples, setRipples] = useState([]);
  const [shapes, setShapes] = useState([]);
  const activeShapesRef = useRef(new Set());

  useEffect(() => {
    // Initialize non-colliding random shapes when component mounts
    const initialShapes = generateNonCollidingShapes(20);
    setShapes(initialShapes);

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

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reverseDisperseEffect();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });

    const currentRef = nameRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
        observer.disconnect();
      }
    };
  }, []);

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
            lastActivatedBy: null
          });
          
          grid[xGrid][yGrid] = true;
          placed = true;
        }
      }
    }
    return newShapes;
  };

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

  const createRipple = (e) => {
    if (!heroRef.current) return;
    
    const rect = heroRef.current.getBoundingClientRect();
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
    
    // Track which shapes this ripple activates
    const activatedShapes = new Set();
    
    const animateRipple = () => {
      setRipples(prev => prev.map(r => {
        if (r.id === rippleId) {
          const progress = r.progress + 0.02;
          const radius = r.size * 7.5 * progress;
          
          setShapes(prevShapes => 
            prevShapes.map(shape => {
              const shapeX = (shape.x / 100) * rect.width;
              const shapeY = (shape.y / 100) * rect.height;
              const distance = Math.sqrt(
                Math.pow(r.x - shapeX, 2) + 
                Math.pow(r.y - shapeY, 2)
              );
              
              const isActive = distance < radius + (shape.size / 2);
              
              if (isActive) {
                activatedShapes.add(shape.id);
                activeShapesRef.current.add(shape.id);
                return {
                  ...shape,
                  active: true,
                  scale: 1.2,
                  lastActivatedBy: rippleId
                };
              }
              return shape;
            })
          );
          
          if (progress >= 1) {
            // When ripple completes, fade out its shapes
            setTimeout(() => {
              setShapes(prevShapes => 
                prevShapes.map(shape => {
                  if (activatedShapes.has(shape.id)) {
                    activeShapesRef.current.delete(shape.id);
                    return {
                      ...shape,
                      active: false,
                      scale: 1
                    };
                  }
                  return shape;
                })
              );
            }, 50);
            return null;
          }
          return {...r, progress, radius};
        }
        return r;
      }).filter(Boolean));
      
      if (newRipple.progress < 1) {
        requestAnimationFrame(animateRipple);
      }
    };
    
    requestAnimationFrame(animateRipple);
    
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 1000);
  };

  const renderShape = (shape) => {
    const style = {
      left: `${shape.x}%`,
      top: `${shape.y}%`,
      width: `${shape.size}px`,
      height: `${shape.size}px`,
      opacity: shape.active ? 0.7 : 0,
      transform: `translate(-50%, -50%) rotate(${shape.rotation}deg) scale(${shape.scale})`,
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: 1,
      transition: shape.active 
        ? 'all 0.2s ease-out' 
        : 'opacity 0.3s ease-out, transform 0.4s ease-out',
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
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="ripple"
            style={{
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
              width: `${ripple.size}px`,
              height: `${ripple.size}px`,
              transform: `translate(-50%, -50%) scale(${ripple.progress * 15})`,
              opacity: 0.3 * (1 - ripple.progress),
            }}
          />
        ))}
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

        <h1 className="name-animation" ref={nameRef}>
          <span className="light-text"> I'm </span>
          <br />
          <span className="bold-text">
            {"Vishnu Vardhan".split("").map((letter, index) => (
              <span key={index} className="letter">
                {letter}
              </span>
            ))}
          </span>
        </h1>

        <div className="highlighted-text">
          <span className="big-brace">{"{"}</span>
          <span className="masked-word">Developer</span>
          <div className="divider"></div>
          <span className="masked-word">Designer</span>
          <div className="divider"></div>
          <span className="masked-word">Dreamer</span>
          <span className="big-brace">{"}"}</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;