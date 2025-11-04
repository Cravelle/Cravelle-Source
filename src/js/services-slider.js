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
    this.hasMoved = false;
    this.width = 0;

    if (this.slider && this.track && this.slides.length) {
      this.init();
    }
  }

  init() {
    this.updateSize();
    this.buildDots();
    this.bindEvents();
    this.setupTouchEffects();
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

    // Drag/Swipe (pointer events and touch events for better mobile support)
    this.track.addEventListener('pointerdown', this.onPointerDown, { passive: false });
    this.track.addEventListener('touchstart', this.onPointerDown, { passive: false });
    window.addEventListener('pointermove', this.onPointerMove, { passive: false });
    window.addEventListener('touchmove', this.onPointerMove, { passive: false });
    window.addEventListener('pointerup', this.onPointerUp, { passive: true });
    window.addEventListener('touchend', this.onPointerUp, { passive: true });
    window.addEventListener('pointercancel', this.onPointerUp, { passive: true });
    window.addEventListener('touchcancel', this.onPointerUp, { passive: true });

    // Keyboard (when slider is focused)
    this.slider.setAttribute('tabindex', '0');
    this.slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.goTo(this.index - 1);
      if (e.key === 'ArrowRight') this.goTo(this.index + 1);
    });
  }

  onPointerDown = (e) => {
    // Don't interfere with link clicks
    if (e.target.closest('a, button')) return;
    
    // Get coordinates from either pointer or touch event
    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    
    if (clientX === 0) return;
    
    this.isDragging = true;
    this.hasMoved = false;
    this.startX = clientX;
    this.currentX = this.startX;
    this.deltaX = 0;
    this.track.style.transition = 'none';
  }

  onPointerMove = (e) => {
    if (!this.isDragging) return;
    
    // Get coordinates from either pointer or touch event
    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    
    if (clientX === 0) return;
    
    this.currentX = clientX;
    this.deltaX = this.currentX - this.startX;
    
    // Only prevent default and mark as moved if actual dragging occurs
    if (Math.abs(this.deltaX) > 5) {
      this.hasMoved = true;
      // Only prevent default if the event is cancelable
      if (e.cancelable) {
        e.preventDefault();
      }
    }

    const base = -this.index * this.width;
    this.track.style.transform = `translate3d(${base + this.deltaX}px, 0, 0)`;
  }

  onPointerUp = () => {
    if (!this.isDragging) return;
    this.isDragging = false;

    // If user didn't move, don't change slides (allow clicks to work)
    if (!this.hasMoved) {
      this.hasMoved = false;
      return;
    }

    // Adjust threshold for mobile - easier to trigger slide change
    const isMobile = window.innerWidth <= 768;
    const baseThreshold = isMobile ? this.width * 0.15 : this.width * 0.2;
    const threshold = Math.min(200, baseThreshold);
    
    if (this.deltaX > threshold) {
      this.goTo(this.index - 1);
    } else if (this.deltaX < -threshold) {
      this.goTo(this.index + 1);
    } else {
      this.goTo(this.index);
    }
    this.deltaX = 0;
    this.hasMoved = false;
  }

  normalizeIndex(i) {
    const n = this.slides.length;
    if (n === 0) return 0;
    return (i + n) % n; // wrap-around
  }

  setupTouchEffects() {
    // Add touch active state for service cards on mobile
    const cards = this.track.querySelectorAll('.service-card');
    cards.forEach(card => {
      let touchTimer;
      
      card.addEventListener('touchstart', (e) => {
        // Don't activate if touching a link/button
        if (e.target.closest('a, button')) return;
        
        touchTimer = setTimeout(() => {
          card.classList.add('touch-active');
        }, 100);
      }, { passive: true });
      
      card.addEventListener('touchend', () => {
        clearTimeout(touchTimer);
        setTimeout(() => {
          card.classList.remove('touch-active');
        }, 300);
      }, { passive: true });
      
      card.addEventListener('touchcancel', () => {
        clearTimeout(touchTimer);
        card.classList.remove('touch-active');
      }, { passive: true });
    });
  }

  goTo(i, animate = true) {
    this.index = this.normalizeIndex(i);
    if (animate) {
      // Use slower transition on mobile for smoother experience
      const isMobile = window.innerWidth <= 768;
      const duration = isMobile ? '600ms' : '400ms';
      this.track.style.transition = `transform ${duration} cubic-bezier(0.4, 0, 0.2, 1)`;
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
