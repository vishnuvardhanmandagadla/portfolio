import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { FaArrowRight } from "react-icons/fa";
import { projects } from "../data/projects";
import { usePageTransition } from "../App";
import "./Projects.css";

const Projects = () => {
  const navigate = useNavigate();
  const transition = usePageTransition();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.7,
  });

  // Navigate with fog transition
  const handleProjectClick = (slug) => {
    if (transition?.triggerTransition) {
      transition.triggerTransition(() => {
        navigate(`/projects/${slug}`);
      });
    } else {
      navigate(`/projects/${slug}`);
    }
  };

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
            key={project.slug}
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
            <FlipLink
              label={project.title}
              onClick={() => handleProjectClick(project.slug)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const DURATION = 0.25;
const STAGGER = 0.025;

const FlipLink = ({ label, onClick }) => {
  return (
    <motion.button
      initial="initial"
      whileHover="hovered"
      type="button"
      onClick={onClick}
      className="project-trigger relative block overflow-hidden whitespace-nowrap text-4xl font-black uppercase sm:text-6xl md:text-7xl lg:text-8xl text-white group"
      style={{ lineHeight: 1.0 }}
    >
      {/* First Layer */}
      <div className="first-layer inline-flex items-center h-full">
        {label.split("").map((l, i) => (
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
        <motion.div 
          className="arrow-container ml-6 opacity-0 group-hover:opacity-100 flex items-center justify-center"
          initial={{ scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
        >
          <div className="circle-bg rounded-full bg-white p-3 flex items-center justify-center">
            <motion.div
              whileHover={{ rotate: 45 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <FaArrowRight className="arrow-icon text-black" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Second Layer */}
      <div className="absolute inset-0 inline-flex items-center h-full overflow-hidden">
        {label.split("").map((l, i) => (
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
        <div className="arrow-container ml-6 flex items-center justify-center">
          <div className="circle-bg rounded-full bg-white p-3 flex items-center justify-center">
            <FaArrowRight className="arrow-icon text-black text-lg" />
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default Projects;