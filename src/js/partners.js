class PartnersScroll {
  constructor() {
    this.container = document.querySelector('.collab-logos');
    if (!this.container) return;
    
    this.init();
  }

  init() {
    const logos = Array.from(this.container.children);
    
    for (let i = 0; i < 3; i++) {
      logos.forEach(logo => {
        const clone = logo.cloneNode(true);
        this.container.appendChild(clone);
      });
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new PartnersScroll());
} else {
  new PartnersScroll();
}

export default PartnersScroll;
