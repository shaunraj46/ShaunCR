/**
 * Premium Custom Cursor Implementation
 */
function initializeCustomCursor() {
    // Skip on mobile devices or when reduced motion is preferred
    if (
        document.body.classList.contains('mobile') || 
        document.body.classList.contains('touch-device') ||
        window.matchMedia('(pointer: coarse)').matches
    ) {
        document.querySelector('.cursor-container')?.remove();
        return;
    }
    
    const cursor = document.querySelector('.cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    
    if (!cursor || !cursorDot) return;
    
    // Initial position off-screen
    cursor.style.opacity = '0';
    cursorDot.style.opacity = '0';
    
    // Track cursor position with optimized performance
    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let dotX = -100;
    let dotY = -100;
    
    // Smoothing factor for cursor movement (higher = smoother/slower)
    const smoothingFactor = 0.15;
    const dotSmoothingFactor = 0.2;
    
    // Add different cursor types for different elements
    document.querySelectorAll('[data-cursor]').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add(element.dataset.cursor);
            cursorDot.classList.add(element.dataset.cursor);
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove(element.dataset.cursor);
            cursorDot.classList.remove(element.dataset.cursor);
        });
    });
    
    // Add hover effect for all interactive elements
    document.querySelectorAll('a, button, input, textarea, select, .glass-card').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorDot.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorDot.classList.remove('hover');
        });
    });
    
    // Add text effect for text elements
    document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, li').forEach(element => {
        if (!element.closest('a, button')) {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('text-hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('text-hover');
            });
        }
    });
    
    // Handle cursor interaction when clicking
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    
    // Handle mouse movement with high performance
    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Make cursor visible on first movement
        if (cursor.style.opacity === '0') {
            cursor.style.opacity = '1';
            cursorDot.style.opacity = '1';
        }
    });
    
    // Animation loop with optimized performance
    let lastTimestamp = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;
    
    function updateCursor(timestamp) {
        // Throttle frame rate
        if (timestamp - lastTimestamp < frameInterval) {
            requestAnimationFrame(updateCursor);
            return;
        }
        
        lastTimestamp = timestamp;
        
        // Calculate new cursor position with smoothing
        cursorX += (mouseX - cursorX) * smoothingFactor;
        cursorY += (mouseY - cursorY) * smoothingFactor;
        
        // Update main cursor
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        
        // Calculate dot position with different smoothing for trailing effect
        dotX += (mouseX - dotX) * dotSmoothingFactor;
        dotY += (mouseY - dotY) * dotSmoothingFactor;
        
        // Update dot cursor
        cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
        
        requestAnimationFrame(updateCursor);
    }
    
    // Start animation loop
    requestAnimationFrame(updateCursor);
    
    // Hide cursor when leaving window
    document.addEventListener('mouseout', e => {
        if (e.relatedTarget === null || e.target === document.documentElement) {
            cursor.style.opacity = '0';
            cursorDot.style.opacity = '0';
        }
    });
    
    // Show cursor when entering window
    document.addEventListener('mouseover', () => {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
    });
}

// Add to initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize custom cursor
    initializeCustomCursor();
});