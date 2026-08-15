(function () {

  const canvas = document.createElement('canvas');
  canvas.id = 'fire-canvas';
  Object.assign(canvas.style, {
    position:      'fixed',
    bottom:        '0',
    left:          '0',
    width:         '100%',
    height:        '140px',
    pointerEvents: 'none',
    zIndex:        '9999',
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Ember {
    constructor(stagger) { this.reset(stagger); }

    reset(stagger) {
      this.x       = Math.random() * W;
      this.y       = H + 2;
      this.vx      = (Math.random() - 0.5) * 0.5;
      this.vy      = -(0.6 + Math.random() * 1.4);
      this.maxLife = 80 + Math.random() * 100;
      this.life    = stagger ? Math.random() * this.maxLife : 0;
      this.size    = 1.0 + Math.random() * 1.5;
      this.color   = Math.random() < 0.80 ? 'orange' : 'cyan';
    }

    update() {
      this.x   += this.vx;
      this.y   += this.vy;
      this.vx  += (Math.random() - 0.5) * 0.08;
      this.vy  *= 0.992;
      this.life++;
      if (this.life > this.maxLife || this.y < -4) this.reset(false);
    }

    draw() {
      const t     = this.life / this.maxLife;
      const alpha = t < 0.15 ? t / 0.15 : 1 - ((t - 0.15) / 0.85);
      const r     = this.size * (1 - t * 0.35);
      const rgb   = this.color === 'orange' ? '255,90,19' : '77,255,255';

      ctx.beginPath();
      ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
      ctx.fillStyle   = `rgba(${rgb},${alpha})`;
      ctx.shadowBlur  = 5;
      ctx.shadowColor = `rgba(${rgb},${alpha * 0.6})`;
      ctx.fill();
      ctx.shadowBlur  = 0;
    }
  }

  function drawBase() {
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0,   'transparent');
    grad.addColorStop(0.2, 'rgba(255,90,19,0.25)');
    grad.addColorStop(0.5, 'rgba(255,90,19,0.35)');
    grad.addColorStop(0.8, 'rgba(255,90,19,0.25)');
    grad.addColorStop(1,   'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, H - 2, W, 2);
  }

  const embers = Array.from({ length: 160 }, () => new Ember(true));

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawBase();
    embers.forEach(e => { e.update(); e.draw(); });
    requestAnimationFrame(loop);
  }
  loop();

})();
