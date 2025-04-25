/**
 * smooth-scroll.js
 * Implements premium smooth scrolling with Locomotive Scroll
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if LocomotiveScroll is loaded
    if (typeof LocomotiveScroll === 'undefined') {
      console.warn("LocomotiveScroll not found. Add this to your HTML: <script src='https://cdn.jsdelivr.net/npm/locomotive-scroll@4.1.4/dist/locomotive-scroll.min.js'></script>");
      
      // Use native smooth scroll as fallback
      initNativeSmoothScroll();
      return;
    }
    
    // Initialize Locomotive Scroll
    initLocomotiveScroll();
    
    // Add scroll progress indicator
    initScrollProgress();
  });
  
  /**
   * Initialize Locomotive Scroll for premium smooth scrolling
   */
  function initLocomotiveScroll() {
    // Prepare DOM - add necessary attributes
    document.body.setAttribute('data-scroll-container', '');
    
    // Add scroll-section attribute to main sections
    document.querySelectorAll('section, header, footer').forEach(section => {
      section.setAttribute('data-scroll-section', '');
    });
    
    // Add basic scroll attribute to elements we want to track
    document.querySelectorAll('.hero h1, .hero h2, .hero p, .cta-btn, .section-title, .project-card, .skill-card, .contact-link').forEach(element => {
      element.setAttribute('data-scroll', '');
      element.setAttribute('data-scroll-speed', '0.1');
    });
    
    // Add reveal class attributes for fade animations
    document.querySelectorAll('.section-title, .project-card, .skill-card, .contact-link').forEach(element => {
      element.setAttribute('data-scroll-class', 'reveal');
    });
    
    // Special parallax effects for specific elements
    document.querySelectorAll('.profile-img, .startup-img, .formula-img, .leadership-img').forEach(element => {
      element.setAttribute('data-scroll', '');
      element.setAttribute('data-scroll-speed', '0.2');
    });
    
    // Initialize Locomotive Scroll
    const scroll = new LocomotiveScroll({
      el: document.querySelector('[data-scroll-container]'),
      smooth: true,
      smoothMobile: false,  // Disable on mobile for performance
      multiplier: 0.8,      // Adjust scrolling speed (lower = slower)
      lerp: 0.05,           // Linear interpolation (lower = smoother)
      smartphone: {
        smooth: false
      },
      tablet: {
        smooth: true,
        breakpoint: 768
      }
    });
    
    // Update scroll on image load and window resize
    window.addEventListener('load', () => {
      scroll.update();
    });
    
    window.addEventListener('resize', () => {
      scroll.update();
    });
    
    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
          // Scroll to target
          scroll.scrollTo(target);
          
          // Close mobile menu if open
          const mobileMenu = document.querySelector('.nav-links');
          const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
          
          if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
          }
        }
      });
    });
    
    // Add scroll callbacks for effects
    scroll.on('scroll', (instance) => {
      // Add custom effects based on scroll position
      const scrollPercent = instance.scroll.y / (document.body.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty('--scroll-percent', scrollPercent);
      
      // Update active nav link
      updateActiveNavLink(instance);
    });
    
    // Create global reference for other scripts
    window.smoothScroll = scroll;
  }
  
  /**
   * Fallback for native smooth scrolling
   */
  function initNativeSmoothScroll() {
    // Use native smooth scroll with polyfill
    if (!('scrollBehavior' in document.documentElement.style)) {
      // Add polyfill class for CSS adjustments
      document.body.classList.add('no-smooth-scroll');
      
      // Simple smooth scroll function
      function smoothScroll(target, duration = 800) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const run = ease(timeElapsed, startPosition, distance, duration);
          window.scrollTo(0, run);
          if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        // Easing function
        function ease(t, b, c, d) {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t + b;
          t--;
          return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
      }
      
      // Add smooth scroll to all anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          
          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            smoothScroll(target);
            
            // Close mobile menu if open
            const mobileMenu = document.querySelector('.nav-links');
            const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
            
            if (mobileMenu && mobileMenu.classList.contains('active')) {
              mobileMenu.classList.remove('active');
              if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
              document.body.classList.remove('menu-open');
            }
          }
        });
      });
    } else {
      // Modern browsers with native smooth scroll
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          
          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            
            // Add fade out effect before scrolling
            document.body.classList.add('scrolling');
            
            // Smooth scroll to target
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
            
            // Remove effect after scrolling
            setTimeout(() => {
              document.body.classList.remove('scrolling');
            }, 800);
            
            // Close mobile menu if open
            const mobileMenu = document.querySelector('.nav-links');
            const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
            
            if (mobileMenu && mobileMenu.classList.contains('active')) {
              mobileMenu.classList.remove('active');
              if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
              document.body.classList.remove('menu-open');
            }
          }
        });
      });
      
      // Add scroll event for native scroll effects
      window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = scrollTop / (document.body.scrollHeight - window.innerHeight);
        document.documentElement.style.setProperty('--scroll-percent', scrollPercent);
        
        // Reveal elements on scroll
        revealOnScroll();
        
        // Update active nav link
        updateActiveNavLinkNative();
      });
    }
    
    // Add reveal class for all elements that need to animate in
    document.querySelectorAll('.section-title, .project-card, .skill-card, .about-content, .startup-content, .formula-content, .leadership-content').forEach(element => {
      element.classList.add('scroll-reveal');
    });
  }
  
  /**
   * Reveal elements on scroll (for native scroll)
   */
  function revealOnScroll() {
    const revealElements = document.querySelectorAll('.scroll-reveal:not(.reveal)');
    const windowHeight = window.innerHeight;
    
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('reveal');
      }
    });
  }
  
  /**
   * Update active navigation link based on scroll position
   * For Locomotive Scroll
   */
  function updateActiveNavLink(instance) {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      
      if (sectionTop <= 100) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }
  
  /**
   * Update active navigation link for native scroll
   */
  function updateActiveNavLinkNative() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = sectionId;
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
   * Initialize scroll progress indicator
   */
  function initScrollProgress() {
    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    // Update progress bar width based on scroll position
    function updateProgress() {
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY / windowHeight;
      progressBar.style.width = `${scrolled * 100}%`;
    }
    
    // Update on scroll
    window.addEventListener('scroll', updateProgress);
    
    // Initial update
    updateProgress();
  }