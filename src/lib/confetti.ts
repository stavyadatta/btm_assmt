export function confetti(canvas: HTMLCanvasElement, n = 60) {
  const ctx = canvas.getContext("2d")!;
  const W = (canvas.width = canvas.offsetWidth);
  const H = (canvas.height = canvas.offsetHeight);
  const parts = Array.from({ length: n }, () => ({
    x: W / 2,
    y: H / 3,
    vx: (Math.random() - 0.5) * 6,
    vy: Math.random() * -5 - 2,
    g: 0.15 + Math.random() * 0.1,
    s: 2 + Math.random() * 3,
    a: 1,
    c: `hsl(${Math.floor(40 + Math.random() * 60)} 100% ${50 + Math.random() * 30}%)`,
  }));
  let frames = 0;
  function tick() {
    frames++;
    ctx.clearRect(0, 0, W, H);
    parts.forEach((p) => {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.a -= 0.006;
      ctx.globalAlpha = Math.max(0, p.a);
      ctx.fillStyle = p.c;
      ctx.fillRect(p.x, p.y, p.s, p.s);
    });
    if (frames < 300) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, W, H);
  }
  tick();
}

