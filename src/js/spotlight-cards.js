// Spotlight Card Effect - Based on https://reactbits.dev/components/spotlight-card

export function initSpotlightCards(selector = '.feature-card') {
  const cards = document.querySelectorAll(selector);
  
  cards.forEach(card => {
    card.style.setProperty('--mouse-x', '50%');
    card.style.setProperty('--mouse-y', '50%');
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// Auto-initialize on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initSpotlightCards();
  });
} else {
  initSpotlightCards();
}
