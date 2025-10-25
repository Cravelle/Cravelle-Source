/**
 * Main Application Entry Point
 * Imports all modules and initializes the application
 */

// Import CSS (single entry point)
import './css/main.css';

// Import JavaScript modules
import { themeManager } from './js/theme.js';
import { i18nManager } from './js/i18n.js';
import './js/navigation.js';
import './js/background.js';
import './js/gallery.js';
import './js/services-carousel.js';
import './js/map.js';
import './js/form-handler.js';
import './js/animations.js';

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
    // Listen for theme changes
    window.addEventListener('themechange', (e) => {
      console.log('Theme changed to:', e.detail.theme);
    });

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
  window.__app = { themeManager, i18nManager };
}
