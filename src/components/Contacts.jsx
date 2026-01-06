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
      {/* Paper Airplane with Infinity Trail Background */}
      <svg className="paper-plane-trail" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
        <g transform="translate(0,300) scale(0.1,-0.1)" fill="#55062d" stroke="none">
          <path d="M5799 2402 c-56 -43 -299 -180 -299 -168 0 7 12 18 27 25 26 12 234
            130 242 137 17 15 -31 8 -214 -31 -194 -41 -225 -50 -214 -58 13 -11 103 -57
            110 -57 23 0 5 23 -28 37 -21 9 -33 17 -28 19 31 11 279 63 282 60 3 -2 -33
            -23 -78 -46 -113 -57 -118 -61 -121 -89 -2 -20 -34 -42 -179 -126 -290 -169
            -567 -318 -874 -470 -524 -260 -764 -348 -1110 -407 -181 -30 -421 -31 -553 0
            -132 30 -135 33 -69 70 82 46 178 141 217 213 64 121 51 252 -35 347 -161 179
            -474 106 -541 -127 -46 -158 28 -327 189 -432 l57 -37 -32 -12 c-218 -80 -392
            -124 -833 -214 -436 -88 -573 -119 -757 -171 -293 -83 -506 -173 -676 -284
            -98 -65 -201 -155 -189 -167 4 -4 24 8 45 28 91 87 239 180 402 253 244 108
            542 190 1126 309 537 109 661 140 851 212 l91 35 59 -20 c117 -39 174 -46 358
            -45 422 1 776 110 1438 440 291 146 863 460 1005 552 21 14 22 13 22 -22 0
            -46 16 -46 37 -1 9 19 21 35 25 35 5 0 31 -11 58 -25 27 -14 52 -25 55 -25 8
            0 175 257 175 269 0 16 -14 13 -41 -7z m-15 -55 c-11 -12 -44 -59 -73 -103
            l-52 -82 -54 30 c-30 16 -55 31 -55 33 0 1 39 25 88 53 48 28 103 62 122 75
            41 29 52 26 24 -6z m-256 -152 c-12 -27 -28 -33 -28 -10 0 11 23 33 37 35 2 0
            -3 -11 -9 -25z m-2751 -291 c144 -70 192 -234 112 -384 -40 -75 -136 -166
            -223 -211 l-63 -33 -49 29 c-247 145 -286 454 -74 582 97 59 199 65 297 17z"/>
          <path d="M2521 1387 c-8 -10 -7 -14 2 -14 8 0 14 6 14 14 0 7 -1 13 -2 13 -2
            0 -8 -6 -14 -13z"/>
          <path d="M4725 1841 c-3 -5 -2 -12 3 -15 5 -3 9 1 9 9 0 17 -3 19 -12 6z"/>
          <path d="M4456 1572 c-3 -5 1 -9 9 -9 8 0 12 4 9 9 -3 4 -7 8 -9 8 -2 0 -6 -4
            -9 -8z"/>
          <path d="M5810 175 c-20 -24 -1 -49 43 -56 24 -4 34 -2 30 5 -4 6 -7 22 -7 36
            -1 19 -7 26 -27 28 -15 2 -31 -4 -39 -13z m58 -18 c4 -20 -25 -34 -40 -19 -15
            15 -1 44 19 40 10 -2 19 -11 21 -21z"/>
          <path d="M5836 161 c-4 -5 -2 -12 3 -15 5 -4 12 -2 15 3 4 5 2 12 -3 15 -5 4
            -12 2 -15 -3z"/>
        </g>
      </svg>

      {/* Static Contact Us Heading */}
      <div className="contact-heading">
        <h2 id="contact-heading">Contact Us</h2>
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
              <span className="circle-text">GET IN TOUCH</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Overlay */}
      <div className={`contact-form-overlay ${isExpanded ? 'show' : ''}`}>
        <div className="contact-form">
          <button
            type="button"
            className="close-btn"
            onClick={handleClose}
            aria-label="Close contact form"
          >
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