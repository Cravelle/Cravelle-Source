/**
 * Services Slider (Car-gallery style)
 * Full-bleed carousel with swipe/drag, arrows, dots, and wrap-around
 */

class ServicesSlider {
  constructor() {
    this.slider = document.getElementById('servicesSlider');
    this.track = document.getElementById('servicesTrack');
    this.slides = this.track ? Array.from(this.track.querySelectorAll('.service-slide')) : [];
    this.prev = document.getElementById('svc2Prev');
    this.next = document.getElementById('svc2Next');
    this.dotsContainer = document.getElementById('svc2Dots');

    this.index = 0;
    this.startX = 0;
    this.currentX = 0;
    this.deltaX = 0;
    this.isDragging = false;
    this.width = 0;

    if (this.slider && this.track && this.slides.length) {
      this.init();
    }
  }

  init() {
    this.updateSize();
    this.buildDots();
    this.bindEvents();
    this.goTo(0, false);
  }

  updateSize() {
    this.width = this.slider.clientWidth;
  }

  buildDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    this.slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'svc2-dot' + (i === this.index ? ' active' : '');
      dot.addEventListener('click', () => this.goTo(i));
      this.dotsContainer.appendChild(dot);
    });
  }

  setActiveDot() {
    if (!this.dotsContainer) return;
    Array.from(this.dotsContainer.children).forEach((el, k) => {
      el.classList.toggle('active', k === this.index);
    });
  }

  bindEvents() {
    // Arrows - click anywhere in the gradient zone
    if (this.prev) {
      this.prev.addEventListener('click', () => this.goTo(this.index - 1));
      this.prev.style.cursor = 'pointer';
    }
    if (this.next) {
      this.next.addEventListener('click', () => this.goTo(this.index + 1));
      this.next.style.cursor = 'pointer';
    }

    // Resize
    window.addEventListener('resize', () => {
      this.updateSize();
      this.goTo(this.index, false);
    });

    // Drag/Swipe (pointer events)
    this.track.addEventListener('pointerdown', this.onPointerDown, { passive: true });
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('pointerup', this.onPointerUp, { passive: true });
    window.addEventListener('pointercancel', this.onPointerUp, { passive: true });

    // Keyboard (when slider is focused)
    this.slider.setAttribute('tabindex', '0');
    this.slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.goTo(this.index - 1);
      if (e.key === 'ArrowRight') this.goTo(this.index + 1);
    });
  }

  onPointerDown = (e) => {
    this.isDragging = true;
    this.startX = e.clientX;
    this.currentX = e.clientX;
    this.deltaX = 0;
    this.track.style.transition = 'none';
  }

  onPointerMove = (e) => {
    if (!this.isDragging) return;
    this.currentX = e.clientX;
    this.deltaX = this.currentX - this.startX;

    const base = -this.index * this.width;
    this.track.style.transform = `translate3d(${base + this.deltaX}px, 0, 0)`;
  }

  onPointerUp = () => {
    if (!this.isDragging) return;
    this.isDragging = false;

    const threshold = Math.min(200, this.width * 0.2);
    if (this.deltaX > threshold) {
      this.goTo(this.index - 1);
    } else if (this.deltaX < -threshold) {
      this.goTo(this.index + 1);
    } else {
      this.goTo(this.index);
    }
    this.deltaX = 0;
  }

  normalizeIndex(i) {
    const n = this.slides.length;
    if (n === 0) return 0;
    return (i + n) % n; // wrap-around
  }

  goTo(i, animate = true) {
    this.index = this.normalizeIndex(i);
    if (animate) {
      this.track.style.transition = 'transform var(--transition-slow) var(--ease-out)';
    } else {
      this.track.style.transition = 'none';
    }
    const x = -this.index * this.width;
    this.track.style.transform = `translate3d(${x}px, 0, 0)`;
    this.setActiveDot();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ServicesSlider());
} else {
  new ServicesSlider();
}

export { ServicesSlider };
