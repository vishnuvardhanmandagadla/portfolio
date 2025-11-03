import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './Privacy.css';

const Terms = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="back-link">
          <FaArrowLeft /> Back to Home
        </Link>
        
        <div className="legal-header">
          <h1>Terms of Use</h1>
          <p className="last-updated">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <section>
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing and using Vishnu Vardhan's Portfolio website, you accept and agree 
            to be bound by these Terms of Use. If you do not agree with these terms, please 
            do not use this website.
          </p>
        </section>

        <section>
          <h2>Use License</h2>
          <p>
            Permission is granted to temporarily view the materials on this website for personal, 
            non-commercial transitory viewing only. This is the grant of a license, not a transfer 
            of title, and under this license you may not:
          </p>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on the website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </section>

        <section>
          <h2>Intellectual Property</h2>
          <p>
            All content on this website, including but not limited to text, graphics, logos, 
            images, and software, is the property of Vishnu Vardhan and is protected by copyright 
            and other intellectual property laws.
          </p>
          <p>
            You may not reproduce, distribute, modify, or create derivative works from any content 
            on this website without explicit written permission.
          </p>
        </section>

        <section>
          <h2>User Conduct</h2>
          <p>When using the contact form or interacting with this website, you agree to:</p>
          <ul>
            <li>Provide accurate and truthful information</li>
            <li>Not use the website for any unlawful purpose</li>
            <li>Not transmit any harmful or malicious code</li>
            <li>Respect the intellectual property rights of others</li>
          </ul>
        </section>

        <section>
          <h2>Contact Form Usage</h2>
          <p>
            By submitting information through the contact form, you:
          </p>
          <ul>
            <li>Grant permission to be contacted in response to your inquiry</li>
            <li>Confirm that the information provided is accurate</li>
            <li>Understand that your message will be stored for communication purposes</li>
          </ul>
        </section>

        <section>
          <h2>Disclaimer</h2>
          <p>
            The materials on this website are provided "as is." Vishnu Vardhan makes no warranties, 
            expressed or implied, and hereby disclaims and negates all other warranties including, 
            without limitation, implied warranties or conditions of merchantability, fitness for a 
            particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2>Limitations</h2>
          <p>
            In no event shall Vishnu Vardhan or its suppliers be liable for any damages (including, 
            without limitation, damages for loss of data or profit, or due to business interruption) 
            arising out of the use or inability to use the materials on this website.
          </p>
        </section>

        <section>
          <h2>Revisions</h2>
          <p>
            Vishnu Vardhan may revise these Terms of Use at any time without notice. By using this 
            website, you are agreeing to be bound by the then current version of these Terms of Use.
          </p>
        </section>

        <section>
          <h2>Contact Information</h2>
          <p>
            For questions about these Terms of Use, please contact:
          </p>
          <p>
            <strong>Email:</strong> vishnuvardhanmandagdala@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;

