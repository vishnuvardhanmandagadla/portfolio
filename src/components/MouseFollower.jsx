import React, { useEffect, useRef } from "react";
import "./MouseFollower.css";

const MouseFollower = () => {
  const followerRef = useRef(null);
  const targetPosition = useRef({ x: 0, y: 0 });
  const currentPosition = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef(null);

  useEffect(() => {
    const follower = followerRef.current;
    if (!follower) return;

    // Initialize position at center of screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    targetPosition.current = { x: centerX, y: centerY };
    currentPosition.current = { x: centerX, y: centerY };
    
    follower.style.transform = `translate(${centerX}px, ${centerY}px) translate(-50%, -50%) translateZ(0)`;

    const handleMouseMove = (e) => {
      targetPosition.current = { x: e.clientX, y: e.clientY };
    };

    // Smooth animation loop
    const animate = () => {
      const { x: targetX, y: targetY } = targetPosition.current;
      const { x: currentX, y: currentY } = currentPosition.current;

      // Calculate distance
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only update if there's movement needed
      if (distance > 0.5) {
        // Smooth interpolation factor (lower = slower, more delayed)
        const lerp = 0.15;
        
        currentPosition.current = {
          x: currentX + dx * lerp,
          y: currentY + dy * lerp,
        };

        if (follower) {
          follower.style.transform = `translate(${currentPosition.current.x}px, ${currentPosition.current.y}px) translate(-50%, -50%) translateZ(0)`;
        }
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Start animation loop
    animationFrameId.current = requestAnimationFrame(animate);

    // Add mouse move event listener
    document.addEventListener("mousemove", handleMouseMove);

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div
      ref={followerRef}
      className="mouse-follower"
      aria-hidden="true"
    />
  );
};

export default MouseFollower;
