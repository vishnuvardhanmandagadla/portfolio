import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaHome, FaUser, FaCode, FaLaptopCode, FaEnvelope, FaGithub, FaLinkedin, FaYoutube, FaFileContract, FaShieldAlt, FaSitemap } from 'react-icons/fa';
import './Privacy.css';

const Sitemap = () => {
  const sections = [
    { id: 'home', title: 'Home', description: 'Main landing page with hero section', icon: <FaHome /> },
    { id: 'about', title: 'About', description: 'Learn about my background and expertise', icon: <FaUser /> },
    { id: 'skills', title: 'Skills', description: 'Explore my technical skills and technologies', icon: <FaLaptopCode /> },
    { id: 'projects', title: 'Projects', description: 'View my portfolio of projects and work', icon: <FaCode /> },
    { id: 'contact', title: 'Contact', description: 'Get in touch with me', icon: <FaEnvelope /> }
  ];

  const externalLinks = [
    { name: 'GitHub', url: 'https://github.com/vishnuvardhanmandagadla', icon: <FaGithub /> },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/vishnu-vardhan-412962285/', icon: <FaLinkedin /> },
    { name: 'YouTube', url: 'https://www.youtube.com/@Codeandcraftstudios', icon: <FaYoutube /> },
    { name: 'Email', url: 'mailto:vishnuvardhanmandagdala@gmail.com', icon: <FaEnvelope /> }
  ];

  const legalPages = [
    { name: 'Privacy Policy', url: '/privacy', icon: <FaShieldAlt /> },
    { name: 'Terms of Use', url: '/terms', icon: <FaFileContract /> },
    { name: 'Sitemap', url: '/sitemap', icon: <FaSitemap /> }
  ];

  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="back-link">
          <FaArrowLeft /> Back to Home
        </Link>
        
        <div className="legal-header">
          <h1>Sitemap</h1>
          <p className="last-updated">Complete navigation guide for Vishnu Vardhan's Portfolio</p>
        </div>
        
        <section>
          <h2>Main Sections</h2>
          <div className="sitemap-list">
            {sections.map((section) => (
              <Link key={section.id} to={`/#${section.id}`} className="sitemap-item">
                <div className="sitemap-icon">{section.icon}</div>
                <div>
                  <strong className="sitemap-link">{section.title}</strong>
                  <p className="sitemap-description">{section.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2>Social Media & Contact</h2>
          <div className="sitemap-list">
            {externalLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.url} 
                target={link.name === 'Email' ? '_self' : '_blank'}
                rel={link.name === 'Email' ? '' : 'noopener noreferrer'}
                className="sitemap-item"
              >
                <div className="sitemap-icon">{link.icon}</div>
                <div>
                  <strong className="sitemap-link">{link.name}</strong>
                  <p className="sitemap-description">{link.url.replace('mailto:', '')}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2>Legal Pages</h2>
          <div className="sitemap-list">
            {legalPages.map((page) => (
              <Link key={page.name} to={page.url} className="sitemap-item">
                <div className="sitemap-icon">{page.icon}</div>
                <div>
                  <strong className="sitemap-link">{page.name}</strong>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Sitemap;

