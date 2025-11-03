import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './Privacy.css';

const Privacy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="back-link">
          <FaArrowLeft /> Back to Home
        </Link>
        
        <div className="legal-header">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <section>
          <h2>Introduction</h2>
          <p>
            Welcome to Vishnu Vardhan's Portfolio. This Privacy Policy explains how I collect, 
            use, and protect your personal information when you visit my portfolio website.
          </p>
        </section>

        <section>
          <h2>Information I Collect</h2>
          <h3>Contact Form Information</h3>
          <p>
            When you use the contact form on this website, I collect:
          </p>
          <ul>
            <li>Your name</li>
            <li>Your email address</li>
            <li>Subject of your message</li>
            <li>Your message content</li>
          </ul>
          <p>
            This information is collected through Formspree and is used solely to respond to 
            your inquiries and communicate with you.
          </p>
        </section>

        <section>
          <h2>How I Use Your Information</h2>
          <p>I use the information you provide to:</p>
          <ul>
            <li>Respond to your messages and inquiries</li>
            <li>Communicate with you about potential collaborations or opportunities</li>
            <li>Improve my services and website experience</li>
          </ul>
          <p>
            I do not sell, trade, or share your personal information with third parties except 
            as necessary to operate the website (e.g., through Formspree for form submissions).
          </p>
        </section>

        <section>
          <h2>Data Security</h2>
          <p>
            I take reasonable measures to protect your personal information. However, please 
            note that no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section>
          <h2>Cookies and Tracking</h2>
          <p>
            This website may use cookies or similar tracking technologies to enhance your 
            browsing experience. You can control cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Request access to your personal information</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of communications</li>
          </ul>
        </section>

        <section>
          <h2>Contact Me</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact me at:
          </p>
          <p>
            <strong>Email:</strong> vishnuvardhanmandagdala@gmail.com
          </p>
        </section>

        <section>
          <h2>Changes to This Policy</h2>
          <p>
            I may update this Privacy Policy from time to time. Any changes will be posted 
            on this page with an updated revision date.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;

