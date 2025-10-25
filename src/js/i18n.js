/**
 * Internationalization (i18n) Module
 * Handles multi-language support with dynamic content loading
 */

const I18N_KEY = 'selectedLanguage';
const SUPPORTED_LANGS = new Set(['en', 'ar', 'pl', 'tr']);
const DEFAULT_LANG = 'en';

class I18nManager {
  constructor() {
    this.translations = {};
    this.baseTexts = {};
    this.currentLang = this.getStoredLanguage();
    this.defaultTitle = document.title;
    this.defaultSlogan = this.getDefaultSlogan();
  }

  getStoredLanguage() {
    const stored = localStorage.getItem(I18N_KEY);
    return SUPPORTED_LANGS.has(stored) ? stored : DEFAULT_LANG;
  }

  getDefaultSlogan() {
    const mottoEl = document.getElementById('motto');
    return mottoEl ? mottoEl.textContent : '';
  }

  async loadTranslations(lang) {
    if (lang === DEFAULT_LANG) {
      this.translations = {};
      this.updatePage();
      return;
    }

    const timestamp = Date.now();
    const possiblePaths = this.getTranslationPaths(lang, timestamp);
    
    for (const path of possiblePaths) {
      try {
        const response = await fetch(path, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          this.translations = await response.json();
          console.info('Translations loaded from', path);
          this.updatePage();
          return;
        }
      } catch (err) {
        console.warn('Failed to load from', path, err);
      }
    }

    console.warn('All translation attempts failed for', lang);
    this.translations = {};
    this.updatePage();
  }

  getTranslationPaths(lang, timestamp) {
    const paths = [
      `lang/${lang}.json?v=${timestamp}`,
      `/lang/${lang}.json?v=${timestamp}`
    ];

    // Add relative path for service pages
    if (window.location.pathname.includes('/services/')) {
      paths.unshift(`../lang/${lang}.json?v=${timestamp}`);
    }

    // Add absolute URL
    paths.push(new URL(`lang/${lang}.json`, location.href).href + `?v=${timestamp}`);

    return paths;
  }

  updatePage() {
    const isEnglish = this.currentLang === DEFAULT_LANG;

    // Update all elements with data-key attribute
    document.querySelectorAll('[data-key]').forEach(el => {
      const key = el.getAttribute('data-key');
      
      // Store base text on first run
      if (!(key in this.baseTexts)) {
        this.baseTexts[key] = el.tagName === 'A' ? el.textContent : el.innerHTML;
      }

      const translated = this.translations[key];
      const base = this.baseTexts[key];
      const value = isEnglish ? base : (translated !== undefined ? translated : base);

      if (value !== undefined) {
        if (el.tagName === 'A') {
          el.textContent = String(value).split(':')[0].trim();
        } else {
          el.innerHTML = value;
        }
      }
    });

    // Update document title
    if (isEnglish) {
      document.title = this.defaultTitle;
    } else if (this.translations.title) {
      document.title = this.translations.title;
    }

    // Update motto/slogan
    const mottoEl = document.getElementById('motto');
    if (mottoEl) {
      mottoEl.textContent = isEnglish ? this.defaultSlogan : (this.translations.slogan || this.defaultSlogan);
    }

    // Update document direction for RTL languages
    this.updateDirection();
    
    // Update language tag
    document.documentElement.setAttribute('lang', this.currentLang);
  }

  updateDirection() {
    const html = document.documentElement;
    if (this.currentLang === 'ar') {
      html.setAttribute('dir', 'rtl');
    } else {
      html.setAttribute('dir', 'ltr');
    }
  }

  async changeLanguage(lang) {
    if (!SUPPORTED_LANGS.has(lang)) {
      console.warn('Unsupported language:', lang);
      return;
    }

    this.currentLang = lang;
    localStorage.setItem(I18N_KEY, lang);
    await this.loadTranslations(lang);
    
    // Update language toggle button
    this.updateLanguageToggle(lang);
    
    // Close language menu
    const menu = document.getElementById('language-menu');
    if (menu) menu.style.display = 'none';

    // Dispatch language change event
    window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
  }

  updateLanguageToggle(lang) {
    const toggle = document.getElementById('language-toggle');
    if (!toggle) return;

    const flagUrl = this.getFlagUrl(lang);
    const langName = this.getLanguageName(lang);
    
    toggle.innerHTML = `<img src="${flagUrl}" alt="${lang}" class="language-toggle__flag"> ${langName}`;
  }

  getFlagUrl(lang) {
    const flags = {
      'en': 'https://flagcdn.com/w20/gb.png',
      'ar': 'https://flagcdn.com/w20/eg.png',
      'pl': 'https://flagcdn.com/w20/pl.png',
      'tr': 'https://flagcdn.com/w20/tr.png'
    };
    return flags[lang] || flags[DEFAULT_LANG];
  }

  getLanguageName(code) {
    const names = {
      'en': 'English',
      'ar': 'العربية',
      'pl': 'Polski',
      'tr': 'Türkçe'
    };
    return names[code] || 'English';
  }

  async init() {
    await this.loadTranslations(this.currentLang);
    this.updateLanguageToggle(this.currentLang);
  }
}

// Export singleton instance
export const i18nManager = new I18nManager();

// Expose global functions for inline handlers (if needed)
window.changeLanguage = (lang) => i18nManager.changeLanguage(lang);
window.toggleLanguageMenu = () => {
  const menu = document.getElementById('language-menu');
  const toggle = document.getElementById('language-toggle');
  if (!menu || !toggle) return;

  const isOpen = menu.style.display === 'block';
  menu.style.display = isOpen ? 'none' : 'block';
  toggle.setAttribute('aria-expanded', String(!isOpen));
};
