// Main Three.js initialization for homepage
import StaticThreeScene from './three/static-scene.js';
import WebGLFallback from './three/fallback.js';

class HomepageThree {
  constructor() {
    this.container = null;
    this.threeScene = null;
    this.fallback = new WebGLFallback();
    this.navOverlay = null;
    this.isThreeJSActive = false;
    
    this.init();
  }
  
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }
  
  setup() {
    this.container = document.getElementById('three-hero');
    
    if (!this.container) {
      console.warn('Three.js container not found');
      return;
    }
    
    // Check if we should use Three.js
    if (!this.fallback.shouldUseThreeJS()) {
      console.log('Using fallback hero due to device limitations');
      this.fallback.createFallbackHero(this.container);
      this.setupFallbackNavigation();
      return;
    }
    
    // Show loading indicator
    this.fallback.createLoadingIndicator(this.container);
    
    // Initialize Three.js scene with a small delay to ensure smooth loading
    setTimeout(() => {
      try {
        this.initializeThreeJS();
      } catch (error) {
        console.error('Three.js initialization failed:', error);
        this.fallback.showError(this.container);
        this.setupFallbackNavigation();
      }
    }, 100);
  }
  
  initializeThreeJS() {
    // Clear container
    this.container.innerHTML = '';
    
    // Initialize Three.js scene
    this.threeScene = new StaticThreeScene(this.container);
    this.isThreeJSActive = true;
    
    console.log('Three.js scene initialized successfully');
  }
  
  // Navigation is now handled directly in the 3D scene
  // No overlay needed
  
  // No scroll behavior needed for static scene
  
  setupFallbackNavigation() {
    // For fallback mode, ensure navigation works smoothly
    const navLinks = document.querySelectorAll('.hero-btn, .float-element[data-href]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href') || link.dataset.href;
        if (href) {
          // Add smooth transition
          document.body.style.opacity = '0.8';
          setTimeout(() => {
            window.location.href = href;
          }, 150);
        }
      });
    });
  }
  
  destroy() {
    if (this.threeScene) {
      this.threeScene.dispose();
      this.threeScene = null;
    }
    
    if (this.navOverlay) {
      this.navOverlay.remove();
      this.navOverlay = null;
    }
    
    this.isThreeJSActive = false;
  }
  
  // Public method to check if Three.js is active
  isActive() {
    return this.isThreeJSActive;
  }
}

// Initialize when script loads
let homepageThree;

// Ensure cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (homepageThree) {
    homepageThree.destroy();
  }
});

// Auto-initialize
homepageThree = new HomepageThree();

// Export for potential external use
window.HomepageThree = HomepageThree;

export default HomepageThree;