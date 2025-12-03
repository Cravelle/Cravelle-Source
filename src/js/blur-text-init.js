// Initialize blur text effect on motto
document.addEventListener('DOMContentLoaded', () => {
  const motto = document.getElementById('motto');
  if (!motto) return;

  const text = motto.textContent.trim();
  const words = text.split(' ');
  
  motto.innerHTML = words.map(word => 
    `<span class="blur-text-word">${word}</span>`
  ).join(' ');
});
