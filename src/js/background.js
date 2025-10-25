/**
 * Background Canvas Animation Module
 * Handles animated background particles for both light and dark themes
 */

class BackgroundAnimation {
  constructor() {
    this.canvas = document.getElementById('background-canvas');
    this.ctx = this.canvas?.getContext('2d');
    this.particles = [];
    this.rafId = null;
    
    if (this.canvas && this.ctx) {
      this.init();
    }
  }

  init() {
    this.resizeCanvas();
    this.applyCanvasMode();
    
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    if (!this.canvas) return;
    
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width = window.innerWidth + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
    
    if (this.ctx) {
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  createParticlesForLight() {
    this.particles = [];
    for (let i = 0; i < 48; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 2 + 0.6,
        speed: Math.random() * 0.45 + 0.12,
        a: Math.random() * 0.5 + 0.08
      });
    }
  }

  createParticlesForDark() {
    this.particles = [];
    for (let i = 0; i < 120; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.2 + 0.2,
        twinkle: Math.random() * 0.02 + 0.008,
        phase: Math.random() * Math.PI * 2,
        a: Math.random() * 0.9 + 0.05
      });
    }
  }

  startCanvas() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    const frame = () => {
      if (!this.ctx || !this.canvas) return;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const isDark = this.isDarkMode();

      if (isDark) {
        // Dark mode: twinkling stars
        for (const p of this.particles) {
          p.phase += p.twinkle || 0.01;
          const a = Math.max(0.04, Math.min(1, p.a + Math.sin(p.phase) * 0.4));
          
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          this.ctx.fillStyle = `rgba(255,255,255,${a})`;
          this.ctx.fill();
        }
      } else {
        // Light mode: falling particles
        for (const p of this.particles) {
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          this.ctx.fillStyle = `rgba(212,175,55,${p.a})`;
          this.ctx.fill();
          
          p.y += p.speed;
          if (p.y > window.innerHeight + 20) {
            p.y = -10;
            p.x = Math.random() * window.innerWidth;
          }
        }
      }

      this.rafId = requestAnimationFrame(frame);
    };

    frame();
  }

  isDarkMode() { return true; }

  applyCanvasMode() {
    // Fixed dark animation matching site palette
    this.createParticlesForDark();
    this.startCanvas();
  }

  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new BackgroundAnimation());
} else {
  new BackgroundAnimation();
}

export { BackgroundAnimation };
