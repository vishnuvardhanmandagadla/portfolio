import React, { useState, useEffect, useRef } from 'react';
import { FiMail, FiX, FiUser, FiMessageSquare, FiSend, FiTag, FiChevronDown, FiCheck } from 'react-icons/fi';
import { useForm, ValidationError } from '@formspree/react';
import './ContactUs.css';

const ContactCircle = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState(false);
  const [state, handleSubmit] = useForm("xldovpjy");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const circleRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationId = useRef(null);

  const params = {
    attractionRadius: 300,
    maxPullDistance: 150,
    attractionStrength: 0.9,
    returnStrength: 0.5,
    damping: 0.85
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!circleRef.current) return;
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (isExpanded) return;

    const animate = () => {
      if (!circleRef.current) return;

      const rect = circleRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      setPosition(prevPos => {
        const targetX = mousePos.current.x - centerX;
        const targetY = mousePos.current.y - centerY;
        const distance = Math.sqrt(targetX ** 2 + targetY ** 2);

        if (distance < params.attractionRadius) {
          const progress = Math.min(1, distance / params.maxPullDistance);
          const pullX = targetX * progress * params.attractionStrength;
          const pullY = targetY * progress * params.attractionStrength;
          return { 
            x: prevPos.x * params.damping + pullX * (1 - params.damping),
            y: prevPos.y * params.damping + pullY * (1 - params.damping)
          };
        } else {
          const returnX = prevPos.x * (1 - params.returnStrength);
          const returnY = prevPos.y * (1 - params.returnStrength);
          return Math.abs(returnX) < 0.5 && Math.abs(returnY) < 0.5 ? 
            { x: 0, y: 0 } : 
            { x: returnX * params.damping, y: returnY * params.damping };
        }
      });

      animationId.current = requestAnimationFrame(animate);
    };

    animationId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId.current);
  }, [isExpanded]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleClick = () => {
    setIsExpanded(true);
  };

  const handleClose = () => {
    setIsExpanded(false);
    setPosition({ x: 0, y: 0 });
    setSelectedSubject("");
    setCustomSubject("");
    setIsDropdownOpen(false);
  };

  const handleSubjectSelect = (value) => {
    setSelectedSubject(value);
    setIsDropdownOpen(false);
    if (value !== "Other") {
      setCustomSubject("");
    }
  };

  const subjectOptions = [
    "Job Inquiry",
    "Project Collaboration",
    "Freelance Opportunity",
    "General Question",
    "Partnership Proposal",
    "Technical Support",
    "Feedback",
    "Other"
  ];

  const onSubmit = (e) => {
    handleSubmit(e);
  };

  return (
    <div className="contact-container">
      {/* Static Contact Us Heading */}
      <div className="contact-heading">
        <h1>CONTACT US</h1>
      </div>

      {/* Contact Circle */}
      <div className="contact-circle-container">
        <div 
          ref={circleRef}
          className={`circle-outer ${isExpanded ? 'expanded' : ''}`}
          onClick={handleClick}
        >
          <div 
            className="circle-inner"
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div className="circle-content">
              <FiMail className="mail-icon" />
              <span className="circle-text">Get in Touch</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Overlay */}
      <div className={`contact-form-overlay ${isExpanded ? 'show' : ''}`}>
        <div className="contact-form">
          <button className="close-btn" onClick={handleClose}>
            <FiX />
          </button>
          
          {state.succeeded ? (
            <div className="drawing-success-container">
              <svg className="drawing-animation" viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet">  
                <g transform="translate(0,180) scale(0.1,-0.1)"> 
                  <path d="M2250 1479 c-140 -21 -261 -39 -267 -39 -33 0 -7 -33 47 -60 33 -17 60 -27 60 -22 0 4 -26 21 -57 37 l-58 28 215 34 c118 18 240 35 270 37 72 5 70 5 70 16 0 13 19 15 -280 -31z"/> 
                  <path d="M2408 1432 c-196 -109 -211 -120 -249 -187 -17 -30 -35 -55 -40 -55 -5 0 -9 33 -9 74 l0 74 186 73 c103 40 183 74 178 76 -5 2 -90 -28 -189 -66 l-180 -69 -3 -83 c-2 -54 1 -85 9 -89 28 -18 -60 -119 -138 -158 -59 -31 -108 -41 -258 -58 -154 -16 -185 -28 -185 -72 0 -31 25 -72 44 -72 25 0 59 49 61 87 l3 38 87 7 c213 16 346 84 404 205 13 26 39 61 57 76 l34 29 66 -47 c37 -25 72 -44 78 -42 13 5 200 306 194 313 -3 2 -40 -53 -83 -123 -43 -71 -87 -140 -97 -155 l-19 -27 -70 46 -70 46 -31 -23 -32 -23 23 31 c12 18 37 43 54 56 42 31 307 178 326 181 15 2 29 26 14 24 -4 0 -79 -39 -165 -87z m-788 -525 c0 -20 -8 -42 -22 -57 l-21 -23 -19 23 c-25 31 -23 68 5 80 44 18 57 12 57 -23z"/> 
                  <path d="M1405 982 c-33 -16 -87 -51 -120 -79 l-60 -50 -135 -6 c-132 -7 -507 -51 -517 -61 -19 -19 339 -282 373 -274 7 2 57 59 112 128 121 152 178 208 193 193 18 -18 39 -162 46 -315 l6 -146 -39 -11 c-111 -33 -528 -77 -604 -65 -27 5 -46 15 -56 30 -24 35 -43 167 -44 294 0 78 -3 110 -10 100 -21 -32 -2 -274 28 -365 21 -61 44 -75 132 -75 132 0 449 38 547 65 48 14 52 17 58 53 13 80 -28 414 -55 447 -9 11 1 23 41 55 86 68 145 94 215 94 47 1 67 -4 83 -18 12 -11 21 -14 21 -8 0 20 -57 42 -107 42 -32 0 -68 -10 -108 -28z m-245 -199 c-28 -31 -88 -103 -133 -160 -49 -63 -86 -102 -94 -99 -45 18 -349 243 -340 252 10 11 454 61 556 63 l63 1 -52 -57z"/> 
                </g> 
              </svg>
              <div className="drawing-success-message">Message Sent!</div>
              <button 
                className="success-close-btn" 
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <h3>Contact Us</h3>
              <form onSubmit={onSubmit}>
                <div className="input-group">
                  <FiUser className="input-icon" />
                  <input 
                    id="name"
                    type="text" 
                    name="name"
                    placeholder="Your Name" 
                    required
                    minLength={2}
                    maxLength={50}
                    pattern="^[a-zA-Z\s'-]+$"
                    title="Name should contain only letters, spaces, hyphens, and apostrophes"
                    autoComplete="name"
                  />
                  <ValidationError 
                    prefix="Name" 
                    field="name"
                    errors={state.errors}
                  />
                </div>
                <div className="input-group">
                  <FiMail className="input-icon" />
                  <input 
                    id="email"
                    type="email" 
                    name="email"
                    placeholder="Your Email" 
                    required
                    maxLength={100}
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    title="Please enter a valid email address"
                    autoComplete="email"
                  />
                  <ValidationError 
                    prefix="Email" 
                    field="email"
                    errors={state.errors}
                  />
                </div>
                <div className="input-group">
                  <FiTag className="input-icon" />
                  {selectedSubject === "Other" ? (
                    <input 
                      id="subject"
                      type="text" 
                      name="subject"
                      placeholder="Please specify your subject"
                      required
                      minLength={5}
                      maxLength={100}
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                    />
                  ) : (
                    <div className="custom-dropdown" ref={dropdownRef}>
                      <input
                        type="hidden"
                        name="subject"
                        value={selectedSubject}
                        required
                      />
                      <div 
                        className="custom-dropdown-trigger"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        <span className={selectedSubject ? "selected-text" : "placeholder-text"}>
                          {selectedSubject || "Select Subject"}
                        </span>
                        <FiChevronDown className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} />
                      </div>
                      {isDropdownOpen && (
                        <div className="custom-dropdown-menu">
                          {subjectOptions.map((option) => (
                            <div
                              key={option}
                              className={`custom-dropdown-option ${selectedSubject === option ? 'selected' : ''}`}
                              onClick={() => handleSubjectSelect(option)}
                            >
                              {selectedSubject === option && <FiCheck className="check-icon" />}
                              <span>{option}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <ValidationError 
                    prefix="Subject" 
                    field="subject"
                    errors={state.errors}
                  />
                </div>
                <div className="input-group">
                  <FiMessageSquare className="input-icon" />
                  <textarea 
                    id="message"
                    name="message"
                    placeholder="Your Message" 
                    required
                    minLength={10}
                    maxLength={1000}
                    rows={5}
                    title="Message must be between 10 and 1000 characters"
                  ></textarea>
                  <ValidationError 
                    prefix="Message" 
                    field="message"
                    errors={state.errors}
                  />
                </div>
                <button type="submit" disabled={state.submitting}>
                  {state.submitting ? (
                    <span className="spinner"></span>
                  ) : (
                    <>
                      <FiSend className="send-icon" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactCircle;