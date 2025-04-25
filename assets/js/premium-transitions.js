/**
 * premium-effects.js
 * Add this file to your project and include it in your HTML
 */

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP animations
    initGsapAnimations();
    
    // Initialize cursor effects
    initCursorEffects();
    
    // Initialize magnetic elements
    initMagneticElements();
    
    // Add page transition effects
    initPageTransitions();
    
    // Add parallax effects
    initParallaxEffects();
  });
  
  /**
   * Initialize GSAP animations for premium reveal effects
   */
  function initGsapAnimations() {
    // Make sure GSAP is loaded
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not loaded. Add this to your HTML: <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>');
      return;
    }
    
    // Add ScrollTrigger plugin if available
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    
    // Hero section text reveal animation
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
      // Split text into individual characters
      const chars = [...heroTitle.textContent];
      heroTitle.innerHTML = '';
      
      // Create spans for each character
      chars.forEach(char => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char; // Use non-breaking space for spaces
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        heroTitle.appendChild(span);
      });
      
      // Animate each character with staggered timing
      gsap.to(heroTitle.children, {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.5
      });
    }
    
    // Staggered reveal for project cards
    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length && typeof ScrollTrigger !== 'undefined') {
      gsap.from(projectCards, {
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: '.projects-grid',
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });
    }
    
    // Skill cards reveal
    const skillCards = document.querySelectorAll('.skill-card');
    if (skillCards.length && typeof ScrollTrigger !== 'undefined') {
      gsap.from(skillCards, {
        scale: 0.8,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: '.skills-container',
          start: "top 75%",
          toggleActions: "play none none none"
        }
      });
    }
    
    // Section title animations
    const sectionTitles = document.querySelectorAll('.section-title h2');
    sectionTitles.forEach(title => {
      if (typeof ScrollTrigger !== 'undefined') {
        // Split the text if needed
        const splitText = title.textContent.split('');
        title.innerHTML = '';
        
        // Create wrapper for line animation
        const wrapper = document.createElement('span');
        wrapper.style.display = 'block';
        wrapper.style.overflow = 'hidden';
        title.parentNode.appendChild(wrapper);
        wrapper.appendChild(title);
        
        // Add each character in spans
        splitText.forEach(char => {
          const span = document.createElement('span');
          span.textContent = char === ' ' ? '\u00A0' : char;
          span.style.display = 'inline-block';
          title.appendChild(span);
        });
        
        // Animate each character with staggered timing
        gsap.from(title.children, {
          y: 100,
          opacity: 0,
          stagger: 0.03,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapper,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        });
      }
    });
    
    // Smooth section background parallax
    if (typeof ScrollTrigger !== 'undefined') {
      // Select all sections with background effects
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
        // Create parallax effect for section backgrounds
        gsap.to(section, {
          backgroundPositionY: "30%",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });
    }
  }
  
  /**
   * Initialize custom cursor effects
   */
  function initCursorEffects() {
    // Skip on mobile devices
    if (window.innerWidth <= 768) return;
    
    // Create custom cursor elements
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    
    const cursorCircle = document.createElement('div');
    cursorCircle.className = 'cursor-circle';
    
    cursor.appendChild(cursorDot);
    cursor.appendChild(cursorCircle);
    document.body.appendChild(cursor);
    
    // Add cursor styles
    const style = document.createElement('style');
    style.textContent = `
      .custom-cursor {
        pointer-events: none;
        position: fixed;
        z-index: 9999;
        mix-blend-mode: difference;
      }
      
      .cursor-dot {
        position: absolute;
        top: 0;
        left: 0;
        width: 8px;
        height: 8px;
        background-color: white;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: opacity 0.2s ease-in-out;
      }
      
      .cursor-circle {
        position: absolute;
        top: 0;
        left: 0;
        width: 40px;
        height: 40px;
        border: 2px solid rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(1);
        transition: transform 0.3s ease-out, opacity 0.2s ease-in-out;
      }
      
      .link-hover .cursor-circle {
        transform: translate(-50%, -50%) scale(1.5);
        background-color: rgba(255, 255, 255, 0.1);
      }
      
      /* Hide default cursor */
      body:hover {
        cursor: none;
      }
      
      /* Ensure cursor is hidden on touch devices */
      @media (pointer: coarse) {
        .custom-cursor {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Track mouse movement
    document.addEventListener('mousemove', e => {
      // Move the dot to cursor position immediately
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
      
      // Move the circle with slight delay for trailing effect
      gsap.to(cursorCircle, {
        duration: 0.3,
        left: e.clientX,
        top: e.clientY
      });
    });
    
    // Add hover effect for links and interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .cta-btn, .project-card, .skill-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('link-hover');
      });
      
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('link-hover');
      });
    });
    
    // Handle cursor visibility when leaving/entering window
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });
  }
  
  /**
   * Initialize magnetic effect for interactive elements
   */
  function initMagneticElements() {
    // Skip on mobile devices
    if (window.innerWidth <= 768) return;
    
    // Elements that will have magnetic effect
    const magneticElements = document.querySelectorAll('.cta-btn, .social-link, .contact-icon');
    
    magneticElements.forEach(element => {
      element.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        
        // Calculate distance from center (0-1)
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        const maxDistance = Math.sqrt((rect.width / 2) * (rect.width / 2) + (rect.height / 2) * (rect.height / 2));
        
        // Calculate movement strength based on distance from center
        const strength = 20; // Max movement in pixels
        const movementX = (distanceX / maxDistance) * strength;
        const movementY = (distanceY / maxDistance) * strength;
        
        // Apply transform with gsap for smoother movement
        gsap.to(this, {
          x: movementX,
          y: movementY,
          duration: 0.3,
          ease: "power2.out"
        });
      });
      
      element.addEventListener('mouseleave', function() {
        // Return to original position
        gsap.to(this, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.3)"
        });
      });
    });
  }
  
  /**
   * Initialize page transition effects
   */
  function initPageTransitions() {
    // Add transition overlay
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);
    
    // Add transition styles
    const style = document.createElement('style');
    style.textContent = `
      .page-transition-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--secondary-dark);
        transform: translateY(100%);
        z-index: 9999;
        pointer-events: none;
      }
      
      /* Initial state for page elements */
      .page-transition-init .hero h1,
      .page-transition-init .hero h2,
      .page-transition-init .hero p,
      .page-transition-init .cta-btn,
      .page-transition-init .nav-links a {
        opacity: 0;
        transform: translateY(20px);
      }
    `;
    document.head.appendChild(style);
    
    // Add initial class to enable transitions
    document.body.classList.add('page-transition-init');
    
    // Execute entrance animation when page loads
    window.addEventListener('load', () => {
      // Reveal page elements with staggered timing
      const heroElements = document.querySelectorAll('.hero h1, .hero h2, .hero p, .cta-btn');
      
      gsap.to(heroElements, {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        delay: 0.5
      });
      
      const navLinks = document.querySelectorAll('.nav-links a');
      gsap.to(navLinks, {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.3
      });
    });
    
    // Handle internal link transitions
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', function(e) {
        // Don't transition for empty links
        if (this.getAttribute('href') === '#') return;
        
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Play transition animation
          gsap.to(overlay, {
            translateY: 0,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
              // Calculate scroll position
              const headerOffset = window.innerWidth <= 768 ? 60 : 100;
              const elementPosition = targetElement.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              
              // Scroll to target (without animation)
              window.scrollTo({
                top: offsetPosition
              });
              
              // Hide overlay
              gsap.to(overlay, {
                translateY: "-100%",
                duration: 0.5,
                delay: 0.3,
                ease: "power2.inOut"
              });
            }
          });
        }
      });
    });
  }
  
  /**
   * Initialize parallax effects for background elements
   */
  function initParallaxEffects() {
    // Skip on mobile devices
    if (window.innerWidth <= 768) return;
    
    // Parallax for background elements
    const parallaxElements = document.querySelectorAll('.moving-sun, .section-title, .profile-img');
    
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY;
      
      parallaxElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top + scrollPosition;
        const elementHeight = element.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        // Check if element is in viewport
        if (scrollPosition + viewportHeight > elementTop && 
            scrollPosition < elementTop + elementHeight) {
          
          // Calculate how far element is through viewport
          const scrollPercentage = (scrollPosition + viewportHeight - elementTop) / 
                                 (viewportHeight + elementHeight);
          
          // Apply different parallax effects based on element class
          if (element.classList.contains('moving-sun')) {
            const translateY = scrollPercentage * 100 - 50;
            element.style.transform = `translateY(${translateY}px) translateX(${-translateY}px)`;
          } else if (element.classList.contains('section-title')) {
            const translateY = (scrollPercentage - 0.5) * 30;
            element.style.transform = `translateY(${translateY}px)`;
          } else if (element.classList.contains('profile-img')) {
            const scale = 1 + (scrollPercentage - 0.5) * 0.1;
            element.style.transform = `scale(${scale})`;
          }
        }
      });
    });
    
    // Apply parallax to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
      window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        // Calculate movement based on mouse position
        const moveX = (mouseX - 0.5) * 20;
        const moveY = (mouseY - 0.5) * 20;
        
        // Apply subtle parallax effect to hero content
        gsap.to(hero, {
          x: moveX,
          y: moveY,
          duration: 1,
          ease: "power2.out"
        });
      });
    }
  }