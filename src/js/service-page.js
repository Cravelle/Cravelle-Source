/**
 * Service Page Module
 * Handles shared functionality for all service pages
 */

class ServicePage {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupContactLinks();
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.feature-card, .service-section').forEach((el) => {
      observer.observe(el);
    });
  }

  setupContactLinks() {
    document.querySelectorAll('a[href="#contact"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/#contact';
      });
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ServicePage());
} else {
  new ServicePage();
}

export default ServicePage;
