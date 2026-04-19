/* Aurora background — drifting blurry blobs on a 2D canvas.
   Pauses when tab hidden; respects prefers-reduced-motion. */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const canvas = document.getElementById('aurora-canvas');
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  document.body.classList.add('has-aurora-canvas');

  const DPR = Math.min(window.devicePixelRatio || 1, 1.75);

  const blobs = [
    { hue: 268, sat: 80, light: 55, r: 0.55, x: 0.20, y: 0.20, dx: 0.00007, dy: 0.00005, t: Math.random() * 1000 },
    { hue: 188, sat: 85, light: 55, r: 0.50, x: 0.80, y: 0.30, dx: -0.00009, dy: 0.00006, t: Math.random() * 1000 },
    { hue: 168, sat: 75, light: 50, r: 0.45, x: 0.40, y: 0.85, dx: 0.00006, dy: -0.00008, t: Math.random() * 1000 },
    { hue: 295, sat: 70, light: 55, r: 0.35, x: 0.65, y: 0.65, dx: -0.00005, dy: -0.00007, t: Math.random() * 1000 }
  ];

  let W = 0, H = 0;
  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  let running = true;
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) loop();
  });

  let last = 0;
  const FRAME_MS = 1000 / 30; // 30 fps cap

  function loop(now) {
    if (!running) return;
    if (now === undefined) now = performance.now();
    if (now - last < FRAME_MS) {
      requestAnimationFrame(loop);
      return;
    }
    last = now;

    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    ctx.filter = 'blur(70px)';

    const minDim = Math.min(W, H);

    for (let i = 0; i < blobs.length; i++) {
      const b = blobs[i];
      // Slow oscillation around base position
      b.t += 0.005;
      const ox = Math.sin(b.t * 0.6 + i) * 0.06;
      const oy = Math.cos(b.t * 0.5 + i * 1.7) * 0.06;
      // Gentle linear drift, with bounce
      b.x += b.dx * 16;
      b.y += b.dy * 16;
      if (b.x < 0.05 || b.x > 0.95) b.dx *= -1;
      if (b.y < 0.05 || b.y > 0.95) b.dy *= -1;

      const cx = (b.x + ox) * W;
      const cy = (b.y + oy) * H;
      const r = b.r * minDim * 0.6;

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, `hsla(${b.hue}, ${b.sat}%, ${b.light}%, 0.55)`);
      grad.addColorStop(0.5, `hsla(${b.hue}, ${b.sat}%, ${b.light}%, 0.18)`);
      grad.addColorStop(1, `hsla(${b.hue}, ${b.sat}%, ${b.light}%, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.filter = 'none';
    ctx.globalCompositeOperation = 'source-over';

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
