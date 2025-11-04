class FAQ {
  constructor() {
    this.items = Array.from(document.querySelectorAll('.faq-item'));
    if (this.items.length) this.init();
  }

  init() {
    this.items.forEach(item => {
      const header = item.querySelector('h4');
      const body = item.querySelector('p');
      if (!header || !body) return;

      const id = header.textContent.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
      const panelId = `faq-panel-${id}`;
      body.id = panelId;
      body.hidden = true;

      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');
      header.setAttribute('aria-controls', panelId);
      header.setAttribute('aria-expanded', 'false');

      const toggle = () => {
        const expanded = header.getAttribute('aria-expanded') === 'true';
        header.setAttribute('aria-expanded', String(!expanded));
        body.hidden = expanded;
      };

      header.addEventListener('click', toggle);
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new FAQ());
} else {
  new FAQ();
}

export { FAQ };
