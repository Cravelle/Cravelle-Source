/**
 * Theme Management Module
 * Handles dark/light theme switching with system preference detection
 */

const THEME_KEY = 'site-theme';
const THEME_ATTR = 'data-theme';

class ThemeManager {
  constructor() {
    this.themes = ['auto', 'light', 'dark'];
    this.currentTheme = this.getStoredTheme();
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.setupListeners();
  }

  getStoredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    return this.themes.includes(stored) ? stored : 'auto';
  }

  setStoredTheme(theme) {
    if (theme === 'auto') {
      localStorage.removeItem(THEME_KEY);
    } else {
      localStorage.setItem(THEME_KEY, theme);
    }
  }

  applyTheme(theme) {
    const html = document.documentElement;
    
    if (theme === 'auto') {
      const systemDark = this.mediaQuery.matches;
      html.setAttribute(THEME_ATTR, systemDark ? 'dark' : 'light');
      this.setStoredTheme('auto');
    } else {
      html.setAttribute(THEME_ATTR, theme);
      this.setStoredTheme(theme);
    }
    
    this.currentTheme = theme;
    this.updateIcon(theme);
    this.dispatchThemeChange(theme);
  }

  cycleTheme() {
    const currentIndex = this.themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % this.themes.length;
    this.applyTheme(this.themes[nextIndex]);
  }

  updateIcon(theme) {
    const svg = document.getElementById('themeIcon');
    if (!svg) return;

    const icons = {
      auto: `
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" fill="none" stroke="currentColor" stroke-width="1.6"/>
        <path d="M12 2v20" stroke="currentColor" stroke-width="1.6"/>
        <circle cx="8" cy="12" r="3" fill="currentColor"/>
        <path d="M15 8a4 4 0 010 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M6.5 6.5l1.2 1.2M6 12H4.6M6.5 17.5l1.2-1.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      `,
      light: `
        <circle cx="12" cy="12" r="4" fill="currentColor"/>
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      `,
      dark: '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/>'
    };

    svg.innerHTML = icons[theme] || icons.auto;
  }

  setupListeners() {
    // Watch for system theme changes if on auto mode
    this.mediaQuery.addEventListener('change', () => {
      if (this.currentTheme === 'auto') {
        this.applyTheme('auto');
      }
    });
  }

  dispatchThemeChange(theme) {
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }
}

// Export singleton instance
export const themeManager = new ThemeManager();

// Expose global function for inline handlers (if needed)
window.cycleTheme = () => themeManager.cycleTheme();
