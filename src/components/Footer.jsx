import { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaYoutube, FaEnvelope, FaCode, FaArrowUp, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './Footer.css';

const Footer = () => {
  const [currentYear] = useState(new Date().getFullYear());
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/vishnuvardhanmandagadla',
      icon: <FaGithub />,
      color: '#f3dbea',
      bgColor: 'linear-gradient(135deg, #34091e 0%, #430c27 100%)'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/vishnu-vardhan-412962285/',
      icon: <FaLinkedin />,
      color: '#f3dbea',
      bgColor: 'linear-gradient(135deg, #430c27 0%, #55062d 100%)'
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@Codeandcraftstudios',
      icon: <FaYoutube />,
      color: '#f3dbea',
      bgColor: 'linear-gradient(135deg, #55062d 0%, #660033 100%)'
    },
    {
      name: 'Email',
      url: 'mailto:vishnuvardhanmandagdala@gmail.com',
      icon: <FaEnvelope />,
      color: '#f3dbea',
      bgColor: 'linear-gradient(135deg, #660033 0%, #802754 100%)'
    }
  ];

  const quickLinks = [
    { name: 'Home', url: '#home', icon: <FaArrowRight /> },
    { name: 'About', url: '#about', icon: <FaArrowRight /> },
    { name: 'Projects', url: '#projects', icon: <FaArrowRight /> },
    { name: 'Skills', url: '#skills', icon: <FaArrowRight /> },
    { name: 'Contact', url: '#contact', icon: <FaArrowRight /> }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        duration: 0.5
      }
    }
  };

  const linkVariants = {
    hidden: { x: -8, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    },
    hover: {
      x: 6,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const socialHoverEffect = {
    scale: 1.08,
    y: -2,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 15 
    }
  };

  const scrollTopHoverEffect = {
    scale: 1.1,
    y: -3,
    transition: { 
      type: "spring", 
      stiffness: 500, 
      damping: 15 
    }
  };

  const tapEffect = { scale: 0.92 };

  return (
    <footer ref={ref} className="footer">
      {/* Compact Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 15 }}
            onClick={scrollToTop}
            whileHover={scrollTopHoverEffect}
            whileTap={tapEffect}
            className="scroll-top-button"
            aria-label="Scroll to top"
          >
            <motion.div
              animate={{ y: [0, -1, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <FaArrowUp />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Background Elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 1.5 }}
        className="footer-background"
      />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="footer-pattern"
      />
      
      <div className="footer-container">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          {/* Compact Main Footer Content */}
          <div className="footer-grid">
            {/* Brand Section */}
            <motion.div variants={itemVariants}>
              <div className="footer-brand">
                <motion.div
                  whileHover={{ 
                    rotate: 12,
                    scale: 1.03 
                  }}
                  transition={{ 
                    duration: 0.4,
                    type: "spring",
                    stiffness: 300
                  }}
                  className="footer-logo"
                >
                  <FaCode />
                </motion.div>
                <div>
                  <h3 className="footer-name">
                    Vishnu Vardhan
                  </h3>
                  <p className="footer-tagline">
                    Full Stack Developer
                  </p>
                </div>
              </div>
              <p className="footer-description">
                Crafting digital excellence through innovative solutions and clean code.
              </p>
              
              {/* Contact Info */}
              <div className="footer-contact">
                <div className="footer-contact-item">
                  <FaMapMarkerAlt />
                  <span>India</span>
                </div>
                <div className="footer-contact-item">
                  <FaEnvelope />
                  <span>vishnuvardhanmandagdala@gmail.com</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h4 className="footer-section-title">
                Navigation
              </h4>
              <ul className="footer-links">
                {quickLinks.map((link, index) => (
                  <motion.li 
                    key={link.name} 
                    className="footer-link-item"
                    variants={linkVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ delay: index * 0.05 }}
                  >
                    <a
                      href={link.url}
                      className="footer-link"
                    >
                      <span className="footer-link-arrow">
                        {link.icon}
                      </span>
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Connect Section */}
            <motion.div variants={itemVariants}>
              <h4 className="footer-section-title">
                Connect
              </h4>
              
              <ul className="footer-links footer-social-links">
                {socialLinks.map((link, index) => (
                  <motion.li 
                    key={link.name} 
                    className="footer-link-item"
                    variants={linkVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ delay: index * 0.05 }}
                  >
                    <a
                      href={link.url}
                      target={link.name === 'Email' ? '_self' : '_blank'}
                      rel={link.name === 'Email' ? '' : 'noopener noreferrer'}
                      className="footer-link"
                    >
                      <span className="footer-link-arrow">
                        {link.icon}
                      </span>
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Compact Bottom Section */}
          <motion.div
            variants={itemVariants}
            className="footer-bottom"
          >
            {/* Divider */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '120px' }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="footer-divider"
            />

            {/* Copyright */}
            <div className="footer-copyright">
              <span>&copy; {currentYear} Vishnu Vardhan</span>
              <span className="footer-copyright-separator">•</span>
              <span>All rights reserved</span>
            </div>

            {/* Additional Links */}
            <div className="footer-legal-links">
              <a href="/privacy" className="footer-legal-link">
                Privacy Policy
              </a>
              <a href="/terms" className="footer-legal-link">
                Terms of Use
              </a>
              <a href="/sitemap" className="footer-legal-link">
                Sitemap
              </a>
            </div>

            {/* Motto */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ delay: 0.5 }}
              className="footer-motto"
            >
              Crafting Digital Excellence
            </motion.p>
          </motion.div>
        </motion.div>
      </div>

      {/* Reduced floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * 80 - 40,
            y: Math.random() * 80 - 40,
            opacity: 0
          }}
          animate={{
            x: [null, Math.random() * 80 - 40],
            y: [null, Math.random() * 80 - 40],
            opacity: [0, 0.3, 0],
            scale: [0.7, 1, 0.7]
          }}
          transition={{
            duration: Math.random() * 12 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: "easeInOut"
          }}
          className="floating-particle"
          style={{
            top: `${Math.random() * 70 + 15}%`,
            left: `${Math.random() * 70 + 15}%`,
          }}
        />
      ))}
    </footer>
  );
};

export default Footer;