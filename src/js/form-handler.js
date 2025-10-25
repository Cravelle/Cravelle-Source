/**
 * Form Handler Module
 * Handles contact form submission
 */

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

    // Basic validation
    if (!email || !message) {
      alert('Please provide both email and message.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please provide a valid email address.');
      return;
    }

    // Disable button and show loading state
    if (this.sendButton) {
      this.sendButton.disabled = true;
      this.sendButton.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> <span>Sending...</span>';
    }

    // Simulate sending (replace with actual API call)
    setTimeout(() => {
      // Reset button
      if (this.sendButton) {
        this.sendButton.disabled = false;
        this.sendButton.innerHTML = '<i class="fas fa-paper-plane" aria-hidden="true"></i> <span>Send Message</span>';
      }

      // Show success message
      alert('Thanks — your message was sent successfully!');

      // Clear form
      if (this.emailInput) this.emailInput.value = '';
      if (this.messageInput) this.messageInput.value = '';
    }, 900);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new FormHandler());
} else {
  new FormHandler();
}

// Expose global function for inline handlers (if needed)
window.handleContactSubmit = (e) => {
  e.preventDefault();
  const handler = new FormHandler();
  handler.handleSubmit(e);
};

export { FormHandler };
