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
    if (!this.hamburger) return;

    const staggeredMenu = document.getElementById('staggeredMenu');
    if (!staggeredMenu) return;

    this.hamburger.addEventListener('click', () => {
      const isOpen = staggeredMenu.classList.contains('is-open');
      
      if (isOpen) {
        staggeredMenu.classList.add('is-closing');
        setTimeout(() => {
          staggeredMenu.classList.remove('is-open', 'is-closing');
        }, 300);
        this.hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      } else {
        staggeredMenu.classList.add('is-open');
        this.hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close menu on link click
    const menuLinks = staggeredMenu.querySelectorAll('.staggered-menu__link');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        staggeredMenu.classList.add('is-closing');
        setTimeout(() => {
          staggeredMenu.classList.remove('is-open', 'is-closing');
        }, 300);
        this.hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!this.nav?.contains(e.target) && 
          !staggeredMenu.contains(e.target) && 
          staggeredMenu.classList.contains('is-open')) {
        staggeredMenu.classList.add('is-closing');
        setTimeout(() => {
          staggeredMenu.classList.remove('is-open', 'is-closing');
        }, 300);
        this.hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 980 && staggeredMenu.classList.contains('is-open')) {
        staggeredMenu.classList.remove('is-open', 'is-closing');
        this.hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
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
        const hash = location.hash.slice(1);
        const targetElement = document.getElementById(hash);
        
        if (targetElement) {
          // Scroll to the section if it exists
          setTimeout(() => {
            this.scrollToElement(targetElement);
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }, 100);
        } else {
          // Clear hash if section doesn't exist
          history.replaceState(null, '', window.location.pathname + window.location.search);
          window.scrollTo(0, 0);
        }
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
