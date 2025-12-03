import './css/main.css';

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
import './js/security.js';
import './js/blur-text-init.js';
import './js/logo-loop.js';

class App {
  constructor() {
    this.init();
  }

  async init() {
    await i18nManager.init();
    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('languagechange', (e) => {
      console.log('Language changed to:', e.detail.lang);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new App());
} else {
  new App();
}

if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
  window.__app = { i18nManager };
}
