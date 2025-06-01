import React, { useRef } from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import scVideo from "../assets/sc.mp4"; // Adjust the video path as needed

export const Video = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null); // Reference for the video element

  // Scroll hook to get scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"], // Ensures the video becomes active when fully in view
  });

  // Scaling effect: The video starts expanding based on scroll
  const scale = useTransform(scrollYProgress, [0, 1], [-1, 0.95]); // Starts small and expands to fit the screen

  // Function to handle fullscreen on video click
  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen(); // Open video in fullscreen mode
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen(); // For Safari browsers
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen(); // For IE/Edge browsers
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative h-screen bg-pink-500 flex items-center justify-center" // Pink background
    >
      {/* Video element */}
      <motion.video
        ref={videoRef} // Attach ref to the video element
        src={scVideo} // Video URL or local path
        className="absolute z-10 rounded-md cursor-pointer" // Add cursor pointer to indicate interactivity
        style={{
          scale, // Apply the scaling effect based on scroll progress (small to large)
          width: "100%", // Full width when the video reaches its full size
          height: "auto", // Maintain aspect ratio
        }}
        muted
        loop
        autoPlay // Ensure the video plays automatically
        playsInline // Ensures video plays inline on mobile devices
        controls={false} // Hide video controls
        onClick={handleFullscreen} // Trigger fullscreen mode on click
      />
      {/* Optional: Background overlay */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
};

export default Video;
