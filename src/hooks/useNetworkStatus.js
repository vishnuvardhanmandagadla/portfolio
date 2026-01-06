import { useEffect, useState, useRef } from 'react';

/**
 * Custom hook to monitor network status
 * Detects when user goes offline/online and handles fetch failures
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(() => {
    // Check if navigator.onLine is available
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      return navigator.onLine;
    }
    // Default to true if we can't determine
    return true;
  });
  const [wasOffline, setWasOffline] = useState(false);
  const checkTimeoutRef = useRef(null);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => {
      setIsOnline(true);
      // If we were offline and now online, mark that we recovered
      if (wasOffline) {
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    // Listen to online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Also periodically check connection (for cases where events don't fire)
    const checkConnection = async () => {
      // Only check if navigator says we're online (to avoid unnecessary requests)
      if (!navigator.onLine) {
        setIsOnline(false);
        setWasOffline(true);
        return;
      }

      try {
        // Try to fetch a small resource with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        await fetch(window.location.origin, {
          method: 'HEAD',
          cache: 'no-cache',
          mode: 'no-cors',
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        setIsOnline(true);
      } catch (error) {
        // If fetch fails or times out, we might be offline
        if (error.name === 'AbortError' || !navigator.onLine) {
          setIsOnline(false);
          setWasOffline(true);
        }
      }
    };

    // Check connection every 10 seconds (less frequent since we're not auto-showing error)
    const intervalId = setInterval(checkConnection, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, [wasOffline]);

  return { isOnline, wasOffline };
};

export default useNetworkStatus;

