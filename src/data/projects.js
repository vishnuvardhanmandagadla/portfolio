export const projects = [
  {
    slug: "smart-attendance-manager",
    title: "Smart Attendance Manager",
    headline: "Automated biometric attendance tracking with analytics dashboards.",
    summary:
      "Built a responsive platform that digitises attendance capture, audit trails, and faculty/student insights for institutes migrating away from manual processes.",
    techStack: [
      "React",
      "Redux Toolkit",
      "Node.js",
      "Express",
      "MongoDB",
      "Tailwind CSS",
    ],
    problemStatement:
      "Manual attendance tracking was error-prone and lacked real-time visibility for faculty and administrators.",
    contributions: [
      "Implemented biometric and QR-based check-in flows with offline fallbacks.",
      "Designed analytics dashboards surfacing punctuality trends and historical exports.",
      "Set up role-based access control and automated notification workflows.",
    ],
    highlights: [
      "Deployed to campus intranet with rolling updates using Dockerised services.",
      "Reduced reconciliation time by 70% through automated discrepancy alerts.",
      "Supports 5,000+ daily check-ins with <200ms average response time.",
    ],
    links: {
      live: null,
      repo: "https://github.com/vishnuvardhanmandagadla/AttendanceManager-main",
    },
  },
  {
    slug: "thyroid-nodule-detection",
    title: "Thyroid Nodule Detection",
    headline: "Medical imaging pipeline that classifies thyroid nodules from ultrasound scans.",
    summary:
      "An end-to-end research project combining image preprocessing, CNN-based inference, and clinician-friendly result visualisations.",
    techStack: [
      "Python",
      "TensorFlow",
      "OpenCV",
      "Flask",
      "React",
      "AWS S3",
    ],
    problemStatement:
      "Radiologists needed faster triage of ultrasound scans without compromising diagnostic accuracy.",
    contributions: [
      "Curated and augmented a dataset of 15k+ annotated ultrasound frames.",
      "Engineered a custom CNN achieving 92% F1-score on the validation set.",
      "Delivered a web interface overlaying heatmaps for clinician review.",
    ],
    highlights: [
      "Integrated Grad-CAM explanations to improve trust and interpretability.",
      "Optimised model serving with TensorFlow Serving and on-demand scaling.",
      "Adopted HIPAA-aligned storage and encryption practices.",
    ],
    links: {
      live: null,
      repo: "https://github.com/vishnuvardhanmandagadla/thyroid-nodule-detection",
    },
  },
  {
    slug: "student-communication-platform",
    title: "Student Communication Platform",
    headline: "Real-time messaging and announcement hub for universities.",
    summary:
      "A Firebase-backed communication tool that unifies chat, announcements, and task updates for student cohorts.",
    techStack: [
      "React",
      "Firebase",
      "Cloud Functions",
      "Framer Motion",
      "Styled Components",
    ],
    problemStatement:
      "Students were siloed across multiple chat apps, missing deadlines and announcements.",
    contributions: [
      "Created real-time channels with presence indicators and read receipts.",
      "Automated announcements with push notifications and email fallbacks.",
      "Enabled classroom-level polls and feedback modules.",
    ],
    highlights: [
      "Scaled to 1,200 concurrent users with Firebase realtime DB.",
      "Shipped offline caching using IndexedDB for stable mobile UX.",
      "Reduced missed deadlines by 40% based on beta survey feedback.",
    ],
    links: {
      live: "https://student-communication-vs.web.app/",
      repo: null,
    },
  },
  {
    slug: "time-table-generator",
    title: "Time Table Generator",
    headline: "Constraint-driven timetable engine for academic departments.",
    summary:
      "A scheduling assistant that automates timetables across departments by respecting faculty availability, room capacity, and curriculum priorities.",
    techStack: [
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Prisma",
      "Docker",
    ],
    problemStatement:
      "Manual timetable creation took weeks every semester and often violated faculty or room constraints.",
    contributions: [
      "Modelled constraints using a weighted graph and backtracking heuristics.",
      "Built admin tooling to run simulations and export printable schedules.",
      "Integrated conflict alerts and what-if scenario visualisations.",
    ],
    highlights: [
      "Cuts timetable generation time from 3 weeks to under 3 hours.",
      "Supports cross-department resource sharing with collision detection.",
      "Modular architecture ready for API and campus-wide integrations.",
    ],
    links: {
      live: null,
      repo: null,
    },
  },
  {
    slug: "sethu-web-app",
    title: "SETHU Web App",
    headline: "Public-facing site for SETHU initiative with storytelling-driven UX.",
    summary:
      "Led the rebuild of a legacy site into an immersive, accessible experience featuring program impact stories and donor call-to-actions.",
    techStack: [
      "React",
      "Vite",
      "Tailwind CSS",
      "Framer Motion",
      "Netlify",
    ],
    problemStatement:
      "Legacy static site failed to communicate programme outcomes or convert visitors effectively.",
    contributions: [
      "Crafted modular content sections with CMS-friendly configuration.",
      "Implemented scroll-triggered animations and micro-interactions.",
      "Improved lighthouse performance scores from 48 to 93.",
    ],
    highlights: [
      "Boosted donor sign-ups by 2.3x within the first month post-launch.",
      "Set up Netlify CI/CD with preview deploys for stakeholder review.",
      "Ensured WCAG 2.1 AA compliance throughout the site.",
    ],
    links: {
      live: "https://sethu-sbp.web.app/",
      repo: null,
    },
  },
  {
    slug: "night-wake-studio",
    title: "Night Wake Studio",
    headline: "Creative portfolio site for a design collective with immersive visuals.",
    summary:
      "Designed and developed a cinematic single-page experience highlighting a design studio's case studies and process.",
    techStack: [
      "React",
      "GSAP",
      "Three.js",
      "Framer Motion",
      "Vercel",
    ],
    problemStatement:
      "The studio needed an experiential site that matched their bold visual identity and showcased interactive storytelling.",
    contributions: [
      "Directed art direction and motion sequencing to reflect brand voice.",
      "Implemented dynamic project galleries with swappable presets.",
      "Optimised asset pipeline with lazy loading and WebP conversions.",
    ],
    highlights: [
      "Increased qualified leads by 65% within two months.",
      "Achieved a consistent sub-2s Largest Contentful Paint despite rich media.",
      "Integrated analytics and session recordings to inform future iterations.",
    ],
    links: {
      live: "https://nightwake-studio.web.app/",
      repo: null,
    },
  },
  {
    slug: "find-a-stay",
    title: "Find a Stay",
    headline: "Smart PG/Hostel finder with live data & Firebase integration.",
    summary:
      "A comprehensive platform that helps students and professionals find the perfect PG (Paying Guest) or hostel accommodation with real-time availability, detailed listings, and seamless booking experience.",
    techStack: [
      "React",
      "Firebase",
      "Firestore",
      "Google Maps API",
      "Tailwind CSS",
      "Framer Motion",
    ],
    problemStatement:
      "Students and professionals struggled to find suitable accommodation with reliable information and real-time availability updates.",
    contributions: [
      "Built real-time search and filtering system with Firebase Firestore.",
      "Integrated Google Maps API for location-based searches and directions.",
      "Implemented live availability tracking and booking management system.",
      "Created responsive UI with advanced filtering options.",
    ],
    highlights: [
      "Real-time data synchronization with Firebase for instant updates.",
      "Location-based search with map integration for easy navigation.",
      "Comprehensive filtering system for price, amenities, and location.",
      "Mobile-responsive design for seamless experience across devices.",
    ],
    links: {
      live: "https://findanstay.web.app/",
      repo: null,
    },
  },
];

export const getProjectBySlug = (slug) =>
  projects.find((project) => project.slug === slug);

