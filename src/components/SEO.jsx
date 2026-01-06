import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// SEO configuration for different routes
const SEO_CONFIG = {
  '/': {
    title: 'Vishnu Vardhan | Full Stack Developer & Designer',
    description: 'Portfolio of Vishnu Vardhan — Full Stack Developer and Designer crafting engaging digital experiences, innovative projects, and meaningful collaborations.',
    keywords: 'Vishnu Vardhan, Full Stack Developer, Web Developer, Frontend Developer, React Developer, Portfolio, Web Design, UI/UX Designer',
    ogImage: '/src/assets/vvlogo.png',
    ogType: 'website',
    twitterCard: 'summary_large_image',
  },
  '/projects': {
    title: 'Projects | Vishnu Vardhan Portfolio',
    description: 'Explore my portfolio of web development projects, including React applications, full-stack solutions, and creative digital experiences.',
    keywords: 'Projects, Web Development Projects, React Projects, Portfolio Projects, Web Applications',
    ogImage: '/src/assets/vvlogo.png',
    ogType: 'website',
    twitterCard: 'summary_large_image',
  },
  '/privacy': {
    title: 'Privacy Policy | Vishnu Vardhan Portfolio',
    description: 'Privacy Policy for Vishnu Vardhan Portfolio website. Learn how we collect, use, and protect your personal information.',
    keywords: 'Privacy Policy, Data Protection, Privacy',
    ogImage: '/src/assets/vvlogo.png',
    ogType: 'website',
    twitterCard: 'summary',
  },
  '/terms': {
    title: 'Terms of Service | Vishnu Vardhan Portfolio',
    description: 'Terms of Service for Vishnu Vardhan Portfolio website. Read our terms and conditions for using this website.',
    keywords: 'Terms of Service, Terms and Conditions, Legal',
    ogImage: '/src/assets/vvlogo.png',
    ogType: 'website',
    twitterCard: 'summary',
  },
  '/sitemap': {
    title: 'Sitemap | Vishnu Vardhan Portfolio',
    description: 'Sitemap for Vishnu Vardhan Portfolio website. Find all pages and sections of the portfolio.',
    keywords: 'Sitemap, Site Map, Navigation',
    ogImage: '/src/assets/vvlogo.png',
    ogType: 'website',
    twitterCard: 'summary',
  },
};

// Default SEO values
const DEFAULT_SEO = {
  title: 'Vishnu Vardhan | Full Stack Developer & Designer',
  description: 'Portfolio of Vishnu Vardhan — Full Stack Developer and Designer crafting engaging digital experiences, innovative projects, and meaningful collaborations.',
  keywords: 'Vishnu Vardhan, Full Stack Developer, Web Developer, Frontend Developer, React Developer, Portfolio',
  siteName: "Vishnu's Portfolio",
  siteUrl: 'https://your-portfolio-url.com', // Update with your actual URL
  author: 'Vishnu Vardhan',
  ogImage: '/src/assets/vvlogo.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterHandle: '@yourhandle', // Update with your Twitter handle
};

const SEO = ({ 
  title, 
  description, 
  keywords, 
  ogImage, 
  ogType,
  twitterCard,
  noindex = false,
  canonicalUrl,
  structuredData,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Get route-specific SEO or use provided props or defaults
  const routeSEO = SEO_CONFIG[currentPath] || {};
  const finalTitle = title || routeSEO.title || DEFAULT_SEO.title;
  const finalDescription = description || routeSEO.description || DEFAULT_SEO.description;
  const finalKeywords = keywords || routeSEO.keywords || DEFAULT_SEO.keywords;
  const finalOgImage = ogImage || routeSEO.ogImage || DEFAULT_SEO.ogImage;
  const finalOgType = ogType || routeSEO.ogType || DEFAULT_SEO.ogType;
  const finalTwitterCard = twitterCard || routeSEO.twitterCard || DEFAULT_SEO.twitterCard;
  
  // Construct full URLs
  const fullUrl = canonicalUrl || `${DEFAULT_SEO.siteUrl}${currentPath}`;
  const fullOgImage = finalOgImage.startsWith('http') 
    ? finalOgImage 
    : `${DEFAULT_SEO.siteUrl}${finalOgImage}`;

  useEffect(() => {
    // Update document title
    document.title = finalTitle;

    // Helper function to update or create meta tag
    const updateMetaTag = (name, content, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', finalDescription);
    updateMetaTag('keywords', finalKeywords);
    updateMetaTag('author', DEFAULT_SEO.author);
    
    // Robots meta
    if (noindex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow');
    }

    // Open Graph meta tags
    updateMetaTag('og:title', finalTitle, 'property');
    updateMetaTag('og:description', finalDescription, 'property');
    updateMetaTag('og:image', fullOgImage, 'property');
    updateMetaTag('og:url', fullUrl, 'property');
    updateMetaTag('og:type', finalOgType, 'property');
    updateMetaTag('og:site_name', DEFAULT_SEO.siteName, 'property');
    updateMetaTag('og:locale', 'en_US', 'property');

    // Twitter Card meta tags
    updateMetaTag('twitter:card', finalTwitterCard);
    updateMetaTag('twitter:title', finalTitle);
    updateMetaTag('twitter:description', finalDescription);
    updateMetaTag('twitter:image', fullOgImage);
    if (DEFAULT_SEO.twitterHandle) {
      updateMetaTag('twitter:creator', DEFAULT_SEO.twitterHandle);
      updateMetaTag('twitter:site', DEFAULT_SEO.twitterHandle);
    }

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullUrl);

    // Add structured data (JSON-LD)
    if (structuredData) {
      // Remove existing structured data scripts
      const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
      existingScripts.forEach(script => script.remove());
      
      // Handle both single objects and arrays
      const dataArray = Array.isArray(structuredData) ? structuredData : [structuredData];
      
      // Create a script tag for each structured data object
      dataArray.forEach((data) => {
        const scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        scriptTag.textContent = JSON.stringify(data);
        document.head.appendChild(scriptTag);
      });
    }
  }, [
    finalTitle,
    finalDescription,
    finalKeywords,
    fullOgImage,
    fullUrl,
    finalOgType,
    finalTwitterCard,
    noindex,
    structuredData,
  ]);

  return null; // This component doesn't render anything
};

export default SEO;

