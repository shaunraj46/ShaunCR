/**
 * Premium JavaScript for Shaun Raj's Portfolio 3.0
 * Enhanced with smooth animations, interactive 3D effects, and optimized performance
 */

// Wait for DOM to be loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core functionality immediately
    initializeCore();
    
    // Add load event to handle post-loading initialization
    window.addEventListener('load', function() {
        // Remove page loader with animation
        hidePageLoader();
        
        // Initialize Three.js scene with enhanced effects
        initThreeJsScene();
        
        // Initialize animations and effects
        initializeAnimations();
        
        // Set body as loaded to enable transitions and animations
        document.body.classList.remove('preload');
        document.body.classList.add('loaded');
    });
});

/**
 * Initialize core functionality
 */
function initializeCore() {
    // Check device capability and set appropriate classes
    detectDeviceCapabilities();
    
    // Initialize enhanced mobile menu
    initializeMobileMenu();
    
    // Set up smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize scroll progress indicator
    initializeScrollProgress();
    
    // Initialize navigation highlighting
    initializeNavHighlighting();
    
    // Initialize scroll-down indicator
    initializeScrollDownIndicator();
    
    // Fix iOS-specific issues
    if (isIOS()) {
        fixIOSViewportHeight();
    }
}

/**
 * Detect device capabilities and set appropriate body classes
 */
function detectDeviceCapabilities() {
    // Check if mobile
    if (window.innerWidth <= 768) {
        document.body.classList.add('mobile');
    }
    
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduce-motion');
    }
    
    // Check if low-end device (limited CPU cores or memory)
    if (
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
        (navigator.deviceMemory && navigator.deviceMemory <= 4)
    ) {
        document.body.classList.add('low-end-device');
    }
    
    // Check for Data Saver mode
    if (navigator.connection && navigator.connection.saveData) {
        document.body.classList.add('save-data');
    }
    
    // Check for touch capability
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
    }
    
    // Detect high-end GPU capability for enhanced effects
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
        
        // Check for high-end GPU
        const highEndGPU = /(nvidia|radeon|geforce|intel iris)/i.test(renderer);
        if (highEndGPU && !document.body.classList.contains('low-end-device')) {
            document.body.classList.add('high-performance-gpu');
        }
    }
}

/**
 * Initialize enhanced mobile menu functionality
 */
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuToggle || !navLinks) return;
    
    // Toggle menu with animation
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Add staggered animation to links
        if (navLinks.classList.contains('active')) {
            const links = navLinks.querySelectorAll('a');
            links.forEach((link, index) => {
                link.style.opacity = '0';
                link.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    link.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    link.style.opacity = '1';
                    link.style.transform = 'translateY(0)';
                }, 100 + (index * 50));
            });
        }
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(event.target) && 
            !menuToggle.contains(event.target)) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

/**
 * Initialize smooth scrolling for anchor links with enhanced behavior
 */
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip if it's just "#"
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate proper offset based on device and fixed navigation
                const navHeight = document.querySelector('nav').offsetHeight;
                const headerOffset = window.innerWidth <= 768 ? navHeight : navHeight + 20;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: offsetPosition,
                    behavior: document.body.classList.contains('reduce-motion') ? 'auto' : 'smooth'
                });
                
                // Update URL without page reload
                history.pushState(null, null, targetId);
                
                // Update active navigation state
                updateActiveNavLink(targetId);
            }
        });
    });
}

/**
 * Initialize scroll progress indicator with enhanced behavior
 */
function initializeScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;
    
    // Use throttled scroll listener for better performance
    let lastScrollTime = 0;
    const throttleTime = 10; // ms
    
    window.addEventListener('scroll', function() {
        const now = Date.now();
        
        if (now - lastScrollTime > throttleTime) {
            lastScrollTime = now;
            
            // Use requestAnimationFrame to optimize updates
            requestAnimationFrame(function() {
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrolled = (window.scrollY / scrollHeight) * 100;
                progressBar.style.width = scrolled + '%';
                
                // Add glow effect at certain thresholds
                if (scrolled > 25 && scrolled < 30) {
                    progressBar.classList.add('glow');
                    setTimeout(() => progressBar.classList.remove('glow'), 500);
                } else if (scrolled > 50 && scrolled < 55) {
                    progressBar.classList.add('glow');
                    setTimeout(() => progressBar.classList.remove('glow'), 500);
                } else if (scrolled > 75 && scrolled < 80) {
                    progressBar.classList.add('glow');
                    setTimeout(() => progressBar.classList.remove('glow'), 500);
                } else if (scrolled > 95) {
                    progressBar.classList.add('glow');
                    setTimeout(() => progressBar.classList.remove('glow'), 500);
                }
            });
        }
    }, { passive: true });
}

/**
 * Initialize navigation highlighting based on scroll position
 */
function initializeNavHighlighting() {
    // Get all sections that should trigger navigation highlights
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const nav = document.querySelector('nav');
    
    if (!sections.length || !navLinks.length || !nav) return;
    
    // Highlight active section on scroll
    const highlightNavigation = () => {
        // Add scrolled class to navigation when scrolled past threshold
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Find the current section
        let currentSectionId = '';
        const scrollPosition = window.scrollY + (window.innerHeight / 3);
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        // Update active navigation links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };
    
    // Use throttled scroll listener for better performance
    let lastScrollTime = 0;
    const throttleTime = 100; // ms
    
    window.addEventListener('scroll', function() {
        const now = Date.now();
        
        if (now - lastScrollTime > throttleTime) {
            lastScrollTime = now;
            requestAnimationFrame(highlightNavigation);
        }
    }, { passive: true });
    
    // Run once on page load
    highlightNavigation();
}

/**
 * Initialize scroll-down indicator functionality
 */
function initializeScrollDownIndicator() {
    const scrollIndicator = document.querySelector('.scroll-down-indicator');
    if (!scrollIndicator) return;
    
    // Hide indicator after scrolling down
    window.addEventListener('scroll', function() {
        if (window.scrollY > window.innerHeight * 0.3) {
            scrollIndicator.classList.add('hidden');
        } else {
            scrollIndicator.classList.remove('hidden');
        }
    }, { passive: true });
    
    // Scroll down when clicking the indicator
    scrollIndicator.addEventListener('click', function() {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            const navHeight = document.querySelector('nav').offsetHeight;
            const offsetPosition = aboutSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: document.body.classList.contains('reduce-motion') ? 'auto' : 'smooth'
            });
        }
    });
}

/**
 * Update active navigation link
 */
function updateActiveNavLink(targetId) {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

/**
 * Hide page loader with enhanced animation
 */
function hidePageLoader() {
    const loader = document.querySelector('.page-loader');
    const counter = document.querySelector('.loader-counter');
    if (!loader) return;
    
    // Animate counter from 0 to 100
    let count = 0;
    const counterInterval = setInterval(() => {
        count += Math.floor(Math.random() * 5) + 1;
        if (count > 100) count = 100;
        
        if (counter) counter.textContent = count + '%';
        
        if (count === 100) {
            clearInterval(counterInterval);
            
            // Wait a moment before hiding
            setTimeout(() => {
                // Add animated fade out class
                loader.classList.add('loader-hidden');
                
                // Remove from DOM after animation completes
                loader.addEventListener('transitionend', function() {
                    if (loader.parentNode) {
                        loader.parentNode.removeChild(loader);
                    }
                });
            }, 300);
        }
    }, 40);
}

/**
 * Initialize animations with enhanced visibility detection
 */
function initializeAnimations() {
    // Skip complex animations if reduced motion is preferred
    if (document.body.classList.contains('reduce-motion')) {
        // Make all elements visible immediately
        document.querySelectorAll('.image-reveal, .glass-card, .section-intro-animation').forEach(el => {
            el.classList.add('visible');
        });
        return;
    }
    
    // Initialize element visibility animations with enhanced options
    initializeVisibilityAnimations();
    
    // Initialize 3D card effects - only on capable devices
    if (
        !document.body.classList.contains('low-end-device') && 
        !document.body.classList.contains('reduce-motion') && 
        window.innerWidth > 768
    ) {
        initialize3DEffects();
    }
    
    // Initialize parallax effects
    if (
        !document.body.classList.contains('low-end-device') && 
        !document.body.classList.contains('reduce-motion')
    ) {
        initializeParallaxEffects();
    }
    
    // Add floating animation to select elements
    initializeFloatingElements();
    
    // Initialize hero particles
    initializeHeroParticles();
}

/**
 * Initialize visibility animations with enhanced IntersectionObserver
 */
function initializeVisibilityAnimations() {
    // Get elements to observe
    const elementsToAnimate = document.querySelectorAll(
        '.image-reveal, .glass-card, .section-intro-animation, .skill-icon, .achievement-item'
    );
    
    if (elementsToAnimate.length === 0) return;
    
    // Create IntersectionObserver with enhanced options
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add stagger delay based on element position
                const delay = entry.target.dataset.animationDelay || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                
                // Stop observing after animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
    });
    
    // Observe all elements with staggered delays
    elementsToAnimate.forEach((element, index) => {
        // Add staggered delay for groups of elements
        if (element.parentElement && element.parentElement.classList.contains('projects-grid')) {
            element.dataset.animationDelay = 100 * (index % 3); // Stagger by position in grid
        } else if (element.parentElement && element.parentElement.classList.contains('skills-container')) {
            element.dataset.animationDelay = 100 * (index % 4); // Stagger by position in grid
        } else if (element.classList.contains('achievement-item')) {
            element.dataset.animationDelay = 100 * index; // Stagger in sequence
        }
        
        observer.observe(element);
    });
}

/**
 * Initialize enhanced 3D card hover effects
 */
function initialize3DEffects() {
    const cards = document.querySelectorAll('.glass-card');
    
    cards.forEach(card => {
        // Create a wrapper for 3D content if not already present
        if (!card.querySelector('.content-3d')) {
            const children = Array.from(card.childNodes);
            const wrapper = document.createElement('div');
            wrapper.className = 'content-3d';
            
            children.forEach(child => wrapper.appendChild(child));
            card.appendChild(wrapper);
        }
        
        // Enhanced 3D effect with realistic lighting
        card.addEventListener('mousemove', function(e) {
            // Skip on mobile, low-end devices, or reduced motion
            if (
                window.innerWidth <= 768 || 
                document.body.classList.contains('reduce-motion') ||
                document.body.classList.contains('low-end-device')
            ) return;
            
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // Calculate rotation and limit to less extreme angles
            const offsetX = ((mouseX - centerX) / (rect.width / 2)) * 7;
            const offsetY = ((mouseY - centerY) / (rect.height / 2)) * 7;
            
            // Apply transformation with enhanced perspective
            const content = card.querySelector('.content-3d') || card;
            content.style.transform = `
                rotateY(${offsetX}deg) 
                rotateX(${-offsetY}deg) 
                translateZ(20px)
            `;
            
            // Add dynamic highlight effect
            const lightPosX = (mouseX - rect.left) / rect.width * 100;
            const lightPosY = (mouseY - rect.top) / rect.height * 100;
            
            // Apply dynamic light position
            card.style.background = `
                radial-gradient(
                    circle at ${lightPosX}% ${lightPosY}%, 
                    rgba(99, 102, 241, 0.1), 
                    rgba(15, 23, 42, 0.7) 60%
                )
            `;
        });
        
        // Smooth reset on mouse leave
        card.addEventListener('mouseleave', function() {
            const content = card.querySelector('.content-3d') || card;
            
            // Smooth transition back
            content.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            content.style.transform = '';
            
            // Reset background
            card.style.background = '';
            
            // Reset transition after animation completes
            setTimeout(() => {
                content.style.transition = '';
            }, 500);
        });
        
        // Add entrance animations
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
    });
}

/**
 * Initialize parallax effects for enhanced visual experience
 */
function initializeParallaxEffects() {
    // Skip for devices with reduced motion or low-end devices
    if (
        document.body.classList.contains('reduce-motion') || 
        document.body.classList.contains('low-end-device')
    ) return;
    
    // Create subtle parallax effect on scroll
    window.addEventListener('scroll', function() {
        requestAnimationFrame(function() {
            const scrollPosition = window.pageYOffset;
            
            // Parallax effect for hero section
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${scrollPosition * 0.15}px)`;
            }
            
            // Parallax effect for section backgrounds
            document.querySelectorAll('section').forEach((section, index) => {
                // Alternate direction for varied effect
                const direction = index % 2 === 0 ? 1 : -1;
                const speed = 0.05;
                
                section.style.backgroundPosition = `
                    ${50 + (direction * scrollPosition * speed * 0.1)}% 
                    ${50 + (scrollPosition * speed * 0.05)}%
                `;
            });
        });
    }, { passive: true });
}

/**
 * Initialize floating animation effect for select elements
 */
function initializeFloatingElements() {
    // Skip for devices with reduced motion or low-end devices
    if (
        document.body.classList.contains('reduce-motion') || 
        document.body.classList.contains('low-end-device')
    ) return;
    
    // Add floating animation class to elements
    const floatingElements = document.querySelectorAll('.skill-icon, .contact-icon');
    
    floatingElements.forEach((element, index) => {
        // Add floating class with delay to create staggered effect
        setTimeout(() => {
            element.classList.add('floating');
            
            // Add slight variance to animation
            element.style.animationDelay = `${(index * 0.2) % 1}s`;
            element.style.animationDuration = `${3 + (index % 2)}s`;
        }, 100);
    });
}

/**
 * Initialize hero section particles
 */
function initializeHeroParticles() {
    // Skip for devices with reduced motion or low-end devices
    if (
        document.body.classList.contains('reduce-motion') || 
        document.body.classList.contains('low-end-device')
    ) return;
    
    const heroParticles = document.querySelector('.hero-particles');
    if (!heroParticles) return;
    
    // Create particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'hero-particle';
        
        // Random positioning
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        
        // Random size
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random animation duration and delay
        particle.style.animationDuration = `${Math.random() * 10 + 15}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        // Add to container
        heroParticles.appendChild(particle);
    }
    
    // Create hero orbs
    for (let i = 0; i < 3; i++) {
        const orb = document.createElement('div');
        orb.className = 'hero-orb';
        
        // Random positioning
        orb.style.top = `${Math.random() * 80 + 10}%`;
        orb.style.left = `${Math.random() * 80 + 10}%`;
        
        // Random animation duration and delay
        orb.style.animationDuration = `${Math.random() * 4 + 6}s`;
        orb.style.animationDelay = `${Math.random() * 2}s`;
        
        // Add to hero section
        document.querySelector('.hero').appendChild(orb);
    }
}

/**
 * Initialize enhanced Three.js scene with premium particle effects
 */
function initThreeJsScene() {
    // Skip for low-end devices or reduced motion
    if (
        document.body.classList.contains('low-end-device') || 
        document.body.classList.contains('reduce-motion') ||
        document.body.classList.contains('save-data')
    ) {
        return;
    }

    // Get container
    const container = document.querySelector('.scene-container');
    if (!container) return;

    // Set up Three.js scene with enhanced options
    const scene = new THREE.Scene();
    
    // Add fog for depth
    scene.fog = new THREE.FogExp2(0x0f172a, 0.035);
    
    // Enhanced camera with better perspective
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Enhanced renderer with better performance options
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: 'high-performance'
    });
    
    // Set up renderer with premium quality settings
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2x for performance
    renderer.setClearColor(0x0f172a, 0);
    container.appendChild(renderer.domElement);
    
    // Camera position with better depth
    camera.position.z = 30;
    
    // Create two particle systems for layered depth effect
    createParticleSystem(scene, 0.05, 2000, 30, true);  // Background particles
    createParticleSystem(scene, 0.08, 1000, 15, false); // Foreground particles
    
    // Add subtle ambient light
    const ambientLight = new THREE.AmbientLight(0x6366f1, 0.5);
    scene.add(ambientLight);
    
    // Add directional light for highlights
    const directionalLight = new THREE.DirectionalLight(0x8b5cf6, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Mouse interaction with enhanced sensitivity
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Enhanced mouse movement tracking
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Enhanced scroll effect
    let scrollY = 0;
    let targetScrollY = 0;
    
    window.addEventListener('scroll', () => {
        targetScrollY = window.scrollY * 0.0003;
    }, { passive: true });
    
    // Animation loop with enhanced performance
    let lastFrameTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;
    
    function animate(currentTime) {
        requestAnimationFrame(animate);
        
        // Throttle frame rate for performance
        if (currentTime - lastFrameTime < frameInterval) return;
        lastFrameTime = currentTime;
        
        // Smooth mouse movement with easing
        targetMouseX = mouseX * 0.15;
        targetMouseY = mouseY * 0.15;
        
        // Update scene rotation based on mouse and scroll
        scene.rotation.x += (targetMouseY - scene.rotation.x) * 0.03;
        scene.rotation.y += (targetMouseX - scene.rotation.y) * 0.03;
        scene.rotation.z += (targetScrollY - scene.rotation.z) * 0.01;
        
        // Add subtle constant rotation for ambient movement
        scene.rotation.y += 0.0005;
        scene.rotation.z += 0.0002;
        
        // Update particle systems for animated effect
        scene.children.forEach(child => {
            if (child instanceof THREE.Points) {
                // Rotate particle system for independent movement
                child.rotation.y += child.userData.rotationSpeed;
                
                // Pulse size effect
                const sizes = child.geometry.attributes.size?.array;
                
                if (sizes) {
                    for (let i = 0; i < sizes.length; i++) {
                        // Subtle size oscillation based on time
                        sizes[i] = child.userData.baseSize * (1 + 0.2 * Math.sin(currentTime * 0.001 + i));
                    }
                    
                    child.geometry.attributes.size.needsUpdate = true;
                }
            }
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
}

/**
 * Create a particle system with enhanced visual effects
 */
function createParticleSystem(scene, size, count, radius, isBackground) {
    // Create geometry for particles
    const particlesGeometry = new THREE.BufferGeometry();
    
    // Create arrays for particles
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    // Define color palette based on position (foreground/background)
    const colorOptions = isBackground ? [
        { h: 0.7, s: 0.8, l: 0.5 }, // Deep blue
        { h: 0.6, s: 0.7, l: 0.6 }, // Indigo
        { h: 0.75, s: 0.8, l: 0.5 } // Purple
    ] : [
        { h: 0.6, s: 0.9, l: 0.7 }, // Bright indigo
        { h: 0.7, s: 0.9, l: 0.7 }, // Brighter blue
        { h: 0.8, s: 0.9, l: 0.7 }  // Bright purple
    ];
    
    // Generate particles with enhanced distribution
    for (let i = 0; i < count; i++) {
        // Calculate index for array
        const i3 = i * 3;
        
        // Create spherical distribution with randomness
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        
        // Add some randomness to radius for more natural look
        const r = radius * (0.5 + Math.random() * 1.5);
        
        // Calculate position
        positions[i3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = r * Math.cos(phi);
        
        // Select random color from palette
        const colorChoice = colorOptions[Math.floor(Math.random() * colorOptions.length)];
        
        // Add slight randomness to color
        const color = new THREE.Color();
        color.setHSL(
            colorChoice.h + (Math.random() * 0.1 - 0.05),
            colorChoice.s + (Math.random() * 0.2 - 0.1),
            colorChoice.l + (Math.random() * 0.2 - 0.1)
        );
        
        // Set color
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
        
        // Set size with variation
        sizes[i] = size * (0.5 + Math.random());
    }
    
    // Set attributes for geometry
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Create material with enhanced glow effect
    const particlesMaterial = new THREE.PointsMaterial({
        size: size,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false
    });
    
    // Load and use custom particle texture for better effect
    const textureLoader = new THREE.TextureLoader();
    particlesMaterial.map = textureLoader.load(
        'data:image/png;base64,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'
    );
    
    // Create the particle system
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    
    // Store custom properties for animation
    particleSystem.userData = {
        rotationSpeed: isBackground ? 0.0003 : 0.0008,
        baseSize: size
    };
    
    // Add to scene
    scene.add(particleSystem);
}

/**
 * Check if the device is running iOS
 */
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

/**
 * Fix iOS viewport height issues with enhanced reliability
 */
function fixIOSViewportHeight() {
    // Set a custom property with the actual viewport height
    const setVh = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    // Initial set
    setVh();
    
    // Update on resize with debounce
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setVh, 250);
    });
    
    // Update on orientation change
    window.addEventListener('orientationchange', function() {
        // Small delay to ensure orientation change is complete
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setVh, 250);
    });
    
    // Update on page load complete
    window.addEventListener('load', setVh);
    
    // Update when active tab changes
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            setVh();
        }
    });
}

/**
 * Handle window resize events with enhanced debounce
 */
window.addEventListener('resize', function() {
    // Debounce resize events for better performance
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(function() {
        // Update mobile/desktop classes
        if (window.innerWidth <= 768) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
        
        // Update iOS 100vh fix if needed
        if (isIOS()) {
            fixIOSViewportHeight();
        }
        
        // Reinitialize 3D effects if device class changes
        if (
            !document.body.classList.contains('low-end-device') && 
            !document.body.classList.contains('reduce-motion') && 
            window.innerWidth > 768
        ) {
            initialize3DEffects();
        }
    }, 250);
});

/**
 * Add keyboard navigation support
 */
window.addEventListener('keydown', function(e) {
    // Navigation with arrow keys
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        navigateToNextSection();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateToPrevSection();
    } else if (e.key === 'Home') {
        e.preventDefault();
        navigateToSection('home');
    } else if (e.key === 'End') {
        e.preventDefault();
        navigateToSection('contact');
    }
});

/**
 * Navigate to next section
 */
function navigateToNextSection() {
    const sections = Array.from(document.querySelectorAll('section[id], header[id]'));
    const currentSectionId = getCurrentSectionId();
    const currentIndex = sections.findIndex(section => section.id === currentSectionId);
    
    if (currentIndex < sections.length - 1) {
        navigateToSection(sections[currentIndex + 1].id);
    }
}

/**
 * Navigate to previous section
 */
function navigateToPrevSection() {
    const sections = Array.from(document.querySelectorAll('section[id], header[id]'));
    const currentSectionId = getCurrentSectionId();
    const currentIndex = sections.findIndex(section => section.id === currentSectionId);
    
    if (currentIndex > 0) {
        navigateToSection(sections[currentIndex - 1].id);
    }
}

/**
 * Navigate to a specific section
 */
function navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    // Calculate proper offset based on device and fixed navigation
    const navHeight = document.querySelector('nav').offsetHeight;
    const headerOffset = window.innerWidth <= 768 ? navHeight : navHeight + 20;
    const elementPosition = section.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
    // Smooth scroll to target
    window.scrollTo({
        top: offsetPosition,
        behavior: document.body.classList.contains('reduce-motion') ? 'auto' : 'smooth'
    });
    
    // Update URL without page reload
    history.pushState(null, null, `#${sectionId}`);
    
    // Update active navigation state
    updateActiveNavLink(`#${sectionId}`);
}

/**
 * Get current section ID based on scroll position
 */
function getCurrentSectionId() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const scrollPosition = window.scrollY + (window.innerHeight / 3);
    
    for (const section of sections) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            return section.id;
        }
    }
    
    // Default to first section if none found
    return sections[0]?.id || 'home';
}