// Structured data (JSON-LD) generators for SEO

const SITE_URL = 'https://your-portfolio-url.com'; // Update with your actual URL

export const generatePersonSchema = (personData = {}) => {
  const defaultData = {
    name: 'Vishnu Vardhan',
    jobTitle: 'Full Stack Developer & Designer',
    email: 'vishnuvardhanmandagdala@gmail.com',
    url: SITE_URL,
    sameAs: [
      // Add your social media profiles
      // 'https://github.com/yourusername',
      // 'https://linkedin.com/in/yourusername',
      // 'https://twitter.com/yourhandle',
    ],
    image: `${SITE_URL}/src/assets/vvlogo.png`,
  };

  const data = { ...defaultData, ...personData };

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    jobTitle: data.jobTitle,
    email: data.email,
    url: data.url,
    image: data.image,
    sameAs: data.sameAs,
  };
};

export const generateWebsiteSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: "Vishnu's Portfolio",
    url: SITE_URL,
    description: 'Portfolio of Vishnu Vardhan — Full Stack Developer and Designer',
    author: {
      '@type': 'Person',
      name: 'Vishnu Vardhan',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
};

export const generatePortfolioSchema = (projects = []) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Portfolio Projects',
    description: 'Collection of web development projects',
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: project.title || project.name,
        description: project.description,
        url: project.url || `${SITE_URL}/projects/${project.slug}`,
        image: project.image || `${SITE_URL}/src/assets/vvlogo.png`,
      },
    })),
  };
};

export const generateBreadcrumbSchema = (items = []) => {
  const defaultItems = [
    { name: 'Home', url: SITE_URL },
  ];

  const breadcrumbItems = [...defaultItems, ...items].map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };
};

export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: "Vishnu's Portfolio",
    url: SITE_URL,
    logo: `${SITE_URL}/src/assets/vvlogo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Professional',
      email: 'vishnuvardhanmandagdala@gmail.com',
    },
  };
};


