(() => {
  // Name, secondary accent, and a distinct company highlight for each palette.
  const themes = [
    ['#F2F2F2', '#4A90E2', '#78B7FF'], // Cool white and blue
    ['#D8E3DC', '#E2C290', '#E2C290'], // Sage and sand
    ['#E6E6FA', '#9EB1C7', '#B6A4ED'], // Lavender and slate
    ['#F4A261', '#83BAC2', '#F4A261'], // Coral gold and teal
    ['#F6D5D5', '#B4A7FF', '#B4A7FF'], // Pale rose and purple
    ['#BDE0FE', '#A9A9A9', '#8DCAFA']  // Ice blue and silver
  ];
  const colors = themes[Math.floor(Math.random() * themes.length)];
  document.documentElement.style.setProperty('--accent', colors[0]);
  document.documentElement.style.setProperty('--accent-secondary', colors[1]);
  document.documentElement.style.setProperty('--company-accent', colors[2]);

  const container = document.getElementById('canvas-container');
  if (!container) return;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  container.appendChild(canvas);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0;
  let height = 0;
  let particles = [];
  let frameId = null;
  let lastTime = null;

  function particle(x = Math.random() * width, y = Math.random() * height) {
    return {
      x, y,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      color: colors[Math.random() < 0.5 ? 0 : 1]
    };
  }

  function render(step = 0) {
    ctx.clearRect(0, 0, width, height);
    for (const point of particles) {
      point.x += point.vx * step;
      point.y += point.vy * step;
      if (point.x < 0 || point.x > width) {
        point.x = Math.max(0, Math.min(width, point.x));
        point.vx *= -1;
      }
      if (point.y < 0 || point.y > height) {
        point.y = Math.max(0, Math.min(height, point.y));
        point.vy *= -1;
      }
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      ctx.fillStyle = point.color;
      ctx.fill();
    }
    const maxDistance = Math.min(width / 8, 110);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < maxDistance) {
          ctx.beginPath();
          ctx.strokeStyle = colors[i % 2];
          ctx.globalAlpha = (1 - distance / maxDistance) * 0.25;
          ctx.lineWidth = 0.5;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  function animate(time) {
    const step = lastTime === null ? 0 : Math.min((time - lastTime) / (1000 / 60), 2);
    lastTime = time;
    render(step);
    frameId = requestAnimationFrame(animate);
  }

  function syncMotion() {
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null;
    lastTime = null;
    render();
    if (!document.hidden && !reducedMotion.matches) {
      frameId = requestAnimationFrame(animate);
    }
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles = Array.from({ length: Math.min(100, Math.ceil(width / 10)) }, () => particle());
    syncMotion();
  }

  // Click empty space to add a small burst, without intercepting links.
  document.addEventListener('pointerdown', (event) => {
    if (event.target.closest('a, button, input, textarea, select') || reducedMotion.matches) return;
    particles.push(...Array.from({ length: 5 }, () => particle(event.clientX, event.clientY)));
    particles = particles.slice(-120);
  });
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', syncMotion);
  reducedMotion.addEventListener('change', syncMotion);
  resize();
})();
