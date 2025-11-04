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
    this.isLoading = false;
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
          },
          signal: AbortSignal.timeout(5000)
        });

        if (response.ok) {
          this.translations = await response.json();
          console.info('Translations loaded from', path);
          this.updatePage();
          return;
        }
      } catch (err) {
        if (err.name === 'TimeoutError') {
          console.warn('Timeout loading from', path);
        } else {
          console.warn('Failed to load from', path, err);
        }
        continue;
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

    if (window.location.pathname.includes('/services/')) {
      paths.unshift(`../lang/${lang}.json?v=${timestamp}`);
    }

    paths.push(new URL(`lang/${lang}.json`, location.href).href + `?v=${timestamp}`);

    return paths;
  }

  updatePage() {
    const isEnglish = this.currentLang === DEFAULT_LANG;

    document.querySelectorAll('[data-key]').forEach(el => {
      const key = el.getAttribute('data-key');
      
      if (!(key in this.baseTexts)) {
        this.baseTexts[key] = el.textContent;
      }

      const translated = this.translations[key];
      const base = this.baseTexts[key];
      const value = isEnglish ? base : (translated !== undefined ? translated : base);

      if (value !== undefined) {
        if (el.tagName === 'A') {
          el.textContent = String(value).split(':')[0].trim();
        } else {
          el.textContent = value;
        }
      }
    });

    if (isEnglish) {
      document.title = this.defaultTitle;
    } else if (this.translations.title) {
      document.title = this.translations.title;
    }

    const mottoEl = document.getElementById('motto');
    if (mottoEl) {
      mottoEl.textContent = isEnglish ? this.defaultSlogan : (this.translations.slogan || this.defaultSlogan);
    }

    this.updateDirection();
    
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

    if (this.isLoading) {
      console.log('Language change already in progress, skipping...');
      return;
    }

    if (this.currentLang === lang) {
      console.log('Already on language:', lang);
      this.closeLanguageMenu();
      return;
    }

    this.isLoading = true;
    this.currentLang = lang;
    localStorage.setItem(I18N_KEY, lang);
    
    try {
      await this.loadTranslations(lang);
      
      this.updateLanguageToggle(lang);
      
      this.closeLanguageMenu();

      window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      this.isLoading = false;
    }
  }

  closeLanguageMenu() {
    const menu = document.getElementById('language-menu');
    if (menu) {
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
    }
    
    const toggle = document.getElementById('language-toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
    }
  }

  updateLanguageToggle(lang) {
    const toggle = document.getElementById('language-toggle');
    if (!toggle) return;

    const flagUrl = this.getFlagUrl(lang);
    const langName = this.getLanguageName(lang);
    
    toggle.textContent = '';
    const img = document.createElement('img');
    img.src = flagUrl;
    img.alt = lang;
    img.className = 'language-toggle__flag';
    toggle.appendChild(img);
    toggle.appendChild(document.createTextNode(' ' + langName));
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

export const i18nManager = new I18nManager();

window.changeLanguage = (lang) => {
  if (window._langChangeTimeout) {
    clearTimeout(window._langChangeTimeout);
  }
  window._langChangeTimeout = setTimeout(() => {
    i18nManager.changeLanguage(lang);
  }, 100);
};

window.toggleLanguageMenu = () => {
  const menu = document.getElementById('language-menu');
  const toggle = document.getElementById('language-toggle');
  if (!menu || !toggle) return;

  const isOpen = menu.classList.contains('is-open');
  menu.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(!isOpen));
  menu.setAttribute('aria-hidden', String(isOpen));
};

document.addEventListener('click', (e) => {
  const menu = document.getElementById('language-menu');
  const languageGroup = document.getElementById('languageGroup');
  
  if (menu && languageGroup && !languageGroup.contains(e.target)) {
    menu.classList.remove('is-open');
    const toggle = document.getElementById('language-toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    }
  }
}, { passive: true });
