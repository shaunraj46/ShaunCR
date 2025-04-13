/**
 * Main JavaScript file for Shaun Raj's Portfolio
 * Contains initialization and general functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio website initialized');
    
    // Initialize animations, particles, and other features
    initMobileMenu();
    initParticles();
    initScrollEffects();
    initAOS();
    initNavLinks();
});

/**
 * Initialize mobile menu toggle functionality
 */
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
            
            // Check if menu is active
            const isActive = navLinks.classList.contains('active');
            
            // Adjust toggle button appearance
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
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.mobile-menu-toggle') && !event.target.closest('.nav-links') && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
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
                
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (mobileMenuToggle) {
                        mobileMenuToggle.classList.remove('active');
                        
                        const spans = mobileMenuToggle.querySelectorAll('span');
                        spans[0].style.transform = 'none';
                        spans[1].style.opacity = '1';
                        spans[2].style.transform = 'none';
                    }
                }
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 100, // 100px offset to account for fixed header
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
        // Disable animations on mobile for better performance
        if (window.innerWidth < 768) {
            AOS.init({
                disable: true
            });
            return;
        }
        
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: window.innerWidth < 992, // Set to once on tablets for better performance
            mirror: window.innerWidth >= 992,
            offset: 100
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
});