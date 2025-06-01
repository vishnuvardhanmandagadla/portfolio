import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaLink } from "react-icons/fa";
import "./Projects.css";

const projects = [
  { name: "Smart Attendance Manager", link: "https://github.com/vishnuvardhanmandagadla/AttendanceManager-main" },
  { name: "Thyroid Nodule Detection", link: "https://github.com/vishnuvardhanmandagadla/thyroid-nodule-detection" },
  { name: "Student Communication Platform", link: "https://student-communication-vs.web.app/" },
  { name: "Time Table Generator", link: "#" },
  { name: "SETHU Web App", link: "https://sethu-sbp.web.app/" },
];

const Projects = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.7,
  });

  return (
    <div className="project-container relative py-24" ref={ref}>
      {/* Glitch Watermark */}
      <motion.div 
        className="watermark-text"
        initial={{ opacity: 0 }}
        animate={inView ? {
          opacity: 0.2,
          x: [0, -15, 15, -10, 10, 0],
          y: [0, -5, 5, -3, 3, 0],
          textShadow: [
            "0 0 0px #fff",
            "0 0 10px #ff00ff",
            "0 0 20px #00ffff",
            "0 0 10px #ff00ff",
            "0 0 0px #fff"
          ],
          clipPath: [
            "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
            "polygon(0 10%, 100% 10%, 100% 30%, 0 30%)",
            "polygon(0 60%, 100% 60%, 100% 80%, 0 80%)",
            "polygon(0 40%, 100% 40%, 100% 60%, 0 60%)",
            "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"
          ]
        } : {}}
        transition={{ 
          duration: 1.2, 
          delay: 0.2,
          x: { times: [0, 0.1, 0.2, 0.3, 0.4, 1] },
          y: { times: [0, 0.1, 0.2, 0.3, 0.4, 1] },
          textShadow: { times: [0, 0.3, 0.6, 0.8, 1] },
          clipPath: { times: [0, 0.2, 0.4, 0.6, 0.8, 1] }
        }}
      >
        PROJECTS
      </motion.div>

      <div className="grid place-content-center gap-8 px-8 py-12 relative">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { 
              opacity: 1, 
              y: 0,
              transition: { 
                type: "spring",
                stiffness: 100,
                damping: 10,
                delay: 0.8 + index * 0.15 
              }
            } : {}}
          >
            <FlipLink href={project.link}>
              {project.name}
            </FlipLink>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const DURATION = 0.25;
const STAGGER = 0.025;

const FlipLink = ({ children, href }) => {
  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block overflow-hidden whitespace-nowrap text-4xl font-black uppercase sm:text-6xl md:text-7xl lg:text-8xl text-white group"
      style={{ lineHeight: 1.0 }}
    >
      {/* First Layer */}
      <div className="first-layer inline-flex items-center h-full">
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: { y: 0 },
              hovered: { y: "-100%" },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block h-full"
            key={i}
          >
            {l === " " ? "\u00A0" : l}
          </motion.span>
        ))}
        <motion.span 
          className="link-icon-container ml-6 opacity-0 group-hover:opacity-100"
          initial={{ scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
        >
          <FaLink className="link-icon" />
        </motion.span>
      </div>

      {/* Second Layer */}
      <div className="absolute inset-0 inline-flex items-center h-full overflow-hidden">
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: { y: "100%" },
              hovered: { y: 0 },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block h-full text-pink-200"
            key={i}
          >
            {l === " " ? "\u00A0" : l}
          </motion.span>
        ))}
        <span className="link-icon-container ml-6">
          <FaLink className="link-icon" />
        </span>
      </div>
    </motion.a>
  );
};

export default Projects;