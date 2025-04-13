/**
 * Main JavaScript file for Shaun Raj's Portfolio
 * Contains initialization and general functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio website initialized');
    
    // Initialize mobile-specific functionality first
    setupMobileDetection();
    setupMobileMenu();
    fixViewportHeight();
    
    // Initialize animations, particles, and other features
    initParticles();
    initScrollEffects();
    initAOS();
    initNavLinks();
});

/**
 * Check if the current device is mobile
 */
function isMobileDevice() {
    return window.innerWidth < 768 || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Set up mobile-specific adjustments
 */
function setupMobileDetection() {
    if (isMobileDevice()) {
        // Add mobile class to body for CSS targeting
        document.body.classList.add('mobile-device');
        
        // Reduce animations for mobile performance
        document.body.classList.add('reduce-motion');
        
        // Fix positioning for mobile
        adjustMobileLayout();
        
        // Enable passive event listeners for better scrolling
        const wheelOpt = { passive: true };
        const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
        
        window.addEventListener('touchstart', function(){}, wheelOpt);
        window.addEventListener('touchmove', function(){}, wheelOpt);
        window.addEventListener(wheelEvent, function(){}, wheelOpt);
    }
    
    // Handle window resize events
    window.addEventListener('resize', function() {
        fixViewportHeight();
        adjustMobileLayout();
    });
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        fixViewportHeight();
        adjustMobileLayout();
        
        // Small delay to ensure orientation change is complete
        setTimeout(function() {
            fixViewportHeight();
            adjustMobileLayout();
        }, 300);
    });
}

/**
 * Fix viewport height issues on mobile
 */
function fixViewportHeight() {
    // Fix for mobile browsers (especially iOS Safari)
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Force header height
    const header = document.querySelector('header');
    if (header) {
        if (isMobileDevice()) {
            header.style.height = `${window.innerHeight}px`;
        } else {
            header.style.height = '100vh';
        }
    }
}

/**
 * Adjust layout specifically for mobile
 */
function adjustMobileLayout() {
    if (isMobileDevice()) {
        // Adjust NEXBOT container
        const nexbotContainer = document.querySelector('.nexbot-container');
        if (nexbotContainer) {
            if (window.innerWidth <= 375) {
                nexbotContainer.style.width = '240px';
                nexbotContainer.style.height = '300px';
                nexbotContainer.style.bottom = '-330px';
            } else {
                nexbotContainer.style.width = '280px';
                nexbotContainer.style.height = '350px';
                nexbotContainer.style.bottom = '-380px';
            }
            
            // Ensure absolute positioning
            nexbotContainer.style.position = 'absolute';
            nexbotContainer.style.left = '50%';
            nexbotContainer.style.transform = 'translateX(-50%)';
            nexbotContainer.style.top = 'auto';
            nexbotContainer.style.zIndex = '1';
        }
        
        // Adjust hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.maxWidth = '100%';
            hero.style.width = '100%';
            hero.style.textAlign = 'center';
            hero.style.zIndex = '2';
            
            if (window.innerWidth <= 375) {
                hero.style.marginBottom = '300px';
            } else {
                hero.style.marginBottom = '350px';
            }
        }
        
        // Center align text on mobile
        const heroHeadings = document.querySelectorAll('.hero h1, .hero h2, .hero p');
        heroHeadings.forEach(element => {
            element.style.textAlign = 'center';
            element.style.width = '100%';
        });
        
        // Make buttons full width
        const ctaButtons = document.querySelectorAll('.cta-btn');
        ctaButtons.forEach(button => {
            button.style.width = '100%';
            button.style.justifyContent = 'center';
        });
    }
}

/**
 * Initialize mobile menu toggle functionality
 */
function setupMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
            
            // Prevent body scrolling when menu is open
            body.classList.toggle('menu-open');
            
            // Check if menu is active
            const isActive = navLinks.classList.contains('active');
            
            // Toggle menu icon animation
            const spans = this.querySelectorAll('span');
            if (isActive) {
                // X shape for close
                spans[0].style.transform = 'translateY(8px) rotate(45deg)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
            } else {
                // Bars for open
                spans[0].style.transform = 'translateY(0) rotate(0)';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'translateY(0) rotate(0)';
            }
        });
        
        // Close menu when clicking on a nav link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                // Close mobile menu
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                body.classList.remove('menu-open');
                
                // Reset toggle icon
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'translateY(0) rotate(0)';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'translateY(0) rotate(0)';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.mobile-menu-toggle') && 
                !event.target.closest('.nav-links') && 
                navLinks.classList.contains('active')) {
                
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                body.classList.remove('menu-open');
                
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'translateY(0) rotate(0)';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'translateY(0) rotate(0)';
            }
        });
    }
}

/**
 * Initialize navigation link smooth scrolling
 */
function initNavLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't scroll if it's just a regular link without an anchor
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
                const body = document.body;
                
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    body.classList.remove('menu-open');
                    
                    if (mobileMenuToggle) {
                        mobileMenuToggle.classList.remove('active');
                        
                        const spans = mobileMenuToggle.querySelectorAll('span');
                        spans[0].style.transform = 'translateY(0) rotate(0)';
                        spans[1].style.opacity = '1';
                        spans[2].style.transform = 'translateY(0) rotate(0)';
                    }
                }
                
                // Calculate proper offset based on device
                const headerOffset = isMobileDevice() ? 60 : 100;
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
 * Initialize AOS (Animate On Scroll) library
 */
function initAOS() {
    // Check if AOS is available
    if (typeof AOS !== 'undefined') {
        // Get device type
        const isMobile = isMobileDevice();
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 992;
        
        // Configure AOS based on device type
        AOS.init({
            // Disable on mobile for better performance
            disable: isMobile,
            // Shorter durations on tablets
            duration: isTablet ? 600 : 800,
            // Only animate once on mobile and tablets
            once: isMobile || isTablet,
            // No mirror effect on mobile or tablet
            mirror: !isMobile && !isTablet,
            // Smaller offset on mobile
            offset: isMobile ? 50 : 100
        });
    }
}

/**
 * Initialize scroll effects (parallax, etc.)
 */
function initScrollEffects() {
    // Skip heavy scroll effects on mobile
    const isMobile = isMobileDevice();
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // Store scroll percentage as CSS variable for use in animations
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollPercentage = scrollPosition / maxScroll;
        document.body.style.setProperty('--scroll-percentage', scrollPercentage);
        
        // Parallax effect on moving sun - skip on mobile
        if (!isMobile) {
            const movingSun = document.querySelector('.moving-sun');
            if (movingSun) {
                movingSun.style.transform = `translateY(${scrollPosition * 0.2}px) translateX(${scrollPosition * -0.1}px)`;
            }
        }
        
        // Active section detection for navigation
        highlightActiveSection();
    });
}

/**
 * Highlight the active section in navigation
 */
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize particle system
 * This function is defined in particles.js
 * Included here as a reference
 */
function initParticles() {
    // This function is defined in particles.js
    // We're just referencing it here
    if (typeof window.initParticles === 'function') {
        window.initParticles();
    } else {
        console.log('Particles initialization function not found');
    }
}

/**
 * Add 3D tilt effect to specified elements
 * Only on desktop devices
 * 
 * @param {string} selector - CSS selector for elements to apply effect to
 * @param {number} intensity - Effect intensity (default: 10)
 */
function apply3DTiltEffect(selector, intensity = 10) {
    // Skip on mobile
    if (isMobileDevice()) return;
    
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
        element.addEventListener('mousemove', e => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = x / rect.width;
            const yPercent = y / rect.height;
            
            const xRotation = (0.5 - yPercent) * intensity;
            const yRotation = (xPercent - 0.5) * intensity;
            
            element.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

// Apply 3D tilt effect to project cards on desktop
if (!isMobileDevice()) {
    window.addEventListener('load', function() {
        apply3DTiltEffect('.project-card', 5);
        apply3DTiltEffect('.skill-card', 3);
    });
}

// Handle page resize
window.addEventListener('resize', function() {
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
    
    // Update viewport height on resize
    fixViewportHeight();
    
    // Adjust layout on resize
    adjustMobileLayout();
});

// Initialize on load
window.addEventListener('load', function() {
    // Mark body as loaded
    document.body.classList.add('loaded');
    
    // Remove page loader if exists
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.classList.add('loader-hidden');
        
        setTimeout(function() {
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, 500);
    }
    
    // Add performance class to body to control CSS animations
    if (isMobileDevice() || navigator.hardwareConcurrency <= 4) {
        document.body.classList.add('reduce-motion');
    }
    
    // Force layout adjustments again after full load
    adjustMobileLayout();
    fixViewportHeight();
});