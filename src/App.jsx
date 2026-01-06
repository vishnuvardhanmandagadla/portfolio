import React, { useEffect, useState, useRef, Suspense, lazy, useCallback, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import "./App.css";
import MainCo from "./components/MainCo";
import PageLoader from "./components/PageLoader";
import SocialIcons from "./components/SocialIcons";
import SEO from "./components/SEO";
import { getResourcePreloader } from "./utils/resourcePreloader";
import { useNetworkStatus } from "./hooks/useNetworkStatus";
import { generatePersonSchema, generateWebsiteSchema } from "./utils/structuredData";

// Page Transition Context - allows triggering transition from anywhere
const PageTransitionContext = createContext(null);
export const usePageTransition = () => useContext(PageTransitionContext);

// Fog Curtain Transition Component
const FogCurtain = ({ isActive, phase }) => {
  if (!isActive) return null;

  return (
    <div className={`fog-curtain ${phase}`}>
      <div className="fog-solid-cover" />
      <div className="fog-layer fog-layer-1" />
      <div className="fog-layer fog-layer-2" />
      <div className="fog-layer fog-layer-3" />
    </div>
  );
};
// Import assets statically - Vite will process these and provide the correct URLs
import logoImage from "./assets/vvlogo.png";
import resumePDF from "./assets/Vishnu_Resume.pdf";
import videoAsset from "./assets/sc.mp4";

// Lazy load route components
const Privacy = lazy(() => import('./components/Privacy'));
const Terms = lazy(() => import('./components/Terms'));
const Sitemap = lazy(() => import('./components/Sitemap'));
const ProjectDetail = lazy(() => import('./components/ProjectDetail'));
const NetworkError = lazy(() => import("./components/NetworkError"));

// Constants
const MIN_LOADER_DURATION = 2000;
const REVEAL_DURATION = 1200;
const MAX_LOADER_DURATION = 10000;
const NO_LOADER_ROUTES = ['/privacy', '/terms', '/sitemap'];

// Loading fallback component
const RouteLoader = () => (
  <div style={{ 
    minHeight: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  }}>
    Loading...
  </div>
);

// App Routes Component
const AppRoutes = ({ isLoaderDone, setCurrentLocation }) => {
  const location = useLocation();
  
  // Update current location for parent component
  React.useEffect(() => {
    if (setCurrentLocation) {
      setCurrentLocation(location.pathname);
    }
  }, [location.pathname, setCurrentLocation]);

  // Generate structured data for homepage
  const homepageStructuredData = [
    generatePersonSchema(),
    generateWebsiteSchema(),
  ];

  return (
    <>
      {/* SEO Component - Updates meta tags based on current route */}
      <SEO 
        structuredData={location.pathname === '/' ? homepageStructuredData : undefined}
      />
      
      <AnimatePresence mode="sync">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<MainCo isLoaderDone={isLoaderDone} />} />
          <Route 
            path="/projects/:slug" 
            element={
              <Suspense fallback={<RouteLoader />}>
                <ProjectDetail />
              </Suspense>
            } 
          />
          <Route 
            path="/privacy" 
            element={
              <Suspense fallback={<RouteLoader />}>
                <Privacy />
              </Suspense>
            } 
          />
          <Route 
            path="/terms" 
            element={
              <Suspense fallback={<RouteLoader />}>
                <Terms />
              </Suspense>
            } 
          />
          <Route 
            path="/sitemap" 
            element={
              <Suspense fallback={<RouteLoader />}>
                <Sitemap />
              </Suspense>
            } 
          />
        </Routes>
      </AnimatePresence>
    </>
  );
};

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [currentLocation, setCurrentLocation] = useState(window.location.pathname);
  const shouldSkipLoader = NO_LOADER_ROUTES.includes(currentPath);
  const [phase, setPhase] = useState(shouldSkipLoader ? "done" : "loading");
  const [progress, setProgress] = useState(0);
  const [showNetworkError, setShowNetworkError] = useState(false);
  const startTimeRef = useRef(null);
  const preloaderRef = useRef(null);
  const progressCallbackRef = useRef(null);
  const networkErrorPreloadedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const resourcesLoadedRef = useRef(false);

  // Fog curtain transition state
  const [showFog, setShowFog] = useState(false);
  const [fogPhase, setFogPhase] = useState('');

  const { isOnline } = useNetworkStatus();

  // Trigger page transition with callback
  const triggerTransition = useCallback((onNavigate) => {
    setShowFog(true);
    setFogPhase('enter');

    // Fog fully covers screen
    setTimeout(() => {
      setFogPhase('full');

      // Navigate when solid cover is active - no blink possible
      setTimeout(() => {
        if (onNavigate) {
          onNavigate();
        }
      }, 100);

      // Start exit after page loads
      setTimeout(() => {
        setFogPhase('exit');

        // Remove fog after animation
        setTimeout(() => {
          setShowFog(false);
          setFogPhase('');
        }, 800);
      }, 500);
    }, 600);
  }, []);
  
  // Check if we're on project detail page
  const isProjectDetailPage = currentLocation.startsWith('/projects/');

  // Preload NetworkError component
  useEffect(() => {
    if (!networkErrorPreloadedRef.current) {
      import("./components/NetworkError").then(() => {
        networkErrorPreloadedRef.current = true;
      });
    }
  }, []);

  // Initialize resource preloader
  useEffect(() => {
    const preloader = getResourcePreloader();
    preloaderRef.current = preloader;

    // Add critical assets
    preloader.addResource(logoImage, 'image', true);
    preloader.addResource(resumePDF, 'document', true);
    preloader.addResource(videoAsset, 'video', false);

    // Preload heavy components during loader phase to avoid scroll hanging
    preloader.addComponent(() => import('./components/BioSection'), 'BioSection', true);
    preloader.addComponent(() => import('./components/Skills'), 'Skills', true);
    preloader.addComponent(() => import('./components/Projects'), 'Projects', true);
    preloader.addComponent(() => import('./components/Contacts'), 'Contacts', true);
    preloader.addComponent(() => import('./components/video'), 'Video', true);
    preloader.addComponent(() => import('./components/SolarSystem'), 'SolarSystem', false);
    preloader.addComponent(() => import('./components/Footer'), 'Footer', false);
    preloader.addComponent(() => import('./components/MouseFollower'), 'MouseFollower', false);

    if (document.fonts && document.fonts.ready) {
      const fontResource = {
        url: 'fonts',
        type: 'font',
        critical: true,
        loaded: false,
        error: false,
      };
      preloader.resources.push(fontResource);
      preloader.totalCount = preloader.resources.length + preloader.componentLoaders.length;

      document.fonts.ready
        .then(() => {
          fontResource.loaded = true;
          preloader.onResourceLoaded();
        })
        .catch(() => {
          fontResource.loaded = true;
          preloader.onResourceLoaded();
        });
    }

    progressCallbackRef.current = (newProgress) => {
      if (newProgress >= 100) {
        resourcesLoadedRef.current = true;
      }
    };

    preloader.onProgress(progressCallbackRef.current);

    return () => {
      if (progressCallbackRef.current) {
        preloader.offProgress(progressCallbackRef.current);
      }
    };
  }, []);

  // Track route changes to skip loader on specific routes
  useEffect(() => {
    const handleRouteChange = () => {
      const newPath = window.location.pathname;
      if (newPath !== currentPath) {
        setCurrentPath(newPath);
        const shouldSkip = NO_LOADER_ROUTES.includes(newPath);
        if (shouldSkip) {
          setPhase("done");
          setProgress(100);
        }
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(handleRouteChange, 0);
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(handleRouteChange, 0);
    };
    
    const intervalId = setInterval(handleRouteChange, 100);
    handleRouteChange();

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      clearInterval(intervalId);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [currentPath]);

  // Skip loader for specific routes
  useEffect(() => {
    if (shouldSkipLoader && phase !== "done") {
      setPhase("done");
      setProgress(100);
    }
  }, [shouldSkipLoader, phase]);

  // Start loading resources and track progress
  useEffect(() => {
    if (phase !== "loading" || !preloaderRef.current || shouldSkipLoader) {
      return;
    }

    startTimeRef.current = performance.now();
    let forceCompleteTimeout;

    let currentProgress = 1;
    let lastTimestamp = performance.now();
    let lastUpdateTime = 0;
    const TARGET_DURATION = Math.max(MIN_LOADER_DURATION, 3000);
    const UPDATE_INTERVAL = TARGET_DURATION / 99;
    
    const animateProgress = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
        lastTimestamp = timestamp;
        lastUpdateTime = timestamp;
        currentProgress = 1;
        setProgress(1);
      }

      const elapsed = timestamp - startTimeRef.current;
      const timeSinceLastUpdate = timestamp - lastUpdateTime;

      const progressSteps = Math.min(99, Math.floor((elapsed / TARGET_DURATION) * 99));
      const targetProgress = progressSteps + 1;
      
      if (timeSinceLastUpdate >= UPDATE_INTERVAL && currentProgress < targetProgress) {
        currentProgress = Math.min(100, currentProgress + 1);
        setProgress(currentProgress);
        lastUpdateTime = timestamp;
      } else if (currentProgress < targetProgress && elapsed >= TARGET_DURATION) {
        currentProgress = Math.min(100, currentProgress + 1);
        setProgress(currentProgress);
        lastUpdateTime = timestamp;
      }

      const status = preloaderRef.current.getStatus();
      const hasReached100 = currentProgress >= 100;
      const hasMinimumTime = elapsed >= MIN_LOADER_DURATION;
      const resourcesComplete = status.isComplete || resourcesLoadedRef.current;

      if (resourcesComplete && hasMinimumTime && hasReached100) {
        setProgress(100);
        setPhase("reveal");
        return;
      }

      if (hasReached100 && hasMinimumTime && !resourcesComplete) {
        setProgress(100);
        animationFrameRef.current = requestAnimationFrame(animateProgress);
        return;
      }

      if (elapsed >= MAX_LOADER_DURATION) {
        setProgress(100);
        setPhase("reveal");
        return;
      }

      animationFrameRef.current = requestAnimationFrame(animateProgress);
    };

    const startPreloading = async () => {
      await preloaderRef.current.preloadAll();
      resourcesLoadedRef.current = true;
    };

    startPreloading();
    animationFrameRef.current = requestAnimationFrame(animateProgress);

    forceCompleteTimeout = setTimeout(() => {
      setProgress(100);
      setPhase("reveal");
    }, MAX_LOADER_DURATION);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (forceCompleteTimeout) {
        clearTimeout(forceCompleteTimeout);
      }
    };
  }, [phase, shouldSkipLoader]);

  // Handle reveal phase
  useEffect(() => {
    if (phase !== "reveal") {
      return;
    }

    const timeout = setTimeout(() => {
      setPhase("done");
    }, REVEAL_DURATION);

    return () => clearTimeout(timeout);
  }, [phase]);

  // Handle network-dependent user actions that fail
  useEffect(() => {
    if (phase !== "done") return;

    let userActionAttempted = false;
    let actionTimeout = null;

    const handleUserAction = (e) => {
      const target = e.target;
      const link = target.closest('a');
      const form = target.closest('form');
      const button = target.closest('button');
      
      let needsInternet = false;
      
      if (link) {
        const href = link.getAttribute('href');
        if (href && (
          href.startsWith('http') || 
          href.startsWith('mailto:') || 
          href.startsWith('tel:') ||
          (href.startsWith('/') && link.target === '_blank')
        )) {
          needsInternet = true;
        }
      }
      
      if (form) {
        const action = form.getAttribute('action');
        if (action && (action.startsWith('http') || action.includes('/api/') || action.includes('/contact'))) {
          needsInternet = true;
        } else if (!action) {
          needsInternet = true;
        }
      }
      
      if (button) {
        const onClick = button.getAttribute('onclick');
        const dataAction = button.getAttribute('data-action');
        if (onClick?.includes('fetch') || onClick?.includes('api') || 
            dataAction === 'download' || dataAction === 'external') {
          needsInternet = true;
        }
      }

      if (needsInternet && !navigator.onLine) {
        userActionAttempted = true;
        
        if (actionTimeout) {
          clearTimeout(actionTimeout);
        }
        
        actionTimeout = setTimeout(() => {
          if (!navigator.onLine && userActionAttempted) {
            setShowNetworkError(true);
            userActionAttempted = false;
          }
        }, 300);
      }
    };

    const originalFetch = window.fetch;
    let fetchInterceptActive = false;
    
    window.fetch = async (...args) => {
      if (!navigator.onLine) {
        const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';
        const method = args[1]?.method || 'GET';
        
        const isBackgroundCheck = method === 'HEAD' || 
                                  url === window.location.origin ||
                                  url.includes('favicon') ||
                                  url.includes('robots.txt');
        
        if (!isBackgroundCheck && !fetchInterceptActive) {
          fetchInterceptActive = true;
          
          try {
            const response = await originalFetch(...args);
            fetchInterceptActive = false;
            return response;
          } catch (error) {
            fetchInterceptActive = false;
            if (!navigator.onLine) {
              setShowNetworkError(true);
            }
            throw error;
          }
        }
      }
      
      return originalFetch(...args);
    };

    document.addEventListener('click', handleUserAction, true);
    document.addEventListener('submit', handleUserAction, true);

    return () => {
      window.fetch = originalFetch;
      document.removeEventListener('click', handleUserAction, true);
      document.removeEventListener('submit', handleUserAction, true);
      if (actionTimeout) {
        clearTimeout(actionTimeout);
      }
    };
  }, [phase]);

  // Hide error when connection is restored
  useEffect(() => {
    if (isOnline && showNetworkError) {
      setShowNetworkError(false);
    }
  }, [isOnline, showNetworkError]);

  const handleNetworkRetry = () => {
    setShowNetworkError(false);
    window.location.reload();
  };

  const isContentOpen = phase !== "loading";
  const isLoaderDone = phase === "done";
  const showIcons = phase === "reveal" || phase === "done";

  if (showNetworkError) {
    return (
      <Suspense fallback={<div style={{ 
        position: 'fixed', 
        inset: 0, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#ffffff'
      }}>Loading...</div>}>
        <NetworkError onRetry={handleNetworkRetry} />
      </Suspense>
    );
  }

  return (
    <PageTransitionContext.Provider value={{ triggerTransition }}>
      <Router>
        <div className={`App ${phase !== "done" ? "App--loading" : ""}`}>
          <div className={`App__content ${isContentOpen ? "App__content--open" : ""}`}>
            <AppRoutes isLoaderDone={isLoaderDone} setCurrentLocation={setCurrentLocation} />
          </div>
          {!shouldSkipLoader && <PageLoader phase={phase} progress={progress} />}
          {!isProjectDetailPage && <SocialIcons isLoaderDone={showIcons} />}
        </div>

        {/* Fog Curtain Transition - Full screen, persists across routes */}
        <FogCurtain isActive={showFog} phase={fogPhase} />
      </Router>
    </PageTransitionContext.Provider>
  );
}

export default App;
