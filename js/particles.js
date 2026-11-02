// Keep the original constellation feel, with a quiet, static background.
(() => {
  const container = document.getElementById('canvas-container');
  if (!container) return;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  container.appendChild(canvas);
  function draw() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.scale(ratio, ratio);
    // Deterministic positions avoid a new theme or layout on every visit.
    let seed = 42;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const points = Array.from({ length: Math.min(48, Math.floor(width / 18)) }, () => ({
      x: random() * width, y: random() * height, radius: random() * 1.4 + 0.6
    }));
    for (const [index, point] of points.entries()) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      ctx.fillStyle = index % 3 === 0 ? '#f4a261' : '#778d94';
      ctx.fill();
      for (const other of points.slice(index + 1)) {
        const distance = Math.hypot(point.x - other.x, point.y - other.y);
        if (distance < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(180, 180, 180, ${(1 - distance / 110) * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }
    }
  }
  draw();
  window.addEventListener('resize', draw);
})();
