/**
 * Particles effect for header background
 * Creates interactive floating particles
 */

// Particle configuration
const PARTICLE_CONFIG = {
    count: 50,
    colors: ['rgba(79, 70, 229, 0.3)', 'rgba(139, 92, 246, 0.3)', 'rgba(255, 255, 255, 0.1)'],
    speedFactor: 0.5,
    sizeRange: [2, 6],
    connectionDistance: 150
};

// Particle class definition
class Particle {
    constructor(container, config) {
        this.container = container;
        this.element = document.createElement('div');
        this.element.classList.add('particle');
        
        // Random size within range
        this.size = Math.random() * (config.sizeRange[1] - config.sizeRange[0]) + config.sizeRange[0];
        
        // Random position
        this.x = Math.random() * container.clientWidth;
        this.y = Math.random() * container.clientHeight;
        
        // Random movement speed
        this.speedX = (Math.random() - 0.5) * config.speedFactor;
        this.speedY = (Math.random() - 0.5) * config.speedFactor;
        
        // Random color from config
        this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
        
        // Set particle styles
        this.element.style.width = this.size + 'px';
        this.element.style.height = this.size + 'px';
        this.element.style.backgroundColor = this.color;
        this.element.style.boxShadow = `0 0 ${this.size}px ${this.color}`;
        
        // Add to container
        this.container.appendChild(this.element);
        this.update();
    }
    
    // Update particle position
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x < 0 || this.x > this.container.clientWidth) {
            this.speedX *= -1;
        }
        
        if (this.y < 0 || this.y > this.container.clientHeight) {
            this.speedY *= -1;
        }
        
        // Update position
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }
}

// Initialize particle system
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    // Clear previous particles
    container.innerHTML = '';
    
    const particles = [];
    
    // Create particles
    for (let i = 0; i < PARTICLE_CONFIG.count; i++) {
        particles.push(new Particle(container, PARTICLE_CONFIG));
    }
    
    // Create connections canvas
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Mouse interaction
    let mouse = { x: null, y: null, radius: 100 };
    
    container.addEventListener('mousemove', function(e) {
        const rect = container.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    container.addEventListener('mouseleave', function() {
        mouse.x = null;
        mouse.y = null;
    });
    
    // Animation frame
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update particles
        particles.forEach(particle => {
            particle.update();
            
            // Mouse interaction - repel particles
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - particle.x;
                const dy = mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const directionX = dx / distance;
                    const directionY = dy / distance;
                    
                    particle.x -= directionX * force;
                    particle.y -= directionY * force;
                    particle.update();
                }
            }
            
            // Draw connections between particles
            for (let j = 0; j < particles.length; j++) {
                const otherParticle = particles[j];
                if (particle === otherParticle) continue;
                
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < PARTICLE_CONFIG.connectionDistance) {
                    const opacity = 1 - (distance / PARTICLE_CONFIG.connectionDistance);
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(79, 70, 229, ${opacity * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        });
    }
    
    // Handle window resize
    function handleResize() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
    
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animate();
}

// Initialize particles on load
window.addEventListener('load', function() {
    // Only initialize particles on desktop to save performance
    if (window.innerWidth > 768) {
        initParticles();
    } else {
        // For mobile, we'll add a simpler static particle effect
        createStaticParticles();
    }
});

// Create static particles for mobile
function createStaticParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    // Clear previous particles
    container.innerHTML = '';
    
    // Create fewer static particles for mobile
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size
        const size = Math.random() * 4 + 2;
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random color
        const colors = PARTICLE_CONFIG.colors;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Set styles
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.backgroundColor = color;
        particle.style.left = x + '%';
        particle.style.top = y + '%';
        particle.style.boxShadow = `0 0 ${size}px ${color}`;
        
        // Add simple floating animation
        particle.style.animation = `float ${Math.random() * 10 + 10}s infinite ease-in-out`;
        
        container.appendChild(particle);
    }
}