/**
 * Animations.js
 * Handles scroll animations and advanced UI effects
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize 3D card effects
    init3DCardEffects();
    
    // Initialize text animations
    initTextAnimations();
    
    // Initialize parallax effects
    initParallax();
});

/**
 * Initialize scroll-based animations
 */
function initScrollAnimations() {
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Intersection Observer configuration
    const options = {
        root: null, // use viewport
        rootMargin: '0px',
        threshold: 0.1
    };
    
    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Optional: unobserve after animation
                // observer.unobserve(entry.target);
            } else {
                // Optional: remove class when out of view for repeated animations
                if (!entry.target.dataset.animateOnce) {
                    entry.target.classList.remove('visible');
                }
            }
        });
    }, options);
    
    // Observe elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Skill bar animation (for future use)
    animateSkillBars();
}

/**
 * Animate skill bars when in view
 */
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    if (skillBars.length === 0) return;
    
    const options = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.progress');
                const targetWidth = entry.target.dataset.progress || '75%';
                
                // Animate progress bar
                setTimeout(() => {
                    progressBar.style.width = targetWidth;
                }, 200);
                
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

/**
 * Initialize 3D card tilt effects
 */
function init3DCardEffects() {
    // Project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Skip on mobile
        if (window.innerWidth <= 768) return;
        
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            // Limit rotation angle
            const maxRotation = 5;
            const rotateX = deltaY * -maxRotation;
            const rotateY = deltaX * maxRotation;
            
            // Apply transform
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // Add highlight effect
            const glare = card.querySelector('.card-glare') || createGlareElement(card);
            const glareOpacity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * 0.1;
            glare.style.opacity = glareOpacity;
            
            const glareX = 50 + deltaX * 100;
            const glareY = 50 + deltaY * 100;
            glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)`;
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset transform
            card.style.transform = 'none';
            
            // Hide glare
            const glare = card.querySelector('.card-glare');
            if (glare) glare.style.opacity = '0';
        });
    });
}

/**
 * Create glare element for 3D card effect
 */
function createGlareElement(parent) {
    const glare = document.createElement('div');
    glare.classList.add('card-glare');
    glare.style.position = 'absolute';
    glare.style.top = '0';
    glare.style.left = '0';
    glare.style.width = '100%';
    glare.style.height = '100%';
    glare.style.borderRadius = 'inherit';
    glare.style.opacity = '0';
    glare.style.pointerEvents = 'none';
    glare.style.zIndex = '1';
    glare.style.transition = 'opacity 0.3s ease';
    
    parent.appendChild(glare);
    return glare;
}

/**
 * Initialize text animation effects
 */
function initTextAnimations() {
    // Animated typing effect
    const typingElements = document.querySelectorAll('[data-typing]');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        let currentIndex = 0;
        const typingSpeed = parseInt(element.dataset.typingSpeed) || 100;
        const initialDelay = parseInt(element.dataset.typingDelay) || 0;
        
        setTimeout(() => {
            const typingInterval = setInterval(() => {
                if (currentIndex < text.length) {
                    element.textContent += text.charAt(currentIndex);
                    currentIndex++;
                } else {
                    clearInterval(typingInterval);
                    
                    // Add cursor blink effect
                    if (element.dataset.cursor === 'true') {
                        const cursor = document.createElement('span');
                        cursor.classList.add('typing-cursor');
                        cursor.textContent = '|';
                        cursor.style.animation = 'blink 1s infinite';
                        element.appendChild(cursor);
                    }
                }
            }, typingSpeed);
        }, initialDelay);
    });
    
    // Split text into characters for advanced animations
    const charAnimElements = document.querySelectorAll('[data-char-anim]');
    
    charAnimElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        // Create spans for each character
        for (let i = 0; i < text.length; i++) {
            const char = text.charAt(i);
            const span = document.createElement('span');
            
            span.textContent = char;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.transition = 'all 0.3s ease';
            span.style.transitionDelay = `${i * 0.05}s`;
            
            element.appendChild(span);
        }
        
        // Animate when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const spans = entry.target.querySelectorAll('span');
                    
                    spans.forEach(span => {
                        span.style.opacity = '1';
                        span.style.transform = 'translateY(0)';
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(element);
    });
}

/**
 * Initialize parallax scrolling effects
 */
function initParallax() {
    // Elements with parallax effect
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.1;
            const offset = scrollY * speed;
            
            element.style.transform = `translateY(${offset}px)`;
        });
    });
    
    // Background parallax effect
    document.addEventListener('mousemove', e => {
        // Only on desktop
        if (window.innerWidth <= 768) return;
        
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const movingElements = document.querySelectorAll('[data-parallax-mouse]');
        
        movingElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallaxMouse) || 30;
            const x = (0.5 - mouseX) * speed;
            const y = (0.5 - mouseY) * speed;
            
            element.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

/**
 * Animation for counter numbers
 * @param {string} selector - Elements to animate
 * @param {number} duration - Animation duration in ms
 */
function animateCounters(selector, duration = 2000) {
    const counters = document.querySelectorAll(selector);
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start counter when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

/**
 * Initialize smooth scroll behavior
 */
function initSmoothScroll() {
    // Smooth scroll to section when clicking nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip if just "#"
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Account for header
                behavior: 'smooth'
            });
        });
    });
}

// Initialize smooth scroll
initSmoothScroll();

// Initialize counters if needed
// animateCounters('.counter-element');

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
});