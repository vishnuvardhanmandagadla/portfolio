# SEO Setup Guide

This guide explains how to configure and customize the SEO implementation for your portfolio.

## 📋 Overview

The SEO implementation includes:
- **Dynamic Meta Tags** - Updates based on current route
- **Open Graph Tags** - For Facebook and social media sharing
- **Twitter Card Tags** - For Twitter sharing
- **JSON-LD Structured Data** - For search engines (Schema.org)
- **Canonical URLs** - Prevents duplicate content issues

## 🔧 Configuration

### 1. Update Site URL

Update the site URL in two places:

**`src/components/SEO.jsx`** (line ~20):
```javascript
const DEFAULT_SEO = {
  // ... other config
  siteUrl: 'https://your-actual-domain.com', // Update this
  // ...
};
```

**`src/utils/structuredData.js`** (line ~3):
```javascript
const SITE_URL = 'https://your-actual-domain.com'; // Update this
```

### 2. Update Social Media Handles

**`src/components/SEO.jsx`** (line ~20):
```javascript
const DEFAULT_SEO = {
  // ... other config
  twitterHandle: '@yourtwitterhandle', // Update with your Twitter handle
  // ...
};
```

### 3. Add Social Media Profiles

**`src/utils/structuredData.js`** - Update the `generatePersonSchema` function:
```javascript
sameAs: [
  'https://github.com/yourusername',
  'https://linkedin.com/in/yourusername',
  'https://twitter.com/yourhandle',
  // Add more social profiles
],
```

### 4. Update Route-Specific SEO

Edit **`src/components/SEO.jsx`** - `SEO_CONFIG` object to customize SEO for each route:
```javascript
const SEO_CONFIG = {
  '/': {
    title: 'Your Custom Title',
    description: 'Your custom description',
    keywords: 'your, keywords, here',
    // ...
  },
  // Add more routes as needed
};
```

## 📝 Customizing Meta Tags Per Route

### In Component Files

You can override SEO settings in individual components:

```jsx
import SEO from './components/SEO';

function MyComponent() {
  return (
    <>
      <SEO 
        title="Custom Page Title"
        description="Custom page description"
        keywords="custom, keywords"
        ogImage="/path/to/custom-image.png"
        noindex={false} // Set to true to prevent indexing
      />
      {/* Your component content */}
    </>
  );
}
```

### Available SEO Props

- `title` - Page title
- `description` - Meta description
- `keywords` - Meta keywords
- `ogImage` - Open Graph image URL
- `ogType` - Open Graph type (website, article, etc.)
- `twitterCard` - Twitter card type (summary, summary_large_image)
- `noindex` - Set to true to prevent search engine indexing
- `canonicalUrl` - Canonical URL for the page
- `structuredData` - JSON-LD structured data object or array

## 🎯 Structured Data

### Available Schema Generators

Located in `src/utils/structuredData.js`:

1. **`generatePersonSchema()`** - Person/Author information
2. **`generateWebsiteSchema()`** - Website information
3. **`generatePortfolioSchema(projects)`** - Portfolio projects list
4. **`generateBreadcrumbSchema(items)`** - Breadcrumb navigation
5. **`generateOrganizationSchema()`** - Organization information

### Example Usage

```jsx
import { generatePersonSchema, generateWebsiteSchema } from './utils/structuredData';

const structuredData = [
  generatePersonSchema({
    name: 'Your Name',
    jobTitle: 'Your Job Title',
    email: 'your@email.com',
  }),
  generateWebsiteSchema(),
];

<SEO structuredData={structuredData} />
```

## 🖼️ Image Optimization

### Open Graph Images

- Recommended size: **1200x630px**
- Format: **PNG or JPG**
- File size: **Under 1MB**

Update image paths in:
- `src/components/SEO.jsx` - `DEFAULT_SEO.ogImage`
- Route-specific configs in `SEO_CONFIG`

## ✅ Testing SEO

### 1. Google Rich Results Test
- Visit: https://search.google.com/test/rich-results
- Enter your URL to test structured data

### 2. Facebook Sharing Debugger
- Visit: https://developers.facebook.com/tools/debug/
- Enter your URL to test Open Graph tags

### 3. Twitter Card Validator
- Visit: https://cards-dev.twitter.com/validator
- Enter your URL to test Twitter Cards

### 4. Meta Tags Checker
- Visit: https://metatags.io/
- Enter your URL to see all meta tags

## 📊 SEO Best Practices

1. **Unique Titles** - Each page should have a unique, descriptive title
2. **Descriptive Descriptions** - Write compelling 150-160 character descriptions
3. **Relevant Keywords** - Use relevant keywords naturally
4. **Canonical URLs** - Always set canonical URLs to prevent duplicate content
5. **Structured Data** - Use structured data to help search engines understand your content
6. **Image Alt Text** - Always include alt text for images (handled in components)
7. **Mobile-Friendly** - Ensure your site is mobile-responsive (already implemented)

## 🔍 Monitoring

After deployment, monitor your SEO performance:

1. **Google Search Console** - Track search performance
2. **Google Analytics** - Monitor traffic and user behavior
3. **Bing Webmaster Tools** - Track Bing search performance

## 🚀 Next Steps

1. Update all URLs and social handles
2. Test all pages with SEO validators
3. Submit sitemap to Google Search Console
4. Monitor performance and adjust as needed

---

**Note**: Remember to update the placeholder URLs (`https://your-portfolio-url.com`) with your actual domain before deploying!


