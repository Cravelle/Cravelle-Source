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
    // Validate form inputs
    const email = this.emailInput?.value.trim();
    const message = this.messageInput?.value.trim();

    if (!email || !message) {
      e.preventDefault();
      alert('Please provide both email and message.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      e.preventDefault();
      alert('Please provide a valid email address.');
      return;
    }

    // Show loading state
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

    // Let Netlify handle the actual form submission
    // The form will be submitted naturally to Netlify Forms
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
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new FormHandler());
} else {
  new FormHandler();
}

export { FormHandler };