// WebGL detection and fallback system
class WebGLFallback {
  constructor() {
    this.isWebGLSupported = this.detectWebGL();
    this.isLowEndDevice = this.detectLowEndDevice();
  }
  
  detectWebGL() {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!context;
    } catch (e) {
      return false;
    }
  }
  
  detectLowEndDevice() {
    // Basic heuristics for low-end device detection
    const memory = navigator.deviceMemory || 4; // Default to 4GB if not available
    const cores = navigator.hardwareConcurrency || 4; // Default to 4 cores
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Consider it low-end if:
    // - Less than 3GB RAM
    // - Less than 4 CPU cores
    // - Mobile device with small screen
    return memory < 3 || cores < 4 || (isMobile && window.innerWidth < 414);
  }
  
  shouldUseThreeJS() {
    return this.isWebGLSupported && !this.isLowEndDevice;
  }
  
  createFallbackHero(container) {
    // Create a static hero section with CSS animations
    const heroHTML = `
      <div class="fallback-hero">
        <div class="hero-content">
          <div class="animated-gradient"></div>
          <div class="hero-text">
            <h1 class="hero-title">YOUR NAME</h1>
            <p class="hero-subtitle">
              Creative Technologist & Digital Storyteller
            </p>
            <div class="hero-buttons">
              <a href="/essays" class="hero-btn primary">Essays</a>
              <a href="/projects" class="hero-btn primary">Projects</a>
              <a href="/cv" class="hero-btn primary">CV</a>
              <a href="#about" class="hero-btn secondary">About</a>
            </div>
          </div>
        </div>
      </div>
    `;
    
    container.innerHTML = heroHTML;
    
    // Add click handlers for floating elements
    const floatingElements = container.querySelectorAll('.float-element[data-href]');
    floatingElements.forEach(element => {
      element.addEventListener('click', () => {
        window.location.href = element.dataset.href;
      });
    });
    
    return true;
  }
  
  createLoadingIndicator(container) {
    const loadingHTML = `
      <div class="three-loading">
        <div class="loading-spinner"></div>
        <p>Loading interactive experience...</p>
      </div>
    `;
    
    container.innerHTML = loadingHTML;
  }
  
  showError(container, message = 'Unable to load 3D experience') {
    console.warn('Three.js initialization failed:', message);
    this.createFallbackHero(container);
  }
}

export default WebGLFallback;