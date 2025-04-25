/**
 * premium-transitions.js
 * Enhanced animations and transitions with fixes for performance and visibility
 */

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP animations if available
    if (typeof gsap !== 'undefined') {
      initGsapAnimations();
    } else {
      // Fallback to standard animations
      initStandardAnimations();
    }
    
    // Initialize custom cursor
    initCursorEffects();
    
    // Initialize magnetic elements (desktop only)
    if (window.innerWidth > 768) {
      initMagneticElements();
    }
    
    // Initialize page transitions
    initPageTransitions();
    
    // Initialize parallax effects
    initParallaxEffects();
    
    // Initialize text splitting for animations
    initTextSplitting();
  });
  
  /**
   * Initialize GSAP animations for premium reveal effects
   */
  function initGsapAnimations() {
    console.log("Initializing GSAP animations");
    
    // Register ScrollTrigger if available
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    
      // Hero section text animation
      gsap.from('.hero h1, .hero h2, .hero p, .hero .cta-btn', {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out"
      });
      
      // Section title animations
      gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: title,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        });
      });
      
      // Project cards reveal
      gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.from(card, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        });
      });
      
      // Skill cards reveal
      gsap.utils.toArray('.skill-card').forEach((card, index) => {
        gsap.from(card, {
          y: 30,
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        });
      });
      
      // Images reveal
      gsap.utils.toArray('.image-reveal').forEach(image => {
        gsap.from(image, {
          opacity: 0,
          y: 30,
          duration: 1,
          scrollTrigger: {
            trigger: image,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        });
      });
    } else {
      // Basic animations if ScrollTrigger is not available
      gsap.from('.hero h1, .hero h2, .hero p, .hero .cta-btn', {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out"
      });
    }
  }
  
  /**
   * Standard animations for browsers without GSAP
   */
  function initStandardAnimations() {
    console.log("Initializing standard animations");
    
    // Make hero elements visible with css transitions
    document.querySelectorAll('.hero h1, .hero h2, .hero p, .hero .cta-btn').forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, 300 + (index * 200));
    });
    
    // Initialize intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements with animation classes
    document.querySelectorAll('section, .fade-in, .fade-up, .text-reveal, .image-reveal, .stagger-list, .project-card, .skill-card').forEach(el => {
      observer.observe(el);
    });
  }
  
  /**
   * Initialize custom cursor effects
   */
  function initCursorEffects() {
    // Skip on mobile devices or if cursor already exists
    if (window.innerWidth <= 768 || document.querySelector('.custom-cursor')) return;
    
    // Create custom cursor element
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    // Track mouse movement with optimized performance
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = '1';
    });
    
    // Animation loop for smoother cursor movement
    function updateCursor() {
      // Calculate cursor position with slight delay for smoother movement
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      
      if (cursor) {
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
      }
      
      requestAnimationFrame(updateCursor);
    }
    
    // Start cursor animation
    updateCursor();
    
    // Handle cursor visibility when leaving/entering window
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });
    
    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .cta-btn, .project-card, .skill-card, .social-link');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
      });
      
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
      });
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
        if (typeof gsap !== 'undefined') {
          const rect = this.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          const distanceX = e.clientX - centerX;
          const distanceY = e.clientY - centerY;
          
          // Calculate movement strength based on distance from center
          const strength = 15; // Max movement in pixels
          const maxDistance = Math.sqrt((rect.width / 2) * (rect.width / 2) + (rect.height / 2) * (rect.height / 2));
          
          const moveX = (distanceX / maxDistance) * strength;
          const moveY = (distanceY / maxDistance) * strength;
          
          gsap.to(this, {
            x: moveX,
            y: moveY,
            duration: 0.3,
            ease: "power2.out"
          });
        } else {
          // Fallback for browsers without GSAP
          const rect = this.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          const distanceX = e.clientX - centerX;
          const distanceY = e.clientY - centerY;
          
          // Calculate movement strength
          const strength = 15;
          const maxDistance = Math.sqrt((rect.width / 2) * (rect.width / 2) + (rect.height / 2) * (rect.height / 2));
          
          const moveX = (distanceX / maxDistance) * strength;
          const moveY = (distanceY / maxDistance) * strength;
          
          this.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
      });
      
      element.addEventListener('mouseleave', function() {
        if (typeof gsap !== 'undefined') {
          gsap.to(this, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
          });
        } else {
          // Fallback for browsers without GSAP
          this.style.transform = 'translate(0px, 0px)';
        }
      });
    });
  }
  
  /**
   * Initialize page transition effects
   */
  function initPageTransitions() {
    // Skip if transition element already exists
    if (document.querySelector('.page-transition')) return;
    
    // Add transition overlay
    const overlay = document.createElement('div');
    overlay.className = 'page-transition';
    document.body.appendChild(overlay);
    
    // Handle internal link transitions
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', function(e) {
        // Don't transition for empty links
        if (this.getAttribute('href') === '#') return;
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Show transition overlay
          overlay.style.opacity = '1';
          
          // Hide overlay after transition
          setTimeout(() => {
            overlay.style.opacity = '0';
          }, 600);
        }
      });
    });
  }
  
  /**
   * Initialize parallax effects for background elements
   */
  function initParallaxEffects() {
    // Skip on mobile devices or low-end devices
    if (window.innerWidth <= 768 || !window.requestAnimationFrame) return;
    
    // Parallax for background elements
    const parallaxElements = document.querySelectorAll('.moving-sun, .profile-img, .startup-img, .formula-img, .leadership-img');
    
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY;
      
      // Apply parallax to moving sun
      document.querySelectorAll('.moving-sun').forEach(element => {
        element.style.transform = `translateY(${scrollPosition * 0.1}px) translateX(${-scrollPosition * 0.05}px)`;
      });
      
      // Apply subtle parallax to images
      document.querySelectorAll('.profile-img, .startup-img, .formula-img, .leadership-img').forEach(element => {
        const elementTop = element.getBoundingClientRect().top + scrollPosition;
        const elementCenter = elementTop + element.offsetHeight / 2;
        const distanceFromCenter = scrollPosition + window.innerHeight / 2 - elementCenter;
        const parallaxValue = distanceFromCenter * 0.05;
        
        element.style.transform = `translateY(${parallaxValue}px)`;
      });
    });
    
    // Subtle mousemove parallax for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
      document.addEventListener('mousemove', e => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        const moveX = mouseX * 20;
        const moveY = mouseY * 20;
        
        if (typeof gsap !== 'undefined') {
          gsap.to(hero, {
            x: moveX,
            y: moveY,
            duration: 1,
            ease: "power2.out"
          });
        } else {
          hero.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
      });
    }
  }
  
  /**
   * Split text into individual spans for text reveal animations
   */
  function initTextSplitting() {
    document.querySelectorAll('.text-reveal').forEach(element => {
      // Only process if not already processed
      if (!element.querySelector('span')) {
        const text = element.textContent;
        element.textContent = '';
        
        // Create spans for each character
        text.split('').forEach(char => {
          const span = document.createElement('span');
          span.textContent = char === ' ' ? '\u00A0' : char;
          element.appendChild(span);
        });
      }
    });
  }
  
  // Update animations on window resize
  window.addEventListener('resize', function() {
    // Re-initialize cursor effects based on screen size
    if (window.innerWidth <= 768) {
      const cursor = document.querySelector('.custom-cursor');
      if (cursor) cursor.style.display = 'none';
    } else {
      const cursor = document.querySelector('.custom-cursor');
      if (cursor) cursor.style.display = 'block';
    }
  });
  
  // Initialize on page load
  window.addEventListener('load', function() {
    // Make sure everything is visible
    document.querySelectorAll('section, header, footer, .hero, .project-card, .skill-card').forEach(el => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });
    
    // Apply fade-in to body
    document.body.classList.add('loaded');
    
    // Add visibility class to hero elements
    document.querySelectorAll('.hero h1, .hero h2, .hero p, .hero .cta-btn').forEach(el => {
      el.classList.add('visible');
    });
  });