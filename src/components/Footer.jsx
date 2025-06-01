import { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaYoutube, FaEnvelope, FaCode } from 'react-icons/fa';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Footer = () => {
  const [currentYear] = useState(new Date().getFullYear());
  const [hoveredItem, setHoveredItem] = useState(null);
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

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/vishnuvardhanmandagadla',
      icon: <FaGithub />,
      color: '#f3dbea',
      bgColor: '#34091e'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/vishnu-vardhan-412962285/',
      icon: <FaLinkedin />,
      color: '#f3dbea',
      bgColor: '#430c27'
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@Codeandcraftstudios',
      icon: <FaYoutube />,
      color: '#f3dbea',
      bgColor: '#55062d'
    },
    {
      name: 'Email',
      url: 'mailto:vishnuvardhanmandagdala@gamil.com',
      icon: <FaEnvelope />,
      color: '#f3dbea',
      bgColor: '#660033'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  const hoverEffect = {
    y: -5,
    transition: { type: "spring", stiffness: 500, damping: 15 }
  };

  const tapEffect = { scale: 0.95 };

  return (
    <footer 
      ref={ref}
      className="footer"
      style={{
        background: 'linear-gradient(135deg, #34091e 0%, #430c27 50%, #55062d 100%)',
        color: '#f3dbea',
        padding: '3rem 1rem',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(243, 219, 234, 0.1)'
      }}
    >
      {/* Animated background elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 2 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 50% 50%, #f3dbea 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      />
      
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
      }}>
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Logo/Brand */}
          <motion.div
            variants={itemVariants}
            style={{
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              style={{
                background: '#802754',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f3dbea'
              }}
            >
              <FaCode size={20} />
            </motion.div>
            <motion.span 
              style={{
                fontSize: '1.2rem',
                fontWeight: 600,
                letterSpacing: '1px'
              }}
            >
              Vishnu Vardhan
            </motion.span>
          </motion.div>

          {/* Social Links */}
          <motion.div
            variants={itemVariants}
            style={{
              display: 'flex',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}
          >
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={hoverEffect}
                whileTap={tapEffect}
                onMouseEnter={() => setHoveredItem(link.name)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  color: link.color,
                  fontSize: '1.4rem',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label={link.name}
              >
                <AnimatePresence>
                  {hoveredItem === link.name && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      style={{
                        position: 'absolute',
                        background: link.bgColor,
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        zIndex: -1
                      }}
                    />
                  )}
                </AnimatePresence>
                {link.icon}
              </motion.a>
            ))}
          </motion.div>

          {/* Copyright */}
          <motion.p
            variants={itemVariants}
            style={{
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
              fontWeight: 300,
              letterSpacing: '0.5px',
              opacity: 0.8
            }}
          >
            &copy; {currentYear} Vishnu Vardhan. All rights reserved.
          </motion.p>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            initial={{ width: 0 }}
            animate={{ width: '150px' }}
            transition={{ delay: 0.5, duration: 1 }}
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(243, 219, 234, 0.3), transparent)',
              margin: '1rem 0',
              width: '150px'
            }}
          />

          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            style={{
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              opacity: 0.6,
              marginTop: '1rem'
            }}
          >
            Crafting Digital Excellence
          </motion.p>
        </motion.div>
      </div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            opacity: 0
          }}
          animate={{
            x: [null, Math.random() * 100 - 50],
            y: [null, Math.random() * 100 - 50],
            opacity: [0, 0.4, 0],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#f3dbea',
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
            filter: 'blur(0.5px)'
          }}
        />
      ))}
    </footer>
  );
};

export default Footer;