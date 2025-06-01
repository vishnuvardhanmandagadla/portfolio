import React, { useEffect, useRef, useState } from "react";
import { FaPython, FaReact, FaHtml5, FaCss3Alt, FaJava } from "react-icons/fa";
import { SiDjango, SiC, SiJavascript, SiFirebase, SiTailwindcss } from "react-icons/si";

const App = () => {
  const circleRef = useRef(null);
  const [angle, setAngle] = useState(0);
  const [bottomSkill, setBottomSkill] = useState("");

 // Mapping of skills to their respective icons
const skills = [
  { name: "JavaScript", icon: <SiJavascript size={120} style={{ color: "#34091e" }} /> },
  { name: "React", icon: <FaReact size={120} style={{ color: "#34091e" }} /> },
  { name: "CSS", icon: <FaCss3Alt size={120} style={{ color: "#34091e" }} /> },
  { name: "Python", icon: <FaPython size={120} style={{ color: "#34091e" }} /> },
  { name: "HTML", icon: <FaHtml5 size={120} style={{ color: "#34091e" }} /> },
  { name: "Django", icon: <SiDjango size={120} style={{ color: "#34091e" }} /> },
  { name: "Firebase", icon: <SiFirebase size={120} style={{ color: "#34091e" }} /> },
  { name: "Java", icon: <FaJava size={120} style={{ color: "#34091e" }} /> },
];

  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newAngle = scrollTop / 1; // Adjust the speed of rotation
      setAngle(newAngle); // Set the new angle based on scroll position
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const radius = 300; // Radius of the circle
    const totalItems = skills.length; // Total number of items
    const rotationAngle = 360 / totalItems; // Angle between each item
    const items = Array.from(circleRef.current.children);
  
    // Position items in a circle based on their index
    items.forEach((item, index) => {
      const angleInRadians = ((index * rotationAngle - angle) * Math.PI) / 180; // Adjust the angle offset
      const x = radius * Math.cos(angleInRadians);
      const y = radius * Math.sin(angleInRadians);
  
      item.style.transform = `translate(${x}px, ${y}px)`; // Update the position of the item
    });
  
    // Find the skill closest to the bottom
    let closestToBottom = null;
    let closestDistance = Infinity;
  
    items.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const circleRect = circleRef.current.getBoundingClientRect();
  
      // Distance from the bottom of the circle
      const distanceFromBottom =
        itemRect.top + itemRect.height / 2 - (circleRect.top + circleRect.height);
  
      if (Math.abs(distanceFromBottom) < closestDistance) {
        closestDistance = Math.abs(distanceFromBottom);
        closestToBottom = skills[index].name; // Set the closest skill's name
      }
    });
  
    setBottomSkill(closestToBottom); // Update the bottom skill name
  }, [angle, skills]);
  

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>My Skills</h1>
      <div ref={circleRef} style={styles.circle}>
        {skills.map((skill, index) => (
          <div key={index} style={styles.skill}>
            {skill.icon}
          </div>
        ))}
      </div>
      <div style={styles.bottomSkill}>
        {bottomSkill ? ` ${bottomSkill}` : ""}
      </div>
      <div style={styles.scrollSpace}></div>
    </div>
  );
};


const styles = {
  container: {
    textAlign: "center",
    margin: 0,
    padding: 0,
    fontFamily: "Arial, sans-serif",
    overflow: "hidden", // Hide any overflowing content
    backgroundColor: "white", // Background color of the container
    minHeight: "100vh", // Ensure the container covers the full viewport height
    position: "relative", // Ensure child elements are positioned relative to this container
  },
  heading: {
    marginTop: "50px", // Adjust the margin to move the heading vertically
    fontSize: "2rem", // Adjust the font size for the heading
    fontWeight: "bold",
    color: "black", // Black color for the heading
  },
  circle: {
    position: "absolute", // Position the circle relative to the container
    top: "10%", // Move the circle slightly downward (increase percentage for more downward movement)
    left: "50%", // Center the circle horizontally
    transform: "translate(-50%, -50%)", // Perfect centering for the circle
    width: "1000px", // Diameter of the circle
    height: "800px", // Match height to width for a perfect circle
    display: "flex", // Flexbox layout for centering children
    alignItems: "center", // Center children vertically within the circle
    justifyContent: "center", // Center children horizontally within the circle
    overflow: "hidden", // Hide overflowing elements within the circle
    //backgroundColor: "#f0f0f0", // Light gray background for better contrast
    borderRadius: "50%", // Make it a perfect circle
    //border: "5px solid #000", // Black border around the circle
    
  },
  skill: {
    position: "absolute", // Absolute positioning for individual skills
    textAlign: "center", // Center-align text within each skill container
    fontSize: "1rem", // Adjust font size for skill names
    fontWeight: "bold",
    whiteSpace: "nowrap", // Prevent text wrapping
    transformOrigin: "center", // Keep text orientation fixed relative to the circle
    color: "black", // Black color for skill names
  },
  bottomSkill: {
    marginTop: "20px", // Add spacing above the bottom skill display
    fontSize: "4.5rem", // Adjust font size for the bottom skill text
    fontWeight: "bold",
    color: "black", // Black color for bottom skill text
    position: "fixed", // Fix the position at the bottom of the viewport
    bottom: "50px", // Adjust the vertical position in pixels
    left: "50%", // Center horizontally in the viewport
    transform: "translateX(-50%)", // Correct centering based on the element's width
  },
  scrollSpace: {
    height: "100vh", // Create enough vertical space for scrolling (adjust as needed)
    fontSize: "1.2rem", // Adjust font size for the scroll instruction text
    marginTop: "20px", // Add spacing above the text
    color: "black", // Black color for the scroll instruction text
  },
};


export default App;


