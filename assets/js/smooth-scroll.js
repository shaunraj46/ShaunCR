/**
 * smooth-scroll.js
 * Enhanced smooth scrolling with fixes for compatibility
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing enhanced smooth scroll');
    
    // Check for Locomotive Scroll but use native smooth scroll instead
    // This is more reliable and fixes the issues
    initEnhancedSmoothScroll();
    
    // Add scroll progress indicator
    initScrollProgress();
    
    // Initialize scroll based animations
    initScrollAnimations();
  });
  
  /**
   * Initialize enhanced smooth scrolling
   */
  function initEnhancedSmoothScroll() {
    // Enable native smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Remove Locomotive attributes to prevent conflicts
    document.body.removeAttribute('data-scroll-container');
    
    document.querySelectorAll('[data-scroll-section]').forEach(section => {
      section.removeAttribute('data-scroll-section');
    });
    
    document.querySelectorAll('[data-scroll]').forEach(element => {
      element.removeAttribute('data-scroll');
      element.removeAttribute('data-scroll-speed');
    });
    
    // Handle anchor links with enhanced animation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          
          // Create a premium flash effect
          const flash = document.createElement('div');
          flash.style.position = 'fixed';
          flash.style.top = '0';
          flash.style.left = '0';
          flash.style.width = '100%';
          flash.style.height = '100%';
          flash.style.backgroundColor = 'rgba(79, 70, 229, 0.1)';
          flash.style.opacity = '0';
          flash.style.zIndex = '9998';
          flash.style.pointerEvents = 'none';
          flash.style.transition = 'opacity 0.3s ease';
          document.body.appendChild(flash);
          
          // Flash effect
          setTimeout(() => {
            flash.style.opacity = '0.5';
            setTimeout(() => {
              flash.style.opacity = '0';
              setTimeout(() => {
                if (document.body.contains(flash)) {
                  document.body.removeChild(flash);
                }
              }, 300);
            }, 300);
          }, 10);
          
          // Calculate offset position
          const headerOffset = window.innerWidth <= 768 ? 60 : 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          // Smooth scroll to target
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          const mobileMenu = document.querySelector('.nav-links');
          const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
          
          if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
          }
          
          // Highlight active nav link
          updateActiveNavLink(targetId);
        }
      });
    });
    
    // Add scroll event listener for various effects
    window.addEventListener('scroll', function() {
      // Update active nav link based on scroll position
      updateActiveNavLinkOnScroll();
      
      // Update animations based on scroll position
      updateScrollAnimations();
      
      // Apply parallax effects
      applyParallaxEffects();
    });
  }
  
  /**
   * Initialize scroll progress indicator
   */
  function initScrollProgress() {
    // Get or create progress bar
    let progressBar = document.querySelector('.scroll-progress');
    
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'scroll-progress';
      document.body.appendChild(progressBar);
    }
    
    // Update progress bar on scroll
    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollProgress = (scrollTop / scrollHeight) * 100;
      
      progressBar.style.width = scrollProgress + '%';
    });
  }
  
  /**
   * Update active navigation link on scroll
   */
  function updateActiveNavLinkOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Get current scroll position
    const scrollPosition = window.scrollY + 200; // Offset for better detection
    
    // Find current section
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = '#' + section.getAttribute('id');
      }
    });
    
    // Update active link
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === currentSection) {
        link.classList.add('active');
      }
    });
  }
  
  /**
   * Update active navigation link by ID
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
   * Initialize scroll based animations
   */
  function initScrollAnimations() {
    // Create intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          entry.target.classList.add('in-view');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements with animation classes
    document.querySelectorAll('.fade-in, .fade-up, .text-reveal, .image-reveal, .project-card, .skill-card, section, .stagger-list').forEach(element => {
      observer.observe(element);
    });
  }
  
  /**
   * Update animations based on scroll position
   */
  function updateScrollAnimations() {
    // Get scroll position
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Update animations as needed
    document.querySelectorAll('.fade-in, .fade-up, .text-reveal, .image-reveal').forEach(element => {
      const elementTop = element.getBoundingClientRect().top + scrollTop;
      const elementVisible = elementTop + element.offsetHeight * 0.3;
      
      if (scrollTop + windowHeight > elementVisible) {
        element.classList.add('visible');
      }
    });
  }
  
  /**
   * Apply parallax effects based on scroll position
   */
  function applyParallaxEffects() {
    // Skip on mobile devices
    if (window.innerWidth <= 768) return;
    
    // Get scroll position
    const scrollTop = window.scrollY;
    
    // Apply parallax to moving sun
    document.querySelectorAll('.moving-sun').forEach(element => {
      element.style.transform = `translateY(${scrollTop * 0.1}px) translateX(${-scrollTop * 0.05}px)`;
    });
    
    // Apply subtle parallax to sections
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop;
      const scrollPosition = scrollTop - sectionTop;
      
      // Only apply when section is visible
      if (scrollPosition > -window.innerHeight && scrollPosition < section.offsetHeight) {
        // Different effects for different elements within the section
        section.querySelectorAll('.profile-img, .startup-img, .formula-img, .leadership-img').forEach(element => {
          const speed = 0.05;
          const yOffset = scrollPosition * speed;
          element.style.transform = `translateY(${yOffset}px)`;
        });
      }
    });
  }
  
  /**
   * Handle smooth scrolling for browsers without native support
   */
  function smoothScrollPolyfill(targetElement, duration = 800) {
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const scrollY = easeInOutCubic(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, scrollY);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }
    
    // Easing function
    function easeInOutCubic(t, b, c, d) {
      t /= d/2;
      if (t < 1) return c/2*t*t*t + b;
      t -= 2;
      return c/2*(t*t*t + 2) + b;
    }
    
    requestAnimationFrame(animation);
  }
  
  // Force content visibility once page is loaded
  window.addEventListener('load', function() {
    // Ensure all content is visible
    document.querySelectorAll('section, header, footer, .hero, .project-card, .skill-card').forEach(el => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });
    
    // Update scroll position indicator
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollProgress = (scrollTop / scrollHeight) * 100;
    
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
      progressBar.style.width = scrollProgress + '%';
    }
    
    // Update active nav link on page load
    updateActiveNavLinkOnScroll();
  });