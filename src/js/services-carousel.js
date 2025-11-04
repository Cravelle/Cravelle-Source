class ServicesCarousel {
  constructor() {
    this.grid = document.getElementById('servicesGrid');
    this.prev = document.getElementById('svcPrev');
    this.next = document.getElementById('svcNext');
    this.dotsContainer = document.getElementById('svcDots');
    this.shadeLeft = document.getElementById('servicesShadeLeft');
    this.shadeRight = document.getElementById('servicesShadeRight');
    this.currentIndex = 0;

    if (this.grid) {
      this.init();
    }
  }

  init() {
    if (this.grid) {
      this.grid.style.touchAction = 'pan-x pan-y';
    }

    this.setupServiceCardEffects();
    this.buildDots();
    this.setupEventListeners();
    this.goToPage(0);
  }

  isMobile() {
    return window.innerWidth <= 640;
  }

  getPages() {
    if (!this.grid) return { pages: 1, viewport: 0 };
    
    const viewport = this.grid.parentElement.clientWidth;
    const total = this.grid.scrollWidth;
    const pages = Math.max(1, Math.ceil(total / viewport));
    
    return { pages, viewport };
  }

  buildDots() {
    if (!this.dotsContainer) return;

    if (this.isMobile()) {
      this.dotsContainer.innerHTML = '';
      this.dotsContainer.style.display = 'none';
      return;
    }

    const { pages } = this.getPages();
    this.dotsContainer.innerHTML = '';

    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('div');
      dot.className = 'svc-dot' + (i === this.currentIndex ? ' active' : '');
      dot.dataset.i = String(i);
      dot.addEventListener('click', () => this.goToPage(i));
      this.dotsContainer.appendChild(dot);
    }

    this.dotsContainer.style.display = pages > 1 ? 'flex' : 'none';
    this.updateArrows();
  }

  goToPage(index) {
    if (this.isMobile()) return;

    const { pages, viewport } = this.getPages();
    this.currentIndex = Math.max(0, Math.min(pages - 1, index));

    if (this.grid) {
      this.grid.scrollTo({
        left: this.currentIndex * viewport,
        behavior: 'smooth'
      });
    }

    if (this.dotsContainer) {
      Array.from(this.dotsContainer.children).forEach((el, k) => {
        el.classList.toggle('active', k === this.currentIndex);
      });
    }

    this.updateArrows();
  }

  updateArrows() {
    const { pages } = this.getPages();

    if (!this.prev || !this.next) return;

    if (this.isMobile()) {
      this.prev.style.display = 'none';
      this.next.style.display = 'none';
      return;
    }

    this.prev.style.display = this.currentIndex <= 0 ? 'none' : 'flex';
    this.next.style.display = this.currentIndex >= pages - 1 ? 'none' : 'flex';
  }

  setupEventListeners() {
    if (this.prev) {
      this.prev.addEventListener('click', () => this.goToPage(this.currentIndex - 1));
    }

    if (this.next) {
      this.next.addEventListener('click', () => this.goToPage(this.currentIndex + 1));
    }

    window.addEventListener('resize', () => {
      this.buildDots();
      if (!this.isMobile()) {
        this.goToPage(this.currentIndex);
      }
    });
  }

  setupServiceCardEffects() {
    const serviceCards = Array.from(document.querySelectorAll('.service-card'));
    
    serviceCards.forEach(card => {
      let rect = null;
      let tx = 0, ty = 0, rX = 0, rY = 0;
      let ttx = 0, tty = 0, trX = 0, trY = 0;
      let raf = null;

      const clampDeg = (v) => Math.max(-10, Math.min(10, v));

      const onMove = (e) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        rect = rect || card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        ttx = (x - 0.5) * 22;
        tty = (y - 0.5) * 16;
        trY = clampDeg((x - 0.5) * 12);
        trX = clampDeg(-(y - 0.5) * 12);

        const sheen = card.querySelector('.card-sheen');
        if (sheen) {
          sheen.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
          sheen.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
          sheen.style.opacity = '1';
        }

        if (!raf) {
          raf = requestAnimationFrame(applyTilt);
        }
      };

      const applyTilt = () => {
        raf = null;
        tx += (ttx - tx) * 0.15;
        ty += (tty - ty) * 0.15;
        rX += (trX - rX) * 0.15;
        rY += (trY - rY) * 0.15;

        card.style.transform = `translate3d(0,0,0) rotateX(${rX}deg) rotateY(${rY}deg)`;

        const bg = card.querySelector('.card-bg');
        if (bg) {
          bg.style.transform = `translate3d(${(-tx * 0.35).toFixed(2)}px, ${(-ty * 0.35).toFixed(2)}px, -36px) scale(1.12)`;
        }
      };

      const onLeave = () => {
        rect = null;
        ttx = tty = trX = trY = 0;

        const sheen = card.querySelector('.card-sheen');
        if (sheen) sheen.style.opacity = '0';

        card.style.transform = 'translate3d(0,0,0) rotateX(0deg) rotateY(0deg)';

        const bg = card.querySelector('.card-bg');
        if (bg) {
          bg.style.transform = 'translate3d(0,0,-36px) scale(1.12)';
        }
      };

      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerleave', onLeave);
    });
  }
}

function equalizeServiceCards() {
  const hasStrip = !!document.querySelector('.services-strip');
  if (!hasStrip) return;

  const cards = Array.from(document.querySelectorAll('.services-strip .service-card'));
  if (!cards.length) return;

  let max = 0;
  cards.forEach(c => {
    c.style.minHeight = '';
    const h = c.getBoundingClientRect().height;
    if (h > max) max = h;
  });

  const minHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--card-min-height')) || 360;
  cards.forEach(c => {
    c.style.minHeight = Math.max(max, minHeight) + 'px';
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ServicesCarousel();
    equalizeServiceCards();
  });
} else {
  new ServicesCarousel();
  equalizeServiceCards();
}

window.addEventListener('load', equalizeServiceCards);
window.addEventListener('resize', () => {
  setTimeout(equalizeServiceCards, 160);
});

export { ServicesCarousel, equalizeServiceCards };
