import * as THREE from '../three.module.js';
import { FontLoader } from '../FontLoader.js';

class StaticThreeScene {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.isAnimating = true;
    this.frameId = null;
    
    // Performance settings
    this.isMobile = this.detectMobile();
    this.particleCount = this.isMobile ? 200 : 800;
    
    // Text elements
    this.textElements = [];
    this.lights = {};
    this.font = null;
    
    // Hover state
    this.hoveredElement = null;
    
    this.init();
  }
  
  detectMobile() {
    return window.innerWidth < 768 || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  async init() {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f0f0f);
    
    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75, 
      this.container.clientWidth / this.container.clientHeight, 
      0.1, 
      1000
    );
    this.camera.position.set(0, 0, 12);
    
    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: !this.isMobile,
      alpha: true,
      powerPreference: this.isMobile ? 'low-power' : 'high-performance'
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1 : 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);
    
    // Load font and create scene
    await this.loadFont();
    this.createLighting();
    this.createText();
    this.createBackgroundElements();
    this.addEventListeners();
    
    // Start animation loop
    this.animate();
  }
  
  async loadFont() {
    return new Promise((resolve, reject) => {
      const loader = new FontLoader();
      // Use a simple font that works well for 3D text
      const fontPath = 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json';
      
      loader.load(
        fontPath,
        (font) => {
          this.font = font;
          resolve();
        },
        undefined,
        (error) => {
          console.warn('Font loading failed, using fallback');
          // Create a simple fallback
          this.font = null;
          resolve();
        }
      );
    });
  }
  
  createLighting() {
    // Ambient light for base visibility
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    this.scene.add(ambientLight);
    
    // Main directional light (key light)
    const directionalLight = new THREE.DirectionalLight(0x4a90e2, 1);
    directionalLight.position.set(-5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    this.scene.add(directionalLight);
    this.lights.directional = directionalLight;
    
    // Spotlight for main title
    const titleSpot = new THREE.SpotLight(0x4a90e2, 2, 50, Math.PI / 6, 0.3);
    titleSpot.position.set(0, 8, 8);
    titleSpot.target.position.set(0, 2, 0);
    this.scene.add(titleSpot);
    this.scene.add(titleSpot.target);
    this.lights.titleSpot = titleSpot;
    
    // Point lights for navigation elements (will be positioned later)
    this.lights.navLights = [];
  }
  
  createText() {
    if (!this.font) {
      this.createFallbackText();
      return;
    }
    
    // Main title
    this.createMainTitle();
    
    // Navigation elements
    this.createNavigation();
  }
  
  createMainTitle() {
    const textGeometry = new THREE.TextGeometry('YOUR NAME', {
      font: this.font,
      size: this.isMobile ? 1.2 : 2,
      depth: 0.3,
      curveSegments: 8,
      bevelEnabled: false
    });
    
    textGeometry.computeBoundingBox();
    const centerX = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
    textGeometry.translate(centerX, 0, 0);
    
    const textMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      shininess: 100,
      transparent: true,
      opacity: 0.9
    });
    
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(0, 2, 0);
    textMesh.castShadow = true;
    textMesh.userData = { type: 'title', isInteractive: false };
    
    this.scene.add(textMesh);
    this.textElements.push(textMesh);
  }
  
  createNavigation() {
    const navItems = [
      { text: 'ESSAYS', url: '/essays', color: 0x3b82f6, position: { x: -6, y: -1, z: 0 } },
      { text: 'PROJECTS', url: '/projects', color: 0x10b981, position: { x: -2, y: -1, z: 0 } },
      { text: 'CV', url: '/cv', color: 0xf59e0b, position: { x: 2, y: -1, z: 0 } },
      { text: 'ABOUT', url: '#about', color: 0x8b5cf6, position: { x: 6, y: -1, z: 0 } }
    ];
    
    // Adjust positions for mobile
    if (this.isMobile) {
      navItems.forEach((item, index) => {
        item.position.x = (index - 1.5) * 3;
        item.position.y = -2;
      });
    }
    
    navItems.forEach((item, index) => {
      const textGeometry = new THREE.TextGeometry(item.text, {
        font: this.font,
        size: this.isMobile ? 0.6 : 0.8,
        depth: 0.2,
        curveSegments: 6,
        bevelEnabled: false
      });
      
      textGeometry.computeBoundingBox();
      const centerX = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
      textGeometry.translate(centerX, 0, 0);
      
      const textMaterial = new THREE.MeshPhongMaterial({ 
        color: item.color,
        shininess: 80,
        transparent: true,
        opacity: 0.8
      });
      
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(item.position.x, item.position.y, item.position.z);
      textMesh.castShadow = true;
      textMesh.userData = { 
        type: 'navigation', 
        url: item.url, 
        originalColor: item.color,
        originalOpacity: 0.8,
        isInteractive: true,
        index: index
      };
      
      this.scene.add(textMesh);
      this.textElements.push(textMesh);
      
      // Add point light for this navigation item
      const pointLight = new THREE.PointLight(item.color, 0.5, 10);
      pointLight.position.set(item.position.x, item.position.y + 1, item.position.z + 2);
      this.scene.add(pointLight);
      this.lights.navLights.push(pointLight);
    });
  }
  
  createFallbackText() {
    // Simple geometric shapes as fallback when font fails to load
    const titleGeometry = new THREE.BoxGeometry(8, 1, 0.5);
    const titleMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const titleMesh = new THREE.Mesh(titleGeometry, titleMaterial);
    titleMesh.position.set(0, 2, 0);
    this.scene.add(titleMesh);
    
    // Simple nav elements
    const navColors = [0x3b82f6, 0x10b981, 0xf59e0b, 0x8b5cf6];
    const navUrls = ['/essays', '/projects', '/cv', '#about'];
    
    for (let i = 0; i < 4; i++) {
      const navGeometry = new THREE.BoxGeometry(2, 0.5, 0.3);
      const navMaterial = new THREE.MeshPhongMaterial({ color: navColors[i] });
      const navMesh = new THREE.Mesh(navGeometry, navMaterial);
      navMesh.position.set((i - 1.5) * 3, -1, 0);
      navMesh.userData = { 
        type: 'navigation', 
        url: navUrls[i], 
        isInteractive: true,
        index: i
      };
      this.scene.add(navMesh);
      this.textElements.push(navMesh);
    }
  }
  
  createBackgroundElements() {
    // Subtle particle field
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    
    const color = new THREE.Color();
    
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions in a large sphere
      const radius = Math.random() * 20 + 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Subtle blue-white colors
      color.setHSL(0.6 + Math.random() * 0.1, 0.3, 0.8);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(geometry, material);
    this.scene.add(particles);
    this.particles = particles;
  }
  
  addEventListeners() {
    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.container.addEventListener('click', this.onClick.bind(this));
    
    // Pause animation when tab is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAnimation();
      } else {
        this.resumeAnimation();
      }
    });
  }
  
  onWindowResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }
  
  onMouseMove(event) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const interactiveElements = this.textElements.filter(el => el.userData.isInteractive);
    const intersects = this.raycaster.intersectObjects(interactiveElements);
    
    // Reset previous hover
    if (this.hoveredElement) {
      this.resetElementHover(this.hoveredElement);
      this.hoveredElement = null;
      this.container.style.cursor = 'default';
    }
    
    // Handle new hover
    if (intersects.length > 0) {
      this.hoveredElement = intersects[0].object;
      this.setElementHover(this.hoveredElement);
      this.container.style.cursor = 'pointer';
    }
  }
  
  onClick(event) {
    if (this.hoveredElement && this.hoveredElement.userData.url) {
      // Create brief light flash effect
      this.createLightFlash(this.hoveredElement.position);
      
      // Navigate normally
      setTimeout(() => {
        if (this.hoveredElement.userData.url.startsWith('#')) {
          // Scroll to element (for about section)
          const element = document.querySelector(this.hoveredElement.userData.url);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          // Navigate to page
          window.location.href = this.hoveredElement.userData.url;
        }
      }, 100);
    }
  }
  
  setElementHover(element) {
    // Scale up slightly
    element.scale.setScalar(1.1);
    
    // Increase opacity
    element.material.opacity = 1.0;
    
    // Boost associated light
    if (element.userData.type === 'navigation' && this.lights.navLights[element.userData.index]) {
      this.lights.navLights[element.userData.index].intensity = 1.5;
    }
  }
  
  resetElementHover(element) {
    // Reset scale
    element.scale.setScalar(1.0);
    
    // Reset opacity
    element.material.opacity = element.userData.originalOpacity || 0.8;
    
    // Reset light
    if (element.userData.type === 'navigation' && this.lights.navLights[element.userData.index]) {
      this.lights.navLights[element.userData.index].intensity = 0.5;
    }
  }
  
  createLightFlash(position) {
    const flashLight = new THREE.PointLight(0xffffff, 3, 5);
    flashLight.position.copy(position);
    flashLight.position.z += 2;
    this.scene.add(flashLight);
    
    // Animate flash
    let intensity = 3;
    const fadeFlash = () => {
      intensity *= 0.9;
      flashLight.intensity = intensity;
      
      if (intensity > 0.1) {
        requestAnimationFrame(fadeFlash);
      } else {
        this.scene.remove(flashLight);
      }
    };
    fadeFlash();
  }
  
  animate(currentTime = 0) {
    if (!this.isAnimating) return;
    
    const time = currentTime * 0.001;
    
    // Gentle floating animation for title
    if (this.textElements.length > 0) {
      const titleElement = this.textElements.find(el => el.userData.type === 'title');
      if (titleElement) {
        titleElement.position.y = 2 + Math.sin(time * 0.5) * 0.1;
      }
    }
    
    // Subtle particle rotation
    if (this.particles) {
      this.particles.rotation.y = time * 0.05;
    }
    
    // Light breathing effect
    if (this.lights.titleSpot) {
      this.lights.titleSpot.intensity = 2 + Math.sin(time * 1.5) * 0.3;
    }
    
    // Subtle navigation light pulsing
    this.lights.navLights.forEach((light, index) => {
      if (this.hoveredElement && this.hoveredElement.userData.index === index) return; // Don't pulse hovered light
      light.intensity = 0.5 + Math.sin(time * 2 + index) * 0.1;
    });
    
    this.renderer.render(this.scene, this.camera);
    this.frameId = requestAnimationFrame(this.animate.bind(this));
  }
  
  pauseAnimation() {
    this.isAnimating = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }
  
  resumeAnimation() {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.animate();
    }
  }
  
  dispose() {
    this.pauseAnimation();
    
    // Clean up geometry and materials
    this.scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    
    // Remove event listeners
    window.removeEventListener('resize', this.onWindowResize);
    this.container.removeEventListener('mousemove', this.onMouseMove);
    this.container.removeEventListener('click', this.onClick);
    
    // Clean up renderer
    if (this.renderer) {
      this.renderer.dispose();
      if (this.container.contains(this.renderer.domElement)) {
        this.container.removeChild(this.renderer.domElement);
      }
    }
  }
}

export default StaticThreeScene;