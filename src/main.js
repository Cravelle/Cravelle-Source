/**
 * Main Application Entry Point
 * Imports all modules and initializes the application
 */

// Import CSS (single entry point)
import './css/main.css';

// Import JavaScript modules
import { i18nManager } from './js/i18n.js';
import './js/navigation.js';
import './js/gallery.js';
import './js/services-carousel.js';
import './js/services-slider.js';
import './js/map.js';
import './js/form-handler.js';
import './js/animations.js';
import './js/premium-interactions.js';
import './js/faq.js';
import './js/partners.js';

// Initialize application
class App {
  constructor() {
    this.init();
  }

  async init() {
    // Initialize i18n
    await i18nManager.init();

    // Add any additional initialization here
    this.setupEventListeners();
  }

  setupEventListeners() {
    // (Theme removed)

    // Listen for language changes
    window.addEventListener('languagechange', (e) => {
      console.log('Language changed to:', e.detail.lang);
    });
  }
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new App());
} else {
  new App();
}

// Expose globally for debugging (dev only)
if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
  window.__app = { i18nManager };
}
