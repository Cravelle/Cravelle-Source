/**
 * Map Module
 * Handles Leaflet map initialization with location markers
 */

class MapManager {
  constructor() {
    this.mapElement = document.getElementById('map');
    this.map = null;
    this.baseLayer = null;
    this.markers = [];

    if (this.mapElement && window.L) {
      this.init();
    }
  }

  init() {
    // Initialize map
    this.map = L.map(this.mapElement, {
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: false
    });

    // Apply initial tiles (fixed palette)
    this.applyTiles();

    // Add locations
    this.addLocations();

    // Setup event listeners
    this.setupEventListeners();
  }

  applyTiles() {
    if (!this.map) return;
    // Use a fixed dark tile layer to match site palette
    const nextLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 20
    });
    if (this.baseLayer) this.map.removeLayer(this.baseLayer);
    this.baseLayer = nextLayer.addTo(this.map);
  }

  addLocations() {
    const locations = [
      {
        name: 'Dubai, UAE',
        desc: 'Strategic partnerships and business development',
        lat: 25.2048,
        lng: 55.2708
      },
      {
        name: 'Cairo, Egypt',
        desc: 'Regional diplomatic and cultural initiatives',
        lat: 30.0444,
        lng: 31.2357
      },
      {
        name: 'Amsterdam, Netherlands',
        desc: 'European operations and consulting',
        lat: 52.3676,
        lng: 4.9041
      },
      {
        name: 'London, UK',
        desc: 'International finance and education connections',
        lat: 51.5074,
        lng: -0.1278
      },
      {
        name: 'Warsaw, Poland',
        desc: 'Partners and events',
        lat: 52.2297,
        lng: 21.0122
      }
    ];

    const iconHtml = `
      <div class="lv-pin" aria-hidden="true">
        <div class="lv-pin-pulse"></div>
        <div class="lv-pin-pulse2"></div>
        <div class="lv-pin-dot"></div>
      </div>
    `;

    const elIcon = L.divIcon({
      html: iconHtml,
      className: 'lv-marker',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    locations.forEach(location => {
      const marker = L.marker([location.lat, location.lng], { icon: elIcon }).addTo(this.map);
      marker.bindPopup(`<strong>${location.name}</strong><br>${location.desc}`);
      this.markers.push(marker);
    });

    // Fit bounds to show all markers
    const group = new L.featureGroup(this.markers);
    this.map.fitBounds(group.getBounds().pad(0.1), { maxZoom: 4 });
  }

  setupEventListeners() {
    // Enable scroll zoom on hover
    this.mapElement.addEventListener('mouseenter', () => {
      if (this.map) this.map.scrollWheelZoom.enable();
    });

    this.mapElement.addEventListener('mouseleave', () => {
      if (this.map) this.map.scrollWheelZoom.disable();
    });

    // Theme switching removed; no observers needed
  }
}

// Initialize when DOM and Leaflet are ready
window.addEventListener('load', () => {
  if (window.L) {
    new MapManager();
  }
});

export { MapManager };
