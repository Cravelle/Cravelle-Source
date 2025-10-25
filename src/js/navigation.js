/**
 * Navigation Module
 * Handles mobile menu, smooth scrolling, and navigation interactions
 */

class NavigationManager {
  constructor() {
    this.nav = document.querySelector('.nav');
    this.navLinks = document.getElementById('navLinks');
    this.hamburger = document.querySelector('.hamburger');
    this.init();
  }

  init() {
    this.setupSmoothScrolling();
    this.setupMobileMenu();
    this.setupLanguageMenu();
    this.setupHashHandler();
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#' || href === '#!') return;

        const id = href.replace('#', '');
        const element = document.getElementById(id);

        if (element) {
          e.preventDefault();
          this.scrollToElement(element);
          
          // Close mobile menu if open
          if (window.innerWidth <= 980 && this.navLinks) {
            this.navLinks.classList.remove('show');
            if (this.hamburger) {
              this.hamburger.setAttribute('aria-expanded', 'false');
            }
          }

          // Clean up hash from URL
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      });
    });
  }

  scrollToElement(element) {
    const navHeight = this.getNavHeight();
    const extraOffset = 12;
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetY = rect.top + scrollTop - navHeight - extraOffset;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
  }

  getNavHeight() {
    const navHeightVar = getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-height');
    return parseInt(navHeightVar) || 86;
  }

  setupMobileMenu() {
    if (!this.hamburger || !this.navLinks) return;

    this.hamburger.addEventListener('click', () => {
      this.navLinks.classList.toggle('show');
      const isExpanded = this.navLinks.classList.contains('show');
      this.hamburger.setAttribute('aria-expanded', String(isExpanded));
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.nav?.contains(e.target) && this.navLinks?.classList.contains('show')) {
        this.navLinks.classList.remove('show');
        if (this.hamburger) {
          this.hamburger.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // Close mobile menu on window resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 980 && this.navLinks?.classList.contains('show')) {
        this.navLinks.classList.remove('show');
        if (this.hamburger) {
          this.hamburger.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  setupLanguageMenu() {
    const languageGroup = document.getElementById('languageGroup');
    if (!languageGroup) return;

    // Close language menu when clicking outside
    document.addEventListener('click', (e) => {
      const menu = document.getElementById('language-menu');
      const toggle = document.getElementById('language-toggle');
      
      if (menu && toggle && !menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.style.display = 'none';
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Handle Escape key to close language menu
    languageGroup.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const menu = document.getElementById('language-menu');
        const toggle = document.getElementById('language-toggle');
        
        if (menu) menu.style.display = 'none';
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'false');
          toggle.focus();
        }
      }
    });
  }

  setupHashHandler() {
    // Remove hash on page load to prevent auto-scroll
    window.addEventListener('load', () => {
      if (location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
        window.scrollTo(0, 0);
      }
    });
  }
}

// Initialize navigation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new NavigationManager());
} else {
  new NavigationManager();
}

export { NavigationManager };
