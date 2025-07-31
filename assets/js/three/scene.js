import * as THREE from '../three.module.js';

class ThreeScene {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.isAnimating = true;
    this.frameId = null;
    
    // Performance settings
    this.isMobile = this.detectMobile();
    this.particleCount = this.isMobile ? 500 : 1500;
    this.maxFPS = this.isMobile ? 30 : 60;
    this.lastFrameTime = 0;
    this.frameInterval = 1000 / this.maxFPS;
    
    // Content data for particles
    this.contentNodes = this.generateContentNodes();
    
    this.init();
    this.addEventListeners();
  }
  
  detectMobile() {
    return window.innerWidth < 768 || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  generateContentNodes() {
    return [
      // Essays
      { type: 'essay', title: 'AI & Creativity', position: new THREE.Vector3(-3, 2, 0), color: 0x3b82f6 },
      { type: 'essay', title: 'Future Tech', position: new THREE.Vector3(2, 3, -1), color: 0x3b82f6 },
      { type: 'essay', title: 'Design Thinking', position: new THREE.Vector3(-1, -2, 1), color: 0x3b82f6 },
      
      // Projects  
      { type: 'project', title: 'Finance Tracker', position: new THREE.Vector3(3, -1, 0), color: 0x10b981 },
      { type: 'project', title: 'Web Portfolio', position: new THREE.Vector3(-2, 1, -2), color: 0x10b981 },
      { type: 'project', title: 'Data Viz', position: new THREE.Vector3(1, -3, 1), color: 0x10b981 },
      
      // Skills
      { type: 'skill', title: 'React', position: new THREE.Vector3(0, 2, 2), color: 0xf59e0b },
      { type: 'skill', title: 'Three.js', position: new THREE.Vector3(-3, 0, -1), color: 0xf59e0b },
      { type: 'skill', title: 'Node.js', position: new THREE.Vector3(2, 0, 2), color: 0xf59e0b },
      { type: 'skill', title: 'Python', position: new THREE.Vector3(0, -1, -2), color: 0xf59e0b },
    ];
  }
  
  init() {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0a);
    
    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75, 
      this.container.clientWidth / this.container.clientHeight, 
      0.1, 
      1000
    );
    this.camera.position.set(0, 0, 8);
    
    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: !this.isMobile,
      alpha: true,
      powerPreference: this.isMobile ? 'low-power' : 'high-performance'
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1 : 2));
    this.container.appendChild(this.renderer.domElement);
    
    // Create particle system
    this.createParticleSystem();
    
    // Create content nodes
    this.createContentNodes();
    
    // Add ambient lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);
    
    // Add point light
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(5, 5, 5);
    this.scene.add(pointLight);
    
    // Start animation loop
    this.animate();
  }
  
  createParticleSystem() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    const sizes = new Float32Array(this.particleCount);
    
    const color = new THREE.Color();
    
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions in a sphere
      const radius = Math.random() * 15 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Random colors (blue tones)
      color.setHSL(0.6 + Math.random() * 0.2, 0.8, 0.5 + Math.random() * 0.3);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      // Random sizes
      sizes[i] = Math.random() * 3 + 1;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distance = length(gl_PointCoord - vec2(0.5));
          if (distance > 0.5) discard;
          
          float alpha = 1.0 - distance * 2.0;
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }
  
  createContentNodes() {
    this.contentNodes.forEach((node, index) => {
      const geometry = new THREE.SphereGeometry(0.15, 16, 16);
      const material = new THREE.MeshLambertMaterial({ 
        color: node.color,
        transparent: true,
        opacity: 0.8
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(node.position);
      mesh.userData = { ...node, index };
      
      // Add glow effect
      const glowGeometry = new THREE.SphereGeometry(0.25, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
      });
      
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      mesh.add(glow);
      
      this.scene.add(mesh);
    });
  }
  
  addEventListeners() {
    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.container.addEventListener('click', this.onMouseClick.bind(this));
    
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
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    
    // Reset all materials
    this.scene.children.forEach(child => {
      if (child.userData && child.userData.type) {
        child.material.opacity = 0.8;
        child.scale.setScalar(1);
      }
    });
    
    // Highlight intersected objects
    if (intersects.length > 0) {
      const intersected = intersects[0].object;
      if (intersected.userData && intersected.userData.type) {
        intersected.material.opacity = 1;
        intersected.scale.setScalar(1.2);
        this.container.style.cursor = 'pointer';
      }
    } else {
      this.container.style.cursor = 'default';
    }
  }
  
  onMouseClick(event) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    
    if (intersects.length > 0) {
      const intersected = intersects[0].object;
      if (intersected.userData && intersected.userData.type) {
        this.handleNodeClick(intersected.userData);
      }
    }
  }
  
  handleNodeClick(nodeData) {
    // Create ripple effect
    this.createRippleEffect(nodeData.position);
    
    // Navigate based on node type
    switch (nodeData.type) {
      case 'essay':
        window.location.href = '/essays';
        break;
      case 'project':
        window.location.href = '/projects';
        break;
      case 'skill':
        // Could show a modal or scroll to skills section
        console.log('Skill clicked:', nodeData.title);
        break;
    }
  }
  
  createRippleEffect(position) {
    const rippleGeometry = new THREE.RingGeometry(0.1, 0.5, 16);
    const rippleMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    
    const ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
    ripple.position.copy(position);
    ripple.lookAt(this.camera.position);
    this.scene.add(ripple);
    
    // Animate ripple
    const startTime = Date.now();
    const animateRipple = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / 1000; // 1 second animation
      
      if (progress < 1) {
        ripple.scale.setScalar(1 + progress * 2);
        ripple.material.opacity = 0.8 * (1 - progress);
        requestAnimationFrame(animateRipple);
      } else {
        this.scene.remove(ripple);
      }
    };
    animateRipple();
  }
  
  animate(currentTime = 0) {
    if (!this.isAnimating) return;
    
    // Throttle frame rate
    if (currentTime - this.lastFrameTime < this.frameInterval) {
      this.frameId = requestAnimationFrame(this.animate.bind(this));
      return;
    }
    
    this.lastFrameTime = currentTime;
    
    // Update animations
    const time = currentTime * 0.001;
    
    // Rotate particle system slowly
    if (this.particles) {
      this.particles.rotation.y = time * 0.1;
      this.particles.material.uniforms.time.value = time;
    }
    
    // Animate content nodes
    this.scene.children.forEach((child, index) => {
      if (child.userData && child.userData.type) {
        child.position.y += Math.sin(time + index) * 0.002;
        child.rotation.y += 0.01;
      }
    });
    
    // Render scene
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
    this.container.removeEventListener('click', this.onMouseClick);
    
    // Clean up renderer
    if (this.renderer) {
      this.renderer.dispose();
      if (this.container.contains(this.renderer.domElement)) {
        this.container.removeChild(this.renderer.domElement);
      }
    }
  }
}

export default ThreeScene;