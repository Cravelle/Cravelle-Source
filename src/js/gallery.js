/**
 * Gallery Module
 * Handles interactive image gallery with parallax effects
 */

class Gallery {
  constructor() {
    this.container = document.getElementById('galleryFull');
    this.slides = Array.from(document.querySelectorAll('.gallery-slide'));
    this.dots = Array.from(document.querySelectorAll('.dot'));
    this.shadeLeft = document.getElementById('shadeLeft');
    this.shadeRight = document.getElementById('shadeRight');
    this.currentIndex = 0;
    this.pmx = 0;
    this.pmy = 0;
    this.tmx = 0;
    this.tmy = 0;
    this.rafPM = null;

    if (this.container && this.slides.length > 0) {
      this.init();
    }
  }

  init() {
    this.setActive(0);
    this.setupEventListeners();
    this.setupHeroZoom();
  }

  setupHeroZoom() {
    const hero = document.querySelector('header.hero-banner');
    if (!hero) return;

    let lastScrollY = window.scrollY;

    const updateZoom = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        hero.style.setProperty('--hero-zoom', '1');
        return;
      }

      const maxZoom = 1.18;
      const start = 0;
      const end = 420;
      const sy = window.scrollY;
      const t = Math.min(Math.max((sy - start) / (end - start), 0), 1);
      const zoom = 1 + (maxZoom - 1) * t;
      hero.style.setProperty('--hero-zoom', zoom.toFixed(4));
    };

    updateZoom();

    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      if (Math.abs(sy - lastScrollY) > 1) {
        lastScrollY = sy;
        updateZoom();
      }
    }, { passive: true });
  }

  clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  setActive(index) {
    index = Math.max(0, Math.min(this.slides.length - 1, index));
    this.currentIndex = index;

    this.slides.forEach((slide, k) => {
      const visible = k === index;
      slide.style.opacity = visible ? '1' : '0';
      slide.style.zIndex = visible ? 30 : (20 - k);
      slide.style.transform = visible ? 'translate3d(0,0,0) scale(1)' : 'translate3d(0,0,0) scale(0.98)';

      const overlay = slide.querySelector('.gallery-overlay');
      if (overlay) {
        overlay.style.filter = visible ? 'drop-shadow(0 6px 12px rgba(0,0,0,0.40))' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))';
        overlay.style.opacity = visible ? '0.98' : '0.9';
      }
    });

    this.dots.forEach(d => d.classList.remove('active'));
    if (this.dots[index]) {
      this.dots[index].classList.add('active');
    }

    this.updateEdgeShades();
  }

  updateEdgeShades() {
    if (this.shadeLeft) {
      this.shadeLeft.style.opacity = this.currentIndex === 0 ? 0 : 0.6;
    }
    if (this.shadeRight) {
      this.shadeRight.style.opacity = this.currentIndex === this.slides.length - 1 ? 0 : 0.6;
    }
  }

  setupEventListeners() {
    // Dot navigation
    this.dots.forEach(d => {
      d.addEventListener('click', () => {
        const i = parseInt(d.getAttribute('data-i'));
        this.setActive(i);
      });
    });

    // Pointer move for parallax effect
    this.container.addEventListener('pointermove', (e) => this.handlePointerMove(e));
    this.container.addEventListener('pointerleave', () => this.handlePointerLeave());

    // Click navigation
    this.container.addEventListener('click', (e) => this.handleClick(e));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' && this.currentIndex > 0) {
        this.setActive(this.currentIndex - 1);
      }
      if (e.key === 'ArrowRight' && this.currentIndex < this.slides.length - 1) {
        this.setActive(this.currentIndex + 1);
      }
    });
  }

  handlePointerMove(e) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = this.container.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    
    this.tmx = (e.clientX - cx) / rect.width;
    this.tmy = (e.clientY - cy) / rect.height;

    if (!this.rafPM) {
      this.rafPM = requestAnimationFrame(() => this.applyPointerMotion());
    }

    // Edge shade effect
    const center = rect.left + rect.width / 2;
    const halfRange = rect.width * 0.5;
    const leftStrength = this.clamp((center - e.clientX) / halfRange, 0, 1);
    const rightStrength = this.clamp((e.clientX - center) / halfRange, 0, 1);

    if (leftStrength > 0.02 && leftStrength > rightStrength) {
      if (this.shadeLeft) this.shadeLeft.style.opacity = this.clamp(leftStrength, 0, 0.9) * 0.6;
      if (this.shadeRight) this.shadeRight.style.opacity = 0;
    } else if (rightStrength > 0.02 && rightStrength > leftStrength) {
      if (this.shadeRight) this.shadeRight.style.opacity = this.clamp(rightStrength, 0, 0.9) * 0.6;
      if (this.shadeLeft) this.shadeLeft.style.opacity = 0;
    } else {
      if (this.shadeLeft) this.shadeLeft.style.opacity = 0;
      if (this.shadeRight) this.shadeRight.style.opacity = 0;
    }

    // Cursor style
    const leftZone = rect.left + rect.width * 0.12;
    const rightZone = rect.right - rect.width * 0.12;
    
    if (e.clientX < leftZone) {
      this.container.style.cursor = this.currentIndex > 0 ? 'w-resize' : 'not-allowed';
    } else if (e.clientX > rightZone) {
      this.container.style.cursor = this.currentIndex < this.slides.length - 1 ? 'e-resize' : 'not-allowed';
    } else {
      this.container.style.cursor = 'default';
    }
  }

  applyPointerMotion() {
    this.rafPM = null;
    this.pmx += (this.tmx - this.pmx) * 0.18;
    this.pmy += (this.tmy - this.pmy) * 0.18;

    this.slides.forEach((slide, k) => {
      const img = slide.querySelector('img');
      if (!img) return;

      const distanceIndex = k - this.currentIndex;
      const depth = k === this.currentIndex ? 110 : 32 + Math.abs(distanceIndex) * 14;
      
      let tx = this.pmx * depth * (distanceIndex * 0.28 + 1);
      let ty = this.pmy * depth * (Math.abs(distanceIndex) * 0.16 + 1);
      const scale = k === this.currentIndex ? 1.07 : 1.02;

      const rect = this.container.getBoundingClientRect();
      const baseW = rect.width * 1.10;
      const extra = baseW * (scale - 1);
      const maxShift = extra * 0.45;

      tx = this.clamp(tx, -maxShift, maxShift);
      ty = this.clamp(ty, -maxShift, maxShift);

      img.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;

      const translateOffset = distanceIndex * 18;
      slide.style.transform = `translate3d(${translateOffset}px, 0, 0)`;
    });

    if (Math.abs(this.tmx - this.pmx) > 0.002 || Math.abs(this.tmy - this.pmy) > 0.002) {
      this.rafPM = requestAnimationFrame(() => this.applyPointerMotion());
    }
  }

  handlePointerLeave() {
    this.slides.forEach((slide, k) => {
      const img = slide.querySelector('img');
      if (img) {
        img.style.transform = `translate3d(0,0,0) scale(${k === this.currentIndex ? 1.07 : 1.02})`;
      }
      slide.style.transform = 'translate3d(0,0,0)';
    });

    this.container.style.cursor = 'default';
    this.updateEdgeShades();
  }

  handleClick(e) {
    const rect = this.container.getBoundingClientRect();
    const leftZone = rect.left + rect.width * 0.12;
    const rightZone = rect.right - rect.width * 0.12;

    if (e.clientX < leftZone && this.currentIndex > 0) {
      this.setActive(this.currentIndex - 1);
    } else if (e.clientX > rightZone && this.currentIndex < this.slides.length - 1) {
      this.setActive(this.currentIndex + 1);
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new Gallery());
} else {
  new Gallery();
}

export { Gallery };
