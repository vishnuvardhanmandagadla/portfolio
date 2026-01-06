import React from 'react';
import { 
  FaLinkedin, 
  FaGithub,
  FaDribbble,
  FaYoutube, 
  FaInstagram
} from 'react-icons/fa';
import './SocialIcons.css';

const SocialIcons = ({ isLoaderDone = false }) => {
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/vishnu-vardhan-412962285/',
      icon: <FaLinkedin />,
    },
    {
      name: 'GitHub',
      url: 'https://github.com/vishnuvardhanmandagadla',
      icon: <FaGithub />,
    },
    {
      name: 'Dribbble',
      url: 'https://dribbble.com/vishnuvardhanmandagadla',
      icon: <FaDribbble />,
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@Codeandcraftstudios',
      icon: <FaYoutube />,
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/nightwake.studio/',
      icon: <FaInstagram />,
    }
  ];

  return (
    <div className={`social-icons-container ${isLoaderDone ? 'social-icons-container--ready' : ''}`}>
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          aria-label={`Visit my ${social.name}`}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialIcons;
