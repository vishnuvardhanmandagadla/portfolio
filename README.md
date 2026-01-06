# Vishnu Vardhan - Personal Portfolio

A modern, responsive portfolio website built with React, Vite, and advanced animations. Features smooth parallax scrolling, interactive elements, and professional project showcasing.

##  🚀 Features

- **Modern React Architecture**: Built with Vite for fast development
- **Advanced Animations**: GSAP, Framer Motion, and custom CSS animations
- **Responsive Design**: Optimized for all device sizes
- **Interactive Elements**: Mouse-following animations, ripple effects, and hover interactions
- **Parallax Scrolling**: Smooth section transitions with scroll-based animations
- **Contact Form**: Interactive contact system with success animations and animated SVG backgrounds
- **Professional Projects Showcase**: Animated project links with hover effects and detailed project pages
- **3D Elements**: Solar System visualization and Three.js integrations
- **SEO Optimized**: Meta tags, structured data, sitemap, and robots.txt
- **Network Status Detection**: Offline/online status handling
- **Page Loader**: Smooth loading animations
- **Bio Section**: Interactive biography section with animations
- **Privacy & Terms Pages**: Legal pages for compliance

## ️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: CSS3, Tailwind CSS (config available)
- **Animations**: GSAP, Framer Motion, React Spring
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Icons**: React Icons (Font Awesome, Simple Icons)
- **Form Handling**: Formspree for contact forms
- **Build Tool**: Vite
- **Deployment**: Firebase Hosting
- **SEO**: Structured data, sitemap generation

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn package manager
- Git

## ‍♂️ Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd portfolio
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Development Server

Start the development server with hot reload:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

Create a production build:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist/` directory.

### 5. Preview Production Build

Preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

##  🚀 Deployment

### Firebase Hosting Deployment

#### Prerequisites for Firebase Deployment
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase account with a project created

#### Deployment Steps

1. **Login to Firebase**
   ```bash
   firebase login
   ```

2. **Initialize Firebase (if not already done)**
   ```bash
   firebase init
   ```
   Select:
   - Hosting: Configure and deploy Firebase Hosting sites
   - Use existing project (select your Firebase project)
   - Public directory: `dist`
   - Configure as a single-page app: Yes
   - Set up automatic builds and deploys with GitHub: No
   - Overwrite index.html: No

3. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

4. **Your site will be deployed to**: `https://your-project-id.web.app`

### Alternative Deployment Options

#### Netlify Deployment
1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to Netlify
3. Or connect your GitHub repository for continuous deployment

#### Vercel Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

#### GitHub Pages Deployment
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json:
   ```json
   "homepage": "https://yourusername.github.io/portfolio",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Deploy: `npm run deploy`

##  📁 Project Structure

```
portfolio/
├── public/
│   ├── index.html          # Main HTML template
│   ├── robots.txt          # SEO robots file
│   ├── sitemap.xml         # SEO sitemap
│   └── vite.svg            # Vite logo
├── src/
│   ├── assets/             # Static assets (images, PDFs, SVGs)
│   ├── components/         # React components
│   │   ├── BioSection.jsx  # Biography section
│   │   ├── ComingSoon.jsx # Coming soon page
│   │   ├── Contacts.jsx   # Contact form with animations
│   │   ├── Footer.jsx     # Footer component
│   │   ├── Hero.jsx       # Hero section with animations
│   │   ├── MainCo.jsx     # Main container with parallax
│   │   ├── MouseFollower.jsx # Mouse following animations
│   │   ├── Navbar.jsx     # Navigation bar
│   │   ├── NetworkError.jsx # Network status component
│   │   ├── PageLoader.jsx # Page loading animation
│   │   ├── Privacy.jsx    # Privacy policy page
│   │   ├── ProfessionComponent.jsx # Profession display
│   │   ├── ProjectDetail.jsx # Detailed project view
│   │   ├── Projects.jsx   # Projects showcase
│   │   ├── SEO.jsx        # SEO component
│   │   ├── Skills.jsx     # Skills section
│   │   ├── SocialIcons.jsx # Social media icons
│   │   ├── SolarSystem.jsx # 3D solar system
│   │   ├── Terms.jsx      # Terms of service
│   │   ├── WhatIDo.jsx    # Services section
│   │   └── video.jsx      # Video/Work section
│   ├── data/              # Data files
│   │   └── projects.js    # Projects data
│   ├── hooks/             # Custom React hooks
│   │   └── useNetworkStatus.js # Network status hook
│   ├── utils/             # Utility functions
│   │   ├── resourcePreloader.js # Resource preloading
│   │   └── structuredData.js # SEO structured data
│   ├── App.jsx           # Main App component
│   ├── App.css           # Global styles
│   ├── index.css         # Base styles
│   └── main.jsx          # Entry point
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── firebase.json         # Firebase hosting config
├── SEO_SETUP.md          # SEO documentation
└── .firebaserc           # Firebase project reference
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file for environment-specific variables:

```env
VITE_APP_TITLE=Vishnu's Portfolio
VITE_APP_DESCRIPTION=Personal portfolio website
```

### Firebase Configuration

If you need Firebase services (like Firestore for contact form), update the Firebase config in the relevant components.

##  Customization

### Colors and Themes

The portfolio uses a custom color scheme. Update these CSS variables in component styles:

- Primary: `#63133b` (Dark Purple)
- Secondary: `#802754` (Medium Purple)
- Accent: `#f8d7e6` (Light Pink)

### Content Updates

1. **Personal Information**: Update content in respective components:
   - `Hero.jsx` - Name and intro
   - `BioSection.jsx` - Biography text
   - `Skills.jsx` - Skills list
   - `Projects.jsx` - Projects array (or `src/data/projects.js`)
   - `WhatIDo.jsx` - Services/What I do section

2. **Social Links**: Update URLs in `Footer.jsx` and `SocialIcons.jsx`

3. **Resume**: Replace `src/assets/Vishnu_Resume.pdf` with your resume

4. **SEO**: Update meta tags in `SEO.jsx` and structured data in `src/utils/structuredData.js`

### Styling Changes

- Global styles: `src/index.css` and `src/App.css`
- Component-specific styles: Each component has its own CSS file
- Tailwind: Configure in `tailwind.config.js`

##  ⚡ Performance Optimization

### Build Optimization
- Tree shaking is enabled by Vite
- CSS is automatically minified
- Assets are optimized during build

### Animation Performance
- Uses `will-change` property for smooth animations
- RequestAnimationFrame for performance-critical animations
- Debounced scroll events

### Bundle Analysis
To analyze bundle size:
```bash
npm run build
npx vite-bundle-analyzer
```

##  🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   - Ensure all dependencies are installed: `npm install`
   - Check Node.js version compatibility

2. **Animation Issues**
   - Check browser support for CSS properties
   - Ensure GSAP and Framer Motion are properly imported

3. **Deployment Issues**
   - Verify Firebase project configuration
   - Check `firebase.json` paths

4. **Styles Not Loading**
   - Check CSS import paths in components
   - Verify Tailwind configuration

### Development Tips

- Use React DevTools for debugging
- Check browser console for errors
- Test responsiveness on different devices

## 📝 Scripts Overview

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `firebase deploy` - Deploy to Firebase

## 🆕 Recent Updates

### New Components Added
- **BioSection**: Interactive biography section with smooth animations
- **ProjectDetail**: Detailed project view with routing
- **NetworkError**: Handles offline/online status with user feedback
- **PageLoader**: Smooth page loading animations
- **SolarSystem**: 3D solar system visualization using Three.js
- **WhatIDo**: Services section showcasing capabilities
- **SocialIcons**: Reusable social media icons component
- **Privacy & Terms**: Legal pages for website compliance
- **SEO Component**: Dynamic SEO meta tags management

### New Features
- **SEO Optimization**: Complete SEO setup with structured data, sitemap, and robots.txt
- **Network Status Detection**: Custom hook for monitoring online/offline status
- **Resource Preloading**: Utility for optimizing asset loading
- **Project Data Management**: Centralized projects data file
- **Enhanced Contact Form**: Improved animations and user experience

### Improvements
- Better component organization
- Enhanced performance optimizations
- Improved accessibility
- Better mobile responsiveness

##  🔄 Continuous Integration

For automated deployments, set up CI/CD with:

- GitHub Actions for Firebase deployment
- Netlify/Vercel automatic deployments from GitHub
- Environment variables for different deployment environments

##  📊 Analytics Integration

To add analytics (optional):
1. Google Analytics: Add tracking code to `index.html`
2. Firebase Analytics: Configure in Firebase project

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

##  📄 License

This project is open source and available under the MIT License.

## 📞 Support

For questions or support:
- Email: vishnuvardhanmandagdala@gmail.com
- GitHub Issues: Create an issue in the repository

---

**Built with  ❤️ using React and Vite**
