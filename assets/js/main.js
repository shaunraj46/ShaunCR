/**
 * Main JavaScript for Shaun Raj's Portfolio 2.0
 * Implements Three.js background effect, animations and interactions
 * Enhanced with mobile and tablet optimizations
 */

// Wait for DOM to be loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    // Fix hero visibility immediately
    fixHeroVisibility();
    
    // Initialize core functionality immediately
    initializeCore();
    
    // Add enhanced mobile detection
    enhancedDeviceDetection();
    
    // Add enhanced touch experience for mobile
    enhancedTouchExperience();
    
    // Handle orientation changes
    handleOrientationChanges();
    
    // Optimize for slow connections
    optimizeForSlowConnections();
    
    // Initialize Three.js scene with mobile optimizations
    initThreeJsScene();
    
    // Force a redraw of Three.js scene for mobile
    if (window.innerWidth <= 768) {
        // Re-init Three.js specifically for mobile
        setTimeout(function() {
            initThreeJsScene();
        }, 100);
    }
    
    // Add load event to handle post-loading initialization
    window.addEventListener('load', function() {
        // Remove page loader
        hidePageLoader();
        
        // Initialize animations
        initializeAnimations();
        
        // Set body as loaded to enable transitions and animations
        document.body.classList.remove('preload');
        document.body.classList.add('loaded');
        
        // Check visibility again after full load
        setTimeout(function() {
            fixHeroVisibility();
        }, 200);
    });
});

/**
 * Fix hero visibility issues
 */
function fixHeroVisibility() {
    // Ensure hero section is visible
    const hero = document.querySelector('.hero');
    if (hero) {
        // Force visibility
        hero.style.visibility = 'visible';
        hero.style.opacity = '1';
        hero.style.zIndex = '10';
        
        // Ensure text is visible
        const heroElements = hero.querySelectorAll('h1, h2, p, .cta-btn');
        heroElements.forEach(el => {
            el.style.visibility = 'visible';
            el.style.opacity = '1';
            el.style.position = 'relative';
            el.style.zIndex = '10';
        });
    }
    
    // Check if scene container exists and is properly positioned
    const sceneContainer = document.querySelector('.scene-container');
    if (sceneContainer) {
        // Ensure it's properly positioned and sized
        sceneContainer.style.position = window.innerWidth <= 768 ? 'fixed' : 'absolute';
        sceneContainer.style.width = '100%';
        sceneContainer.style.height = '100%';
        sceneContainer.style.top = '0';
        sceneContainer.style.left = '0';
        sceneContainer.style.zIndex = '1'; // Behind content
        sceneContainer.style.overflow = 'hidden';
        sceneContainer.style.pointerEvents = 'none'; // Don't interfere with clicks
    }
}

/**
 * Initialize core functionality
 */
function initializeCore() {
    // Check device capability and set appropriate classes
    detectDeviceCapabilities();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Set up smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize scroll progress indicator
    initializeScrollProgress();
    
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
    
    // Check if low-end device (limited CPU cores)
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
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
}

/**
 * Initialize mobile menu functionality
 */
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuToggle || !navLinks) return;
    
    // Toggle menu on button click
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
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
}

/**
 * Initialize smooth scrolling for anchor links
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
                // Calculate proper offset based on device
                const headerOffset = window.innerWidth <= 768 ? 60 : 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize scroll progress indicator
 */
function initializeScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;
    
    // Use passive scroll listener for better performance
    window.addEventListener('scroll', function() {
        // Use requestAnimationFrame to optimize updates
        requestAnimationFrame(function() {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / scrollHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }, { passive: true });
}

/**
 * Hide page loader with animation
 */
function hidePageLoader() {
    const loader = document.querySelector('.page-loader');
    if (!loader) return;
    
    loader.classList.add('loader-hidden');
    
    // Remove from DOM after animation completes
    loader.addEventListener('transitionend', function() {
        if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
        }
    });
}

/**
 * Initialize animations using IntersectionObserver
 */
function initializeAnimations() {
    // Skip complex animations if reduced motion is preferred
    if (document.body.classList.contains('reduce-motion')) return;
    
    // Initialize element visibility animations
    initializeVisibilityAnimations();
    
    // Initialize 3D card effects - only on capable devices
    if (!document.body.classList.contains('low-end-device') && window.innerWidth > 768) {
        initialize3DEffects();
    }
}

/**
 * Initialize visibility animations using IntersectionObserver
 */
function initializeVisibilityAnimations() {
    // Get elements to observe
    const elementsToAnimate = document.querySelectorAll(
        '.image-reveal, .glass-card'
    );
    
    if (elementsToAnimate.length === 0) return;
    
    // Create IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Stop observing after animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all elements
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Initialize 3D card hover effects
 */
function initialize3DEffects() {
    const cards = document.querySelectorAll('.glass-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            // Skip on mobile or reduced motion
            if (window.innerWidth <= 768 || document.body.classList.contains('reduce-motion')) return;
            
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            const offsetX = ((mouseX - centerX) / (rect.width / 2)) * 5;
            const offsetY = ((mouseY - centerY) / (rect.height / 2)) * 5;
            
            card.style.transform = `perspective(1000px) rotateY(${offsetX}deg) rotateX(${-offsetY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                card.style.transform = '';
            }, 100);
        });
    });
}

/**
 * Enhanced Three.js initialization for mobile
 */
function initThreeJsScene() {
    // Get container
    const container = document.querySelector('.scene-container');
    if (!container) return;

    // Clear any existing content
    container.innerHTML = '';

    // Set up Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        antialias: window.innerWidth > 768, // Disable antialiasing on mobile for performance
        alpha: true 
    });
    
    // Configure renderer for mobile
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Ensure canvas is visible and covers the screen
    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1';
    canvas.style.pointerEvents = 'none'; // Make it non-interactive
    
    // Camera position
    camera.position.z = 5;
    
    // Create particles - reduced for mobile
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = window.innerWidth < 768 ? 800 : 2000; // Reduced on mobile
    
    const positionArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);
    
    // Fill position and color arrays
    for (let i = 0; i < particleCount * 3; i += 3) {
        // Positions - create a sphere distribution
        const radius = Math.random() * 10 + 5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        positionArray[i] = radius * Math.sin(phi) * Math.cos(theta);
        positionArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positionArray[i + 2] = radius * Math.cos(phi);
        
        // Colors - purple and blue gradient - simplified for mobile
        const hue = Math.random() * 0.1 + 0.7; // 0.7-0.8 range for purple/blue
        const saturation = Math.random() * 0.3 + 0.7; // 0.7-1.0
        const lightness = Math.random() * 0.2 + 0.5; // 0.5-0.7
        
        const color = new THREE.Color();
        color.setHSL(hue, saturation, lightness);
        
        colorArray[i] = color.r;
        colorArray[i + 1] = color.g;
        colorArray[i + 2] = color.b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    // Create material - optimized for mobile
    const particlesMaterial = new THREE.PointsMaterial({
        size: window.innerWidth < 768 ? 0.04 : 0.05, // Slightly larger on mobile for visibility
        vertexColors: true,
        transparent: true,
        opacity: window.innerWidth < 768 ? 0.7 : 0.6, // More visible on mobile
        blending: THREE.AdditiveBlending
    });
    
    // Create mesh
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Simpler animation for mobile
    let lastTime = 0;
    const rotationSpeed = window.innerWidth < 768 ? 0.0003 : 0.0001; // Faster on mobile for better effect
    
    // Animation loop
    function animate(time) {
        requestAnimationFrame(animate);
        
        // Simple constant rotation - more optimized for mobile
        particles.rotation.y += rotationSpeed * (time - lastTime);
        particles.rotation.z += rotationSpeed * 0.5 * (time - lastTime);
        
        lastTime = time;
        
        renderer.render(scene, camera);
    }
    
    // Simplified resize handler for better performance
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, { passive: true });
    
    // Start animation
    animate(0);
    
    // Log success for debugging
    console.log('Three.js scene initialized');
}

/**
 * Check if the device is running iOS
 */
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

/**
 * Fix iOS viewport height issues
 */
function fixIOSViewportHeight() {
    // Set a custom property with the actual viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Update on resize and orientation change
    window.addEventListener('resize', function() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
    
    window.addEventListener('orientationchange', function() {
        // Small delay to ensure orientation change is complete
        setTimeout(function() {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }, 100);
    });
}

/**
 * Handle window resize events
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
        
        // Check visibility again
        fixHeroVisibility();
    }, 250);
});

/**
 * Improve detection of device capabilities
 */
function enhancedDeviceDetection() {
    // Detect tablet specifically
    if (window.innerWidth >= 768 && window.innerWidth <= 1024) {
        document.body.classList.add('tablet');
    }
    
    // Detect orientation
    if (window.innerHeight > window.innerWidth) {
        document.body.classList.add('portrait');
    } else {
        document.body.classList.add('landscape');
    }
    
    // Check device memory (if available)
    if (navigator.deviceMemory) {
        if (navigator.deviceMemory <= 4) {
            document.body.classList.add('low-memory-device');
        }
    }
    
    // Better detection for older devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
        document.body.classList.add('very-low-end-device');
    }
    
    // Detect connection type if available
    if (navigator.connection) {
        if (navigator.connection.effectiveType === '2g' || 
            navigator.connection.effectiveType === 'slow-2g') {
            document.body.classList.add('slow-connection');
        }
    }
}

/**
 * Enhanced mobile touch experience
 */
function enhancedTouchExperience() {
    // Skip if not a touch device
    if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) return;
    
    // Add active state to touchable elements
    const touchElements = document.querySelectorAll('a, button, .cta-btn, .project-card, .skill-card');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        }, { passive: true });
        
        element.addEventListener('touchcancel', function() {
            this.classList.remove('touch-active');
        }, { passive: true });
    });
    
    // Fix 300ms touch delay on mobile browsers
    document.documentElement.style.touchAction = 'manipulation';
}

/**
 * Optimize content loading for slow connections
 */
function optimizeForSlowConnections() {
    // Check if we're on a slow connection
    const isSlowConnection = document.body.classList.contains('slow-connection') ||
                             document.body.classList.contains('save-data');
    
    if (isSlowConnection) {
        // Lazy load images further down the page with low priority
        const lowerPriorityImages = document.querySelectorAll('.startup-img img, .formula-img img, .leadership-img img');
        lowerPriorityImages.forEach(img => {
            img.loading = 'lazy';
            img.decoding = 'async';
            
            // If srcset is already set up, we'll insert a small placeholder first
            if (img.srcset) {
                const originalSrc = img.src;
                const originalSrcset = img.srcset;
                
                // Set to placeholder temporarily (could be a tiny image or data URI in production)
                img.src = 'assets/images/placeholder.jpg';
                img.srcset = '';
                
                // Restore actual image after page becomes interactive
                window.addEventListener('DOMContentLoaded', () => {
                    setTimeout(() => {
                        img.src = originalSrc;
                        img.srcset = originalSrcset;
                    }, 1000); // Delay loading of lower priority images
                });
            }
        });
        
        // Potentially disable animations for very slow connections
        if (navigator.connection && 
            (navigator.connection.effectiveType === 'slow-2g' || navigator.connection.saveData)) {
            document.body.classList.add('reduce-motion');
        }
    }
}

/**
 * Handle orientation changes effectively
 */
function handleOrientationChanges() {
    // Initial orientation class
    if (window.innerHeight > window.innerWidth) {
        document.body.classList.add('portrait');
        document.body.classList.remove('landscape');
    } else {
        document.body.classList.add('landscape');
        document.body.classList.remove('portrait');
    }
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', function() {
        // Small delay to ensure dimensions have updated
        setTimeout(() => {
            if (window.innerHeight > window.innerWidth) {
                document.body.classList.add('portrait');
                document.body.classList.remove('landscape');
            } else {
                document.body.classList.add('landscape');
                document.body.classList.remove('portrait');
            }
            
            // Refresh any layout that needs updating
            updateLayoutForOrientation();
            
            // Check visibility again after orientation change
            fixHeroVisibility();
        }, 200);
    });
}

/**
 * Update layout elements when orientation changes
 */
function updateLayoutForOrientation() {
    // Fix hero height on orientation change
    const hero = document.querySelector('.hero');
    if (hero) {
        if (document.body.classList.contains('landscape') && window.innerWidth < 1024) {
            hero.style.minHeight = '70vh';
        } else {
            hero.style.minHeight = '';
        }
    }
    
    // Fix any iOS-specific issues again after orientation change
    if (isIOS()) {
        fixIOSViewportHeight();
    }
}