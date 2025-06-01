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

// Add error boundary for initialization errors
if (process.env.NODE_ENV === 'development') {
  console.log('Running in development mode');
  
  // Add visual viewport guard for mobile
  const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  window.addEventListener('resize', setViewportHeight);
  setViewportHeight();
}