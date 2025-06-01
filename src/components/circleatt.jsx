import React, { useState, useEffect } from 'react';
import './ContactUs.css';

const ContactUs = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isNear, setIsNear] = useState(false);
  const attractionFactor = 1.2; // Stronger attraction
  const distanceThreshold = 250; // Increased threshold for effect

  useEffect(() => {
    let animationFrame;

    const animate = (newX, newY) => {
      setPosition((prev) => ({
        x: prev.x + (newX - prev.x) * 0.1, // Smoother transition
        y: prev.y + (newY - prev.y) * 0.1,
      }));
      animationFrame = requestAnimationFrame(() => animate(newX, newY));
    };

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const handleMouseMove = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const circle = document.getElementById('circle');
    if (!circle) return;
    const circleRect = circle.getBoundingClientRect();
    const circleCenterX = circleRect.left + circleRect.width / 2;
    const circleCenterY = circleRect.top + circleRect.height / 2;

    const distance = Math.sqrt(
      Math.pow(mouseX - circleCenterX, 2) + Math.pow(mouseY - circleCenterY, 2)
    );

    if (distance < distanceThreshold) {
      setIsNear(true);
      setPosition({
        x: (mouseX - circleCenterX) * attractionFactor,
        y: (mouseY - circleCenterY) * attractionFactor,
      });
    } else {
      setIsNear(false);
      setPosition({ x: 0, y: 0 });
    }
  };

  return (
    <div
      className="circle-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
    >
      <div id="circle" className={`circle-border ${isNear ? 'no-border' : ''}`}>
        <div
          className="circle-inner"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: 'transform 0.2s ease-out',
          }}
        />
      </div>
    </div>
  );
};

export default ContactUs;