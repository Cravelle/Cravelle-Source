// Logo Loop Animation Handler
class LogoLoop {
  constructor() {
    this.track = document.getElementById('logoLoopTrack');
    if (!this.track) return;
    
    this.init();
  }

  init() {
    // Clone the logo items to create seamless loop
    const items = Array.from(this.track.children);
    const itemCount = items.length;
    
    // Clone items multiple times for seamless infinite scroll
    // We need enough copies so the animation can loop smoothly
    const copies = 4; // Total will be original + 4 copies = 5 sets
    
    for (let i = 0; i < copies; i++) {
      items.forEach(item => {
        const clone = item.cloneNode(true);
        this.track.appendChild(clone);
      });
    }
    
    // Calculate the exact scroll distance for seamless loop
    // We want to move exactly by the width of one complete set
    const totalItems = itemCount * (copies + 1); // original + copies
    const percentagePerSet = 100 / (copies + 1);
    
    // Update CSS custom property for the animation
    this.track.style.setProperty('--scroll-distance', `-${percentagePerSet}%`);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new LogoLoop());
} else {
  new LogoLoop();
}

export default LogoLoop;
