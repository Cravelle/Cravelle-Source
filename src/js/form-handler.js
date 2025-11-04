class FormHandler {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.emailInput = document.getElementById('contactEmail');
    this.messageInput = document.getElementById('contactMessage');
    this.sendButton = document.getElementById('sendBtn');

    if (this.form) {
      this.init();
    }
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  handleSubmit(e) {
    e.preventDefault();

    const email = this.emailInput?.value.trim();
    const message = this.messageInput?.value.trim();

    if (!email || !message) {
      alert('Please provide both email and message.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please provide a valid email address.');
      return;
    }

    if (this.sendButton) {
      this.sendButton.disabled = true;
      const icon = document.createElement('i');
      icon.className = 'fas fa-spinner fa-spin';
      icon.setAttribute('aria-hidden', 'true');
      const span = document.createElement('span');
      span.textContent = 'Sending...';
      this.sendButton.textContent = '';
      this.sendButton.appendChild(icon);
      this.sendButton.appendChild(document.createTextNode(' '));
      this.sendButton.appendChild(span);
    }

    setTimeout(() => {
      if (this.sendButton) {
        this.sendButton.disabled = false;
        const icon = document.createElement('i');
        icon.className = 'fas fa-paper-plane';
        icon.setAttribute('aria-hidden', 'true');
        const span = document.createElement('span');
        span.textContent = 'Send Message';
        this.sendButton.textContent = '';
        this.sendButton.appendChild(icon);
        this.sendButton.appendChild(document.createTextNode(' '));
        this.sendButton.appendChild(span);
      }

      alert('Thanks — your message was sent successfully!');

      if (this.emailInput) this.emailInput.value = '';
      if (this.messageInput) this.messageInput.value = '';
    }, 900);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new FormHandler());
} else {
  new FormHandler();
}

window.handleContactSubmit = (e) => {
  e.preventDefault();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new FormHandler());
} else {
  new FormHandler();
}

window.handleContactSubmit = (e) => {
  e.preventDefault();
  new FormHandler().handleSubmit(e);
};

export { FormHandler };