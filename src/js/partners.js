/**
 * Partners Logo Auto-Scroll
 * Duplicates logos for seamless infinite scrolling animation
 */

class PartnersScroll {
  constructor() {
    this.container = document.querySelector('.collab-logos');
    if (!this.container) return;
    
    this.init();
  }

  init() {
    // Duplicate logos for seamless loop
    const logos = Array.from(this.container.children);
    
    // Clone and append logos multiple times for smooth infinite scroll
    for (let i = 0; i < 3; i++) {
      logos.forEach(logo => {
        const clone = logo.cloneNode(true);
        this.container.appendChild(clone);
      });
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new PartnersScroll());
} else {
  new PartnersScroll();
}

export default PartnersScroll;
