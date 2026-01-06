/**
 * Resource Preloader Utility
 * Preloads critical assets, components, and tracks loading progress
 */

class ResourcePreloader {
  constructor() {
    this.resources = [];
    this.loadedCount = 0;
    this.totalCount = 0;
    this.listeners = [];
    this.isComplete = false;
    this.componentLoaders = [];
  }

  /**
   * Add a resource to preload
   * @param {string} url - Resource URL
   * @param {string} type - Resource type ('image', 'font', 'video', 'document', 'script', 'style')
   * @param {boolean} critical - Whether this is a critical resource
   */
  addResource(url, type = 'image', critical = true) {
    if (!url) return;

    this.resources.push({
      url,
      type,
      critical,
      loaded: false,
      error: false,
    });
    this.totalCount = this.resources.length + this.componentLoaders.length;
  }

  /**
   * Add a component/module to preload
   * @param {Function} importFn - Dynamic import function, e.g., () => import('./Component')
   * @param {string} name - Name for tracking
   * @param {boolean} critical - Whether this is critical
   */
  addComponent(importFn, name = 'component', critical = true) {
    if (!importFn) return;

    this.componentLoaders.push({
      importFn,
      name,
      critical,
      loaded: false,
      error: false,
    });
    this.totalCount = this.resources.length + this.componentLoaders.length;
  }

  /**
   * Preload a single resource
   */
  async preloadResource(resource) {
    return new Promise((resolve) => {
      const { url, type } = resource;
      
      // Skip if already loaded
      if (resource.loaded) {
        resolve(true);
        return;
      }

      let element;

      switch (type) {
        case 'image':
          element = new Image();
          break;
        case 'font':
          // Fonts loaded via CSS link tags - check if document.fonts is available
          if (document.fonts && document.fonts.ready) {
            // Wait for all fonts to be ready
            document.fonts.ready
              .then(() => {
                resource.loaded = true;
                this.onResourceLoaded();
                resolve(true);
              })
              .catch(() => {
                // Even if there's an error, assume fonts will load
                resource.loaded = true;
                this.onResourceLoaded();
                resolve(true);
              });
            return;
          }
          // Fallback: assume font is loaded via link tag
          resource.loaded = true;
          this.onResourceLoaded();
          resolve(true);
          return;

        case 'video':
          element = document.createElement('video');
          element.preload = 'metadata';
          break;
        case 'document':
        case 'script':
        case 'style':
          // These are typically loaded via link/script tags
          resource.loaded = true;
          this.onResourceLoaded();
          resolve(true);
          return;

        default:
          element = new Image();
      }

      if (!element) {
        resolve(false);
        return;
      }

      const onLoad = () => {
        resource.loaded = true;
        this.onResourceLoaded();
        resolve(true);
      };

      const onError = () => {
        resource.error = true;
        this.onResourceLoaded();
        resolve(false);
      };

      element.addEventListener('load', onLoad);
      element.addEventListener('error', onError);
      
      // Set timeout for resources that take too long
      const timeout = setTimeout(() => {
        onError();
      }, 10000); // 10 second timeout

      element.addEventListener('load', () => clearTimeout(timeout), { once: true });
      element.addEventListener('error', () => clearTimeout(timeout), { once: true });

      element.src = url;
    });
  }

  /**
   * Extract font name from URL (basic implementation)
   */
  extractFontName(url) {
    // This is a basic implementation - adjust based on your font URLs
    const match = url.match(/([^/]+)\.(woff2?|ttf|otf)/i);
    return match ? match[1] : null;
  }

  /**
   * Preload a single component/module
   */
  async preloadComponent(component) {
    return new Promise((resolve) => {
      if (component.loaded) {
        resolve(true);
        return;
      }

      component.importFn()
        .then(() => {
          component.loaded = true;
          this.onResourceLoaded();
          resolve(true);
        })
        .catch((error) => {
          console.warn(`Failed to preload component: ${component.name}`, error);
          component.error = true;
          this.onResourceLoaded();
          resolve(false);
        });
    });
  }

  /**
   * Handle resource loaded
   */
  onResourceLoaded() {
    // Recalculate total in case resources were added dynamically
    this.totalCount = this.resources.length + this.componentLoaders.length;
    const loadedResources = this.resources.filter(r => r.loaded || r.error).length;
    const loadedComponents = this.componentLoaders.filter(c => c.loaded || c.error).length;
    this.loadedCount = loadedResources + loadedComponents;

    const progress = this.totalCount > 0
      ? Math.min(100, Math.round((this.loadedCount / this.totalCount) * 100))
      : 100;

    this.notifyListeners(progress);

    // Check if all critical resources are loaded
    const criticalResources = this.resources.filter(r => r.critical);
    const criticalComponents = this.componentLoaders.filter(c => c.critical);
    const loadedCriticalResources = criticalResources.filter(r => r.loaded || r.error);
    const loadedCriticalComponents = criticalComponents.filter(c => c.loaded || c.error);

    const allCriticalLoaded =
      loadedCriticalResources.length === criticalResources.length &&
      loadedCriticalComponents.length === criticalComponents.length;

    if ((criticalResources.length > 0 || criticalComponents.length > 0) && allCriticalLoaded && !this.isComplete) {
      this.isComplete = true;
    } else if (criticalResources.length === 0 && criticalComponents.length === 0 && this.loadedCount === this.totalCount && !this.isComplete) {
      this.isComplete = true;
    }
  }

  /**
   * Add progress listener
   */
  onProgress(callback) {
    this.listeners.push(callback);
  }

  /**
   * Remove progress listener
   */
  offProgress(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  /**
   * Notify all listeners
   */
  notifyListeners(progress) {
    this.listeners.forEach(listener => {
      try {
        listener(progress, this.loadedCount, this.totalCount);
      } catch (error) {
        console.error('Error in progress listener:', error);
      }
    });
  }

  /**
   * Start preloading all resources and components
   */
  async preloadAll() {
    if (this.resources.length === 0 && this.componentLoaders.length === 0) {
      this.notifyListeners(100);
      this.isComplete = true;
      return;
    }

    // Preload resources in parallel (but limit concurrency for better performance)
    const CONCURRENT_LIMIT = 6;
    const resources = [...this.resources];
    const components = [...this.componentLoaders];

    // Separate critical and non-critical resources
    const criticalResources = resources.filter(r => r.critical);
    const nonCriticalResources = resources.filter(r => !r.critical);
    const criticalComponents = components.filter(c => c.critical);
    const nonCriticalComponents = components.filter(c => !c.critical);

    const preloadResourceBatch = async (batch) => {
      const results = await Promise.allSettled(
        batch.map(resource => this.preloadResource(resource))
      );
      if (process.env.NODE_ENV === 'development') {
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.warn(`Failed to preload resource:`, batch[index].url);
          }
        });
      }
    };

    const preloadComponentBatch = async (batch) => {
      const results = await Promise.allSettled(
        batch.map(component => this.preloadComponent(component))
      );
      if (process.env.NODE_ENV === 'development') {
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.warn(`Failed to preload component:`, batch[index].name);
          }
        });
      }
    };

    // Load critical resources first
    for (let i = 0; i < criticalResources.length; i += CONCURRENT_LIMIT) {
      const batch = criticalResources.slice(i, i + CONCURRENT_LIMIT);
      await preloadResourceBatch(batch);
    }

    // Load critical components
    for (let i = 0; i < criticalComponents.length; i += CONCURRENT_LIMIT) {
      const batch = criticalComponents.slice(i, i + CONCURRENT_LIMIT);
      await preloadComponentBatch(batch);
    }

    // Then load non-critical resources (don't wait for them to block completion)
    if (nonCriticalResources.length > 0) {
      preloadResourceBatch(nonCriticalResources).catch(() => {});
    }

    // Load non-critical components in background
    if (nonCriticalComponents.length > 0) {
      preloadComponentBatch(nonCriticalComponents).catch(() => {});
    }

    // Ensure we're at 100% when critical resources are done
    this.notifyListeners(100);
    this.isComplete = true;
  }

  /**
   * Get loading status
   */
  getStatus() {
    return {
      progress: this.totalCount > 0 
        ? Math.min(100, Math.round((this.loadedCount / this.totalCount) * 100))
        : 100,
      loaded: this.loadedCount,
      total: this.totalCount,
      isComplete: this.isComplete,
    };
  }

  /**
   * Reset preloader
   */
  reset() {
    this.resources = [];
    this.componentLoaders = [];
    this.loadedCount = 0;
    this.totalCount = 0;
    this.isComplete = false;
  }
}

// Singleton instance
let preloaderInstance = null;

export const getResourcePreloader = () => {
  if (!preloaderInstance) {
    preloaderInstance = new ResourcePreloader();
  }
  return preloaderInstance;
};

export default ResourcePreloader;

