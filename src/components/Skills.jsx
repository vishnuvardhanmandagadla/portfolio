import React, { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { FaPython, FaReact, FaHtml5, FaCss3Alt, FaJava } from "react-icons/fa";
import { SiDjango, SiC, SiJavascript, SiFirebase, SiTailwindcss } from "react-icons/si";
import "./Skills.css"; // Import the CSS file

const Skills = () => {
  const controls = useAnimation();
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          controls.start("visible"); // Trigger animation when in view
          if (entry.intersectionRatio > 0.7) {
            // Add watermark effect when heading is visible
            sectionRef.current.querySelector('.skills-heading').classList.add('watermark');
          }
        } else {
          controls.start("hidden"); // Reverse animation when out of view
          sectionRef.current.querySelector('.skills-heading').classList.remove('watermark');
        }
      });
    };
  
    const observer = new IntersectionObserver(handleScroll, {
      threshold: 0.7, // 70% of the section is visible
    });
  
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
  
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [controls]);
  

  const headingAnimation = {
    hidden: { opacity: 0, y: 50 }, // Letters move down and fade out
    visible: (i) => ({
      opacity: 1,
      y: 0, // Letters rise up and become visible
      transition: {
        delay: i * 0.1, // Stagger each letter's animation
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  const skills = [
    { name: "Python", icon: <FaPython style={{ color: "#420032" }} /> },
    { name: "React", icon: <FaReact style={{ color: "#420032" }} /> },
    { name: "Django", icon: <SiDjango style={{ color: "#420032" }} /> },
    { name: "HTML", icon: <FaHtml5 style={{ color: "#420032" }} /> },
    { name: "CSS", icon: <FaCss3Alt style={{ color: "#420032" }} /> },
    { name: "JavaScript", icon: <SiJavascript style={{ color: "#420032" }} /> },
    { name: "Firebase", icon: <SiFirebase style={{ color: "#420032" }} /> },
    { name: "Tailwind CSS", icon: <SiTailwindcss style={{ color: "#420032" }} /> },
    { name: "C", icon: <SiC style={{ color: "#420032" }} /> },
    { name: "Java (Basic)", icon: <FaJava style={{ color: "#420032" }} /> },
  ];
  

  return (
    <section id="skills" className="skills" ref={sectionRef}>
      <motion.div
        className="skills-heading"
        initial="hidden"
        animate={controls}
      >
        {"SKILLS".split("").map((letter, index) => (
          <motion.span
            key={index}
            custom={index}
            variants={headingAnimation}
            className="skills-letter"
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>
      <motion.ul
        className="skills-list"
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
              delay: 1.0, 
            },
          },
        }}
      >
        {skills.map((skill, index) => (
          <motion.li
            key={index}
            className="skill-item"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{
              scale: 2.2,
              transition: { duration: 0.2, ease: "easeInOut" },
            }}
          >
            <span className="skill-icon">{skill.icon}</span>
            <span className="skill-name">{skill.name}</span>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
};

export default Skills;
