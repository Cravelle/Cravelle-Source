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
    this.setupScrollSpy();
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
          
          if (window.innerWidth <= 980 && this.navLinks) {
            this.navLinks.classList.remove('show');
            if (this.hamburger) {
              this.hamburger.setAttribute('aria-expanded', 'false');
            }
          }

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

    document.addEventListener('click', (e) => {
      if (!this.nav?.contains(e.target) && this.navLinks?.classList.contains('show')) {
        this.navLinks.classList.remove('show');
        if (this.hamburger) {
          this.hamburger.setAttribute('aria-expanded', 'false');
        }
      }
    });

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

    document.addEventListener('click', (e) => {
      const menu = document.getElementById('language-menu');
      const toggle = document.getElementById('language-toggle');
      
      if (menu && toggle && !menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.style.display = 'none';
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

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
    window.addEventListener('load', () => {
      if (location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
        window.scrollTo(0, 0);
      }
    });
  }

  setupScrollSpy() {
    const linkMap = new Map();
    const links = document.querySelectorAll('.nav__links a.nav__link[href^="#"]');
    links.forEach(link => {
      const id = link.getAttribute('href')?.slice(1);
      if (id) linkMap.set(id, link);
    });

    const sections = Array.from(linkMap.keys())
      .map(id => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return;

    const onIntersect = (entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const link = id ? linkMap.get(id) : null;
        if (!link) return;

        if (entry.isIntersecting) {
          links.forEach(l => {
            l.classList.remove('active');
            l.removeAttribute('aria-current');
          });
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      });
    };

    const observer = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0.01
    });
    sections.forEach(sec => observer.observe(sec));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new NavigationManager());
} else {
  new NavigationManager();
}

export { NavigationManager };
