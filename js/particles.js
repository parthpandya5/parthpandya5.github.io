const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.getElementById('canvas-container').appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Color Theme Generator
const colorThemes = [
  ['#06D6A0', '#1B9AAA'], // Teal & Turquoise
  ['#FF6B6B', '#FFD93D'], // Red & Yellow
  ['#6A0572', '#AB83A1'], // Purple & Lavender
  ['#2E86AB', '#A6DF95'], // Blue & Green
  ['#F46036', '#5B85AA'], // Orange & Blue
  ['#540D6E', '#EE4266']  // Purple & Pink
];

// Randomly select a color theme
let colorTheme = colorThemes[Math.floor(Math.random() * colorThemes.length)];

// Apply the theme color to elements
document.addEventListener('DOMContentLoaded', () => {
  const nameHighlight = document.querySelector('.name-highlight');
  nameHighlight.style.color = colorTheme[0];
  
  const highlights = document.querySelectorAll('.highlight');
  highlights.forEach((element, index) => {
    element.style.color = index % 2 === 0 ? colorTheme[0] : colorTheme[1];
  });
  
  const socialIcons = document.querySelectorAll('.social-icon i');
  socialIcons.forEach((icon, index) => {
    icon.style.backgroundColor = index % 2 === 0 ? colorTheme[0] : colorTheme[1];
  });
});

// Interactive Particles
class Particle {
  constructor(x, y, size, color, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speedX = speed * (Math.random() - 0.5);
    this.speedY = speed * (Math.random() - 0.5);
    this.alpha = 1;
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Bounce off edges
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

let particles = [];

// Initialize particles
function initParticles() {
  particles = [];
  const particleCount = Math.min(window.innerWidth / 10, 100);
  
  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 3 + 1;
    const color = Math.random() > 0.5 ? colorTheme[0] : colorTheme[1];
    const speed = 0.5;
    
    particles.push(new Particle(x, y, size, color, speed));
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });
  
  // Connect particles within a certain distance
  connectParticles();
}

// Connect nearby particles with lines
function connectParticles() {
  const maxDistance = Math.min(canvas.width / 10, 100);
  
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < maxDistance) {
        // Calculate opacity based on distance
        const opacity = 1 - (distance / maxDistance);
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

// Add more particles on click
canvas.addEventListener('click', (event) => {
  for (let i = 0; i < 5; i++) {
    const size = Math.random() * 3 + 1;
    const color = Math.random() > 0.5 ? colorTheme[0] : colorTheme[1];
    const speed = 1;
    
    particles.push(new Particle(event.x, event.y, size, color, speed));
  }
});

// Handle window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});

// Initialize and start animation
initParticles();
animate();
