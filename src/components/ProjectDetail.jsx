import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaExternalLinkAlt, FaGithub, FaCode, FaRocket, FaLightbulb, FaUsers, FaChartLine } from "react-icons/fa";
import { projects, getProjectBySlug } from "../data/projects";
import SEO from "./SEO";
import { generateBreadcrumbSchema } from "../utils/structuredData";
import "./ProjectDetail.css";

const transition = {
  duration: 0.4,
  ease: "easeOut",
};

const ProjectDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const project = getProjectBySlug(slug);
  const [activeTab, setActiveTab] = useState("overview");

  const handleBack = () => {
    navigate("/", { state: { scrollTo: "projects" } });
  };

  // Generate structured data for project page
  const projectStructuredData = project ? [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title || project.name,
      description: project.description,
      url: project.url || `${window.location.origin}/projects/${slug}`,
      image: project.image || project.thumbnail,
      creator: {
        '@type': 'Person',
        name: 'Vishnu Vardhan',
      },
    },
    generateBreadcrumbSchema([
      { name: 'Projects', url: `${window.location.origin}/#projects` },
      { name: project.title || project.name, url: `${window.location.origin}/projects/${slug}` },
    ]),
  ] : undefined;

  if (!project) {
    return (
      <>
        <SEO 
          title="Project Not Found | Vishnu Vardhan Portfolio"
          description="The requested project could not be found."
          noindex={true}
        />
        <motion.main
          className="project-detail__container project-detail__container--missing"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          <section className="project-detail__shell project-detail__shell--empty">
            <div className="not-found__icon">
            <FaCode />
            </div>
          <h1>Project not found</h1>
          <p>
            The project you were looking for is either archived or the link is
            incorrect.
          </p>
            <button 
            className="project-detail__back" 
            onClick={handleBack}
          >
            <FaArrowLeft aria-hidden="true" /> Back to projects
            </button>
          </section>
      </motion.main>
      </>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: <FaRocket /> },
    { id: "challenge", label: "Challenge", icon: <FaLightbulb /> },
    { id: "solution", label: "Solution", icon: <FaCode /> },
    { id: "impact", label: "Impact", icon: <FaChartLine /> },
  ];

  return (
    <>
      <SEO 
        title={`${project.title || project.name} | Project | Vishnu Vardhan Portfolio`}
        description={project.description || project.summary || `View details about ${project.title || project.name} project by Vishnu Vardhan.`}
        keywords={`${project.title || project.name}, Web Development, Project, Portfolio, ${project.techStack?.join(', ') || ''}`}
        ogImage={project.image || project.thumbnail}
        ogType="article"
        canonicalUrl={`${window.location.origin}/projects/${slug}`}
        structuredData={projectStructuredData}
      />
    <motion.main
      className="project-detail__container"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      {/* Watermark Text */}
      <div className="project-detail__watermark">PROJECT</div>

      <section className="project-detail__shell">
        {/* Hero Section */}
        <header className="project-detail__hero">
          <button
            className="project-detail__back"
            onClick={handleBack}
            aria-label="Back to projects"
          >
            <FaArrowLeft aria-hidden="true" />
          </button>

          <span className="project-detail__eyebrow">
            Case Study
          </span>
          
          <h1>{project.title}</h1>
          
          <p>{project.headline}</p>

          {/* Action Buttons at Top */}
          <div className="hero-action-buttons">
            {project.links?.live ? (
              <a
                href={project.links.live}
                className="cta-button cta-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaExternalLinkAlt /> Live Demo
              </a>
            ) : (
              <button
                className="cta-button cta-primary cta-button--disabled"
                disabled
                title="Live demo coming soon"
              >
                <FaExternalLinkAlt /> Live Demo
              </button>
            )}
            {project.links?.repo ? (
              <a
                href={project.links.repo}
                className="cta-button cta-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub /> View Code
              </a>
            ) : (
              <button
                className="cta-button cta-secondary cta-button--disabled"
                disabled
                title="Repository link coming soon"
              >
                <FaGithub /> View Code
              </button>
            )}
          </div>

          <div className="hero-stats">
            {project.highlights.slice(0, 3).map((highlight, index) => (
              <div key={highlight} className="hero-stat">
                <div className="stat-icon">
                  {index === 0 && <FaRocket />}
                  {index === 1 && <FaChartLine />}
                  {index === 2 && <FaUsers />}
                </div>
                <span>{highlight}</span>
              </div>
            ))}
          </div>

                  <div className="tech-grid">
                    {project.techStack.slice(0, 6).map((tech, index) => (
              <div key={tech} className="tech-card">
                        <div className="tech-card__index">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="tech-card__label">{tech}</div>
              </div>
                    ))}
          </div>
        </header>

        {/* Interactive Navigation Tabs */}
        <nav className="project-detail__tabs">
           {tabs.map((tab) => (
            <button
               key={tab.id}
               className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
               onClick={() => setActiveTab(tab.id)}
             >
               <span className="tab-icon">{tab.icon}</span>
               {tab.label}
            </button>
           ))}
        </nav>

        {/* Main Content with Tab Switching */}
        <div className="project-detail__content">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.section
                key="overview"
                className="content-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="section-grid">
                  <div className="summary-card">
                    <h3>Project Summary</h3>
                    <p>{project.summary}</p>
                  </div>

                  <div className="highlights-grid">
                    {project.highlights.map((highlight, index) => (
                      <div key={highlight} className="highlight-card">
                        <div className="highlight-number">0{index + 1}</div>
                        <p>{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {activeTab === "challenge" && (
              <motion.section
                key="challenge"
                className="content-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="challenge-content">
                  <div className="problem-statement">
                    <h3>The Challenge</h3>
                    <p>{project.problemStatement}</p>
                  </div>
                  <div className="constraints">
                    <h4>Key Constraints</h4>
                    <ul>
                      {project.contributions.slice(0, 4).map((constraint) => (
                        <li key={constraint}>{constraint}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.section>
            )}

            {activeTab === "solution" && (
              <motion.section
                key="solution"
                className="content-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="solution-content">
                  <h3>Technical Implementation</h3>
                  <div className="tech-stack-visual">
                    {project.techStack.map((tech) => (
                      <div key={tech} className="tech-layer">
                        {tech}
                      </div>
                    ))}
                  </div>
                  <div className="contributions-list">
                    <h4>Key Contributions</h4>
                    {project.contributions.map((contribution, index) => (
                      <div key={contribution} className="contribution-item">
                        <span className="contribution-number">0{index + 1}</span>
                        <span>{contribution}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {activeTab === "impact" && (
              <motion.section
                key="impact"
                className="content-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="impact-metrics">
                  <h3>Project Impact</h3>
                  <div className="metrics-grid">
                    {project.highlights.map((metric) => (
                      <div key={metric} className="metric-card">
                        <div className="metric-value">{metric.split(' ')[0]}</div>
                        <div className="metric-label">{metric.split(' ').slice(1).join(' ')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Related Projects */}
        <section className="related-projects">
          <h3>Explore More Projects</h3>
          <div className="projects-grid">
            {projects
              .filter((item) => item.slug !== project.slug)
              .map((relatedProject) => (
                <article
                  key={relatedProject.slug}
                  className="project-card"
                  onClick={() => navigate(`/projects/${relatedProject.slug}`)}
                >
                  <h4>{relatedProject.title}</h4>
                  <p>{relatedProject.headline}</p>
                  <div className="project-tech">
                    {relatedProject.techStack.slice(0, 3).map(tech => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                </article>
              ))}
          </div>
        </section>
      </section>
    </motion.main>
    </>
  );
};

export default ProjectDetail;