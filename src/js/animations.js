class AnimationsManager {
  constructor() {
    this.initCounters();
  }

  initCounters() {
    const elements = Array.from(document.querySelectorAll('[data-counter]'));
    if (!elements.length || !('IntersectionObserver' in window)) return;

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const startCount = (el) => {
      const target = parseFloat(el.getAttribute('data-target') || '0') || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1200 + Math.random() * 600;
      const start = performance.now();

      const frame = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const value = Math.floor(target * easeOut(progress));
        el.textContent = value.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(frame);
        }
      };

      requestAnimationFrame(frame);
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    elements.forEach(el => observer.observe(el));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new AnimationsManager());
} else {
  new AnimationsManager();
}

export { AnimationsManager };
