const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
}, { passive: true });

const hero = document.querySelector('.hero-banner');
if (hero) {
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    hero.style.setProperty('--scroll-y', scrollY);
  }, { passive: true });
}

const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    
    card.style.setProperty('--mx', `${percentX}%`);
    card.style.setProperty('--my', `${percentY}%`);
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '50%');
  });
});

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(30px)';
  section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
  observer.observe(section);
});

const brandValues = document.querySelectorAll('.brand-values > div');
brandValues.forEach((value, index) => {
  value.style.opacity = '0';
  value.style.transform = 'translateY(20px)';
  value.style.transition = `opacity 0.6s ease-out ${index * 0.15}s, transform 0.6s ease-out ${index * 0.15}s`;
  
  const valueObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  valueObserver.observe(value);
});

const animateCounter = (element, target, suffix = '') => {
  const duration = 2000;
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + suffix;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + suffix;
    }
  }, 16);
};

const statCards = document.querySelectorAll('.stat-card');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      const valueElement = entry.target.querySelector('[data-counter]');
      if (valueElement) {
        const target = parseInt(valueElement.dataset.target);
        const suffix = valueElement.dataset.suffix || '';
        animateCounter(valueElement, target, suffix);
        entry.target.dataset.animated = 'true';
      }
    }
  });
}, { threshold: 0.5 });

statCards.forEach(card => statsObserver.observe(card));

export { observer };
