/**
 * Main JavaScript file for Shaun Raj's Portfolio
 * Contains initialization and general functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio website initialized');
    
    // Initialize mobile-specific functionality
    initMobileDetection();
    initMobileMenu();
    
    // Initialize animations, particles, and other features
    initParticles();
    initScrollEffects();
    initAOS();
    initNavLinks();
    
    // Fix for 100vh on mobile browsers
    setVhProperty();
    window.addEventListener('resize', setVhProperty);
    window.addEventListener('orientationchange', setVhProperty);
});

/**
 * Detect mobile devices and apply specific optimizations
 */
function initMobileDetection() {
    const isMobile = window.innerWidth < 768 || 
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Add mobile class to body for CSS targeting
        document.body.classList.add('is-mobile');
        
        // Reduce animations for better performance
        document.body.classList.add('reduce-motion');
        
        // Enable passive event listeners for better scrolling
        const wheelOpt = { passive: true };
        const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
        
        // Use passive listeners to improve scrolling performance
        window.addEventListener('touchstart', function(){}, wheelOpt);
        window.addEventListener('touchmove', function(){}, wheelOpt);
        window.addEventListener(wheelEvent, function(){}, wheelOpt);
    }
    
    // Handle orientation changes
    window.addEventListener('orientationchange', handleOrientationChange);
}

/**
 * Handle device orientation changes
 */
function handleOrientationChange() {
    // Refresh AOS animations on orientation change
    if (typeof AOS !== 'undefined') {
        setTimeout(function() {
            AOS.refresh();
        }, 300);
    }
    
    // Fix viewport height issue on orientation change
    setVhProperty();
    
    // Adjust NEXBOT container on orientation change
    adjustNexbotContainer();
}

/**
 * Set viewport height property for mobile browsers
 */
function setVhProperty() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

/**
 * Initialize mobile menu toggle functionality
 */
function initMobileMenu() {
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
                spans[0].style.transform = 'translateY(8px) rotate(45deg)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking on a nav link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                body.classList.remove('menu-open');
                
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
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
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

/**
 * Adjust the NEXBOT container size based on screen size
 */
function adjustNexbotContainer() {
    const nexbotContainer = document.querySelector('.nexbot-container');
    
    if (nexbotContainer) {
        if (window.innerWidth <= 375) {
            nexbotContainer.style.width = '250px';
            nexbotContainer.style.height = '300px';
        } else if (window.innerWidth <= 576) {
            nexbotContainer.style.width = '300px';
            nexbotContainer.style.height = '350px';
        } else if (window.innerWidth <= 768) {
            nexbotContainer.style.width = '350px';
            nexbotContainer.style.height = '400px';
        }
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
                        spans[0].style.transform = 'none';
                        spans[1].style.opacity = '1';
                        spans[2].style.transform = 'none';
                    }
                }
                
                // Smooth scroll to target with offset for header
                const headerOffset = window.innerWidth < 768 ? 70 : 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
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
        const isMobile = window.innerWidth < 768;
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
    const isMobile = window.innerWidth < 768;
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollPercentage = scrollPosition / maxScroll;
        
        // Store scroll percentage as CSS variable for use in animations
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
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop - 300) {
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
 * Add 3D tilt effect to specified elements
 * 
 * @param {string} selector - CSS selector for elements to apply effect to
 * @param {number} intensity - Effect intensity (default: 10)
 */
function apply3DTiltEffect(selector, intensity = 10) {
    // Skip on mobile
    if (window.innerWidth <= 768) return;
    
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

/**
 * Apply glitch text effect to element
 * 
 * @param {string} selector - CSS selector for element
 */
function applyGlitchEffect(selector) {
    const element = document.querySelector(selector);
    
    if (element) {
        const text = element.textContent;
        element.setAttribute('data-text', text);
        element.classList.add('glitch');
    }
}

// Apply 3D tilt effect to project cards on desktop
if (window.innerWidth > 768) {
    apply3DTiltEffect('.project-card', 5);
    apply3DTiltEffect('.skill-card', 3);
}

// Handle page resize
window.addEventListener('resize', function() {
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
    
    // Update viewport height on resize
    setVhProperty();
    
    // Adjust NEXBOT container on resize
    adjustNexbotContainer();
});

// Mark body as loaded when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('loaded');
});

// Initialize on load
window.addEventListener('load', function() {
    // Remove page loader if exists
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.classList.add('loader-hidden');
        
        loader.addEventListener('transitionend', function() {
            loader.remove();
        });
    }
    
    // Add performance class to body to control CSS animations
    if (window.innerWidth < 768 || navigator.hardwareConcurrency <= 4) {
        document.body.classList.add('reduce-motion');
    }
    
    // Adjust NEXBOT container on load
    adjustNexbotContainer();
});