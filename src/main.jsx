import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Get the root element
const container = document.getElementById('root');

if (!container) {
  throw new Error("Root element not found");
}

// Create a root and enable concurrent features
const root = createRoot(container);

// Render the app
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Add visual viewport guard for mobile (works in both dev and prod)
const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Debounce resize handler
let resizeTimeout;
const handleResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(setViewportHeight, 100);
};

window.addEventListener('resize', handleResize, { passive: true });
setViewportHeight();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  clearTimeout(resizeTimeout);
  window.removeEventListener('resize', handleResize);
});