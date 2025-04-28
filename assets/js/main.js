/**
 * Main JavaScript for Shaun Raj's Portfolio
 * Performance-optimized with prioritized loading
 * Complete version with all optimizations included
 */

// Wait for DOM to be loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core functionality immediately
    initializeCore();
    
    // Add load event to handle non-critical initializations
    window.addEventListener('load', function() {
        // Remove page loader
        hidePageLoader();
        
        // Initialize animations after everything is loaded
        initializeAnimations();
        
        // Set body as loaded to enable transitions and animations
        document.body.classList.remove('preload');
        document.body.classList.add('loaded');
        
        // Initialize performance monitoring (in development, can be commented out in production)
        // initializePerformanceMonitoring();
    });
    
    // Initialize 3D model with IntersectionObserver for better performance
    initializeNexbotObserver();
});

/**
 * Initialize core functionality needed immediately
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
    
    // Fix mobile layout issues immediately if on mobile
    if (window.innerWidth <= 768) {
        fixMobileLayout();
    }
    
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
    // Skip complex animations on mobile or reduced motion
    const shouldReduceMotion = 
        document.body.classList.contains('reduce-motion') ||
        document.body.classList.contains('low-end-device');
    
    // Initialize background animations
    initializeBackgroundEffects(shouldReduceMotion);
    
    // Initialize element visibility animations
    initializeVisibilityAnimations();
    
    // Initialize 3D card effects - only on capable devices
    if (!shouldReduceMotion && window.innerWidth > 768) {
        initialize3DEffects();
    }
}

/**
 * Initialize background animation effects
 */
function initializeBackgroundEffects(reduceMotion) {
    const movingSun = document.querySelector('.moving-sun');
    
    if (movingSun && !reduceMotion) {
        // For higher-end devices, add parallax effect
        window.addEventListener('scroll', function() {
            // Only run on desktop and when not reducing motion
            if (window.innerWidth <= 768 || reduceMotion) return;
            
            requestAnimationFrame(function() {
                const scrollPosition = window.scrollY;
                movingSun.style.transform = `translateY(${scrollPosition * 0.1}px) translateX(${scrollPosition * -0.05}px)`;
            });
        }, { passive: true });
    }
}

/**
 * Initialize visibility animations using IntersectionObserver
 */
function initializeVisibilityAnimations() {
    // Get elements to observe
    const elementsToAnimate = document.querySelectorAll(
        '.fade-in, .fade-up, .fade-left, .fade-right, .zoom-in, .image-reveal, .stagger-list'
    );
    
    if (elementsToAnimate.length === 0) return;
    
    // Create IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Optional: Stop observing after animation is triggered
                // observer.unobserve(entry.target);
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
 * Initialize 3D effects for cards
 */
function initialize3DEffects() {
    const cards = document.querySelectorAll('.card-3d, .project-card, .skill-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            const offsetX = ((mouseX - centerX) / (rect.width / 2)) * 5;
            const offsetY = ((mouseY - centerY) / (rect.height / 2)) * 5;
            
            card.style.transform = `perspective(1000px) rotateY(${offsetX}deg) rotateX(${-offsetY}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
        });
    });
}

/**
 * Set up observer to load NEXBOT model only when needed
 */
function initializeNexbotObserver() {
    const container = document.querySelector('.nexbot-container');
    if (!container) return;
    
    // Create an observer for the container
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Initialize model when container is visible
                initializeNexbotModel();
                // Stop observing
                observer.unobserve(container);
            }
        });
    }, {
        rootMargin: '100px 0px', // Start loading slightly before visible
        threshold: 0.1 // Trigger at 10% visibility
    });
    
    // Start observing
    observer.observe(container);
}

/**
 * Initialize NEXBOT 3D model with performance considerations
 */
function initializeNexbotModel() {
    const container = document.querySelector('.nexbot-container');
    const placeholder = document.querySelector('.nexbot-placeholder');
    
    if (!container || !placeholder) return;
    
    // Check device capability
    const isMobile = document.body.classList.contains('mobile');
    const isLowEnd = document.body.classList.contains('low-end-device');
    const prefersReducedMotion = document.body.classList.contains('reduce-motion');
    const isSaveData = document.body.classList.contains('save-data');
    
    // Skip 3D model on low-end devices, save-data mode, or reduced motion preference
    if (isLowEnd || isSaveData || prefersReducedMotion || (isMobile && navigator.hardwareConcurrency <= 4)) {
        // Use static image instead
        useStaticNexbotImage(container);
        return;
    }
    
    // For capable devices, show loading state
    const loadingElement = document.createElement('div');
    loadingElement.className = 'nexbot-loading';
    loadingElement.innerHTML = `
        <span>Loading 3D Model</span>
        <div class="loading-spinner"></div>
    `;
    container.appendChild(loadingElement);
    
    // Get model URL
    const modelUrl = placeholder.getAttribute('data-src');
    
    // Load Spline viewer only when needed
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js';
    script.onload = function() {
        // Create viewer after script is loaded
        const viewer = document.createElement('spline-viewer');
        viewer.setAttribute('url', modelUrl);
        
        // When model is loaded, remove loading indicator
        viewer.addEventListener('load', function() {
            if (loadingElement.parentNode) {
                loadingElement.remove();
            }
            // Start monitoring performance after model loads
            monitorModelPerformance(container, viewer);
        });
        
        // Handle load timeout - switch to static after 10 seconds
        const loadTimeout = setTimeout(() => {
            if (loadingElement.parentNode) {
                console.warn('3D model load timeout, switching to static image');
                useStaticNexbotImage(container);
            }
        }, 10000);
        
        // Add to container
        container.appendChild(viewer);
        placeholder.remove();
    };
    script.onerror = function() {
        console.warn('Failed to load 3D model viewer');
        // Fallback to static image
        useStaticNexbotImage(container);
    };
    
    document.body.appendChild(script);
}

/**
 * Replace container content with static NEXBOT image
 */
function useStaticNexbotImage(container) {
    // Clear container content
    container.innerHTML = '';
    
    // Add static image
    const img = document.createElement('img');
    img.src = 'assets/images/nexbot-static.png';
    img.alt = 'NEXBOT 3D Model';
    img.className = 'nexbot-static';
    container.appendChild(img);
}

/**
 * Monitor 3D model performance and replace if needed
 */
function monitorModelPerformance(container, viewer) {
    // Only run this on browsers with requestAnimationFrame
    if (!window.requestAnimationFrame) return;
    
    let lastTime = performance.now();
    let frames = 0;
    let lowFpsCount = 0;
    
    const checkFps = function() {
        const now = performance.now();
        frames++;
        
        // Calculate FPS every second
        if (now - lastTime >= 1000) {
            const fps = Math.round((frames * 1000) / (now - lastTime));
            
            // If FPS is consistently low, replace with static image
            if (fps < 24) {
                lowFpsCount++;
                
                if (lowFpsCount >= 3) {
                    console.warn('Low FPS detected with 3D model, switching to static image');
                    useStaticNexbotImage(container);
                    return; // Stop monitoring
                }
            } else {
                lowFpsCount = Math.max(0, lowFpsCount - 1); // Gradually reduce count if FPS improves
            }
            
            frames = 0;
            lastTime = now;
        }
        
        requestAnimationFrame(checkFps);
    };
    
    requestAnimationFrame(checkFps);
}

/**
 * Fix layout issues on mobile devices
 */
function fixMobileLayout() {
    // Fix NEXBOT container
    const nexbotContainer = document.querySelector('.nexbot-container');
    if (nexbotContainer) {
        // Set appropriate size based on device width
        const width = window.innerWidth <= 375 ? '240px' : '280px';
        const height = window.innerWidth <= 375 ? '300px' : '350px';
        const bottomOffset = window.innerWidth <= 375 ? '-330px' : '-380px';
        
        // Apply the styles
        nexbotContainer.style.position = 'absolute';
        nexbotContainer.style.width = width;
        nexbotContainer.style.height = height;
        nexbotContainer.style.top = 'auto';
        nexbotContainer.style.bottom = bottomOffset;
        nexbotContainer.style.left = '50%';
        nexbotContainer.style.transform = 'translateX(-50%)';
        nexbotContainer.style.right = 'auto';
    }
    
    // Fix hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.maxWidth = '100%';
        hero.style.width = '100%';
        hero.style.textAlign = 'center';
        hero.style.alignItems = 'center';
        hero.style.paddingLeft = '0';
        hero.style.marginBottom = window.innerWidth <= 375 ? '300px' : '350px';
    }
    
    // Fix hero text alignment
    const heroText = document.querySelectorAll('.hero h1, .hero h2, .hero p');
    heroText.forEach(element => {
        element.style.textAlign = 'center';
        element.style.width = '100%';
    });
    
    // Make CTA buttons full width
    const ctaButtons = document.querySelectorAll('.cta-btn');
    ctaButtons.forEach(button => {
        button.style.width = '100%';
        button.style.justifyContent = 'center';
    });
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
 * Initialize performance monitoring (for development)
 */
function initializePerformanceMonitoring() {
    if (!window.performance || !window.performance.mark) return;
    
    // Mark initial render
    window.performance.mark('initial_render');
    
    // Report after everything is loaded
    window.addEventListener('load', function() {
        window.performance.mark('fully_loaded');
        window.performance.measure('total_load_time', 'initial_render', 'fully_loaded');
        
        // Log performance metrics
        const metric = window.performance.getEntriesByName('total_load_time')[0];
        console.log(`Total load time: ${Math.round(metric.duration)}ms`);
    });
    
    // Monitor FPS if available
    if ('requestAnimationFrame' in window) {
        let lastTime = performance.now();
        let frame = 0;
        let lastFpsUpdate = 0;
        
        const reportFPS = function() {
            frame++;
            const now = performance.now();
            
            if (now - lastFpsUpdate > 1000) {
                const fps = Math.round((frame * 1000) / (now - lastFpsUpdate));
                console.log(`Current FPS: ${fps}`);
                
                // Reset
                lastFpsUpdate = now;
                frame = 0;
                
                // Alert if FPS is low
                if (fps < 30) {
                    console.warn('Low FPS detected - consider enabling reduce-motion mode');
                    document.body.classList.add('reduce-motion');
                }
            }
            
            lastTime = now;
            requestAnimationFrame(reportFPS);
        };
        
        requestAnimationFrame(reportFPS);
    }
    
    // Monitor Cumulative Layout Shift
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.hadRecentInput) continue;
                    if (entry.value > 0.1) {
                        console.warn('Layout shift detected:', entry);
                    }
                }
            });
            observer.observe({ type: 'layout-shift', buffered: true });
        } catch (e) {
            console.warn('PerformanceObserver not supported');
        }
    }
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
            fixMobileLayout();
        } else {
            document.body.classList.remove('mobile');
            
            // Reset mobile layout overrides
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.maxWidth = '';
                hero.style.width = '';
                hero.style.textAlign = '';
                hero.style.alignItems = '';
                hero.style.paddingLeft = '';
                hero.style.marginBottom = '';
            }
            
            const heroText = document.querySelectorAll('.hero h1, .hero h2, .hero p');
            heroText.forEach(element => {
                element.style.textAlign = '';
                element.style.width = '';
            });
            
            const ctaButtons = document.querySelectorAll('.cta-btn');
            ctaButtons.forEach(button => {
                button.style.width = '';
                button.style.justifyContent = '';
            });
        }
        
        // Update iOS 100vh fix if needed
        if (isIOS()) {
            fixIOSViewportHeight();
        }
    }, 250);
});