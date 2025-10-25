/**
 * Global Presence: 3D Globe (with graceful fallback to Leaflet)
 * - Primary: Globe.gl + Three.js (dark theme)
 * - Fallback: Leaflet dark map (existing styling)
 */

class GlobeManager {
  constructor() {
    this.el = document.getElementById('map');
    if (!this.el) return;
    this.globe = null;
    this.locations = this.getLocations();
    this.codes = new Map([
      ['Dubai, UAE','DXB'], ['Cairo, Egypt','CAI'], ['Amsterdam, Netherlands','AMS'], ['London, UK','LON'], ['Warsaw, Poland','WAW']
    ]);
    this.ui = { pass: null, selector: null };
    this.controls = null;
    this._zoomTimers = [];
    this._savedAutoRotate = true;
    this._currentLocation = null;
    this.storageKey = 'cravelle:lastCity';
    // 5-step zoom: [approach, zoomIn1, zoomIn2, zoomOut1, zoomOut2]
    this.zoomProfiles = new Map([
      ['Dubai, UAE', [1.7, 1.2, 0.85, 1.45, 1.85]],
      ['Cairo, Egypt', [1.7, 1.2, 0.85, 1.45, 1.8]],
      ['Amsterdam, Netherlands', [1.65, 1.15, 0.80, 1.4, 1.8]],
      ['London, UK', [1.65, 1.15, 0.80, 1.4, 1.8]],
      ['Warsaw, Poland', [1.65, 1.15, 0.80, 1.4, 1.8]]
    ]);
    this.init();
  }

  getLocations() {
    return [
      { name: 'Dubai, UAE', desc: 'Strategic partnerships and business development', lat: 25.2048, lng: 55.2708 },
      { name: 'Cairo, Egypt', desc: 'Regional diplomatic and cultural initiatives', lat: 30.0444, lng: 31.2357 },
      { name: 'Amsterdam, Netherlands', desc: 'European operations and consulting', lat: 52.3676, lng: 4.9041 },
      { name: 'London, UK', desc: 'International finance and education connections', lat: 51.5074, lng: -0.1278 },
      { name: 'Warsaw, Poland', desc: 'Partners and events', lat: 52.2297, lng: 21.0122 }
    ];
  }

  async init() {
    try {
      if (!this.supportsWebGL()) throw new Error('WebGL not supported');

      const Globe = (await import('globe.gl')).default;
      // Initialize globe instance first
      this.globe = Globe({ animateIn: true })(this.el);

      // Resolve custom dotted texture if available (with graceful fallback)
      const textureUrl = await this.resolveGlobeTexture([
        '/images/globe/dots-world.png',
        '/images/globe/dots-world.jpg',
        '/images/globe/earth-custom.jpg',
        'https://unpkg.com/three-globe/example/img/earth-dark.jpg'
      ]);
      const bumpUrl = await this.resolveGlobeTexture([
        '/images/globe/earth-custom-topology.png',
        'https://unpkg.com/three-globe/example/img/earth-topology.png'
      ]);

      // Apply base visual configuration
      this.globe
        .globeImageUrl(textureUrl)
        .bumpImageUrl(bumpUrl)
        .backgroundColor('#0b0e11')
        .atmosphereColor('#3a4b5a')
        .atmosphereAltitude(0.18)
        .showAtmosphere(true)
        .pointsData(this.locations.map((p, i) => ({ ...p, _phase: 0 })))
        .pointLat('lat')
        .pointLng('lng')
        .pointAltitude(0.012)
        .pointRadius(0.36)
        .pointResolution(16)
        .pointColor(() => 'rgba(255, 15, 15, 1)');

      // Controls
      const controls = this.globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.6;
      controls.enableZoom = true;
      this.controls = controls;

      // Set initial POV to show Europe/Middle East
      this.globe.pointOfView({ lat: 30, lng: 25, altitude: 2.4 }, 1200);

      // Add ground glow halos that animate with strobe
      this.initGlowHalos();

      // Add radar waves that sync with strobe
      this.initRadarWaves();

      // Start pin strobe (pin itself pulses like a strobe with glow tail)
      this.startPinStrobe();

      // Interactions (hover tooltip; emphasize red pin)
      this.setupGlobeInteractions();

      // Update legend text for globe and keep dark theme
      const attr = document.querySelector('.map-legend .map-attr');
      if (attr) attr.textContent = '3D globe © Three.js · Locations © Cravelle';

      // Inject UI (boarding pass + selector)
      this.injectSideUI();
      const active = this.restoreSelection() || this.locations[0];
      this._currentLocation = active;
      this.renderPass(active);
      this.renderSelector(active);
    } catch (err) {
      // Fallback to Leaflet if available
      if (window.L) {
        this.initLeafletFallback();
      } else {
        console.error('Globe initialization failed and Leaflet not available:', err);
      }
    }
  }

  // Attempt to load the first reachable image from list; returns the first that succeeds
  resolveGlobeTexture(candidates) {
    return new Promise((resolve) => {
      const tryNext = (idx) => {
        if (idx >= candidates.length) return resolve(candidates[candidates.length - 1]);
        const url = candidates[idx];
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(url);
        img.onerror = () => tryNext(idx + 1);
        img.src = url;
      };
      tryNext(0);
    });
  }

  // Make pins themselves strobe (brightness + slight size/altitude pulse) with per-pin phase offset
  startPinStrobe() {
    if (!this.globe) return;
    if (this._strobeTimer) clearInterval(this._strobeTimer);

    // Spec: 1s OFF (dark red), quick ON (light red) then OFF again
    const period = 1200;    // total cycle
    const offWindow = 1000; // ms fully off stage
    const onWindow = 120;   // ms bright ON
    const settle = period - offWindow - onWindow; // quick settle-off
    const baseAlt = 0.012;
    const glowAlt = 0.02;
    const spikeAlt = 0.032;
    const baseRad = 0.36;
    const glowRad = 0.40;
    const spikeRad = 0.48;

    const compute = (p, phaseMs) => {
      const now = performance.now();
      const t = (now + phaseMs) % period;
      let res;
      if (t < offWindow) {
        // OFF: #ff0f0f
        res = { alt: baseAlt * 0.9, rad: baseRad * 0.9, col: 'rgba(255, 15, 15, 1)' };
      } else if (t < offWindow + onWindow) {
        // ON: #ff4545
        res = { alt: spikeAlt, rad: spikeRad, col: 'rgba(255, 69, 69, 1)' };
      } else {
        // Settle back to OFF quickly
        const k = (t - offWindow - onWindow) / Math.max(1, settle); // 0..1
        const alt = glowAlt + (baseAlt - glowAlt) * k;
        const rad = glowRad + (baseRad - glowRad) * k;
        const g = Math.floor(120 + (52 * (1 - k))); // 120..172
        res = { alt, rad, col: `rgba(255, ${g}, ${g}, 1)` };
      }

      // Hover boost: brighter, slightly larger and taller to emphasize
      if (this._hoveredPoint && p === this._hoveredPoint) {
        const brighten = (col) => {
          // rgba(255, r, r, a) -> nudge r component modestly
          try {
            const m = col.match(/rgba\(\s*255\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d\.]+)\s*\)/);
            if (!m) return 'rgba(255, 220, 220, 1)';
            const r = Math.min(200, parseInt(m[1], 10) + 28);
            return `rgba(255, ${r}, ${r}, 1)`;
          } catch { return 'rgba(255, 220, 220, 1)'; }
        };
        res = { alt: res.alt * 1.25, rad: res.rad * 1.12, col: brighten(res.col) };
      }

      return res;
    };

    this._strobeTimer = setInterval(() => {
      if (!this.globe) return;
      const altFn = (p) => compute(p, p._phase).alt;
      const radFn = (p) => compute(p, p._phase).rad;
      const colFn = (p) => compute(p, p._phase).col;
      this.globe
        .pointAltitude(altFn)
        .pointRadius(radFn)
        .pointColor(colFn);

      // Sync radar waves with strobe - only emit during ON
      const now = performance.now();
      const t = now % period;
      
      if (t >= offWindow && t < offWindow + onWindow) {
        // ON - generate radar waves
        if (!this._radarActive) {
          const radarData = this.locations.map(p => ({ 
            lat: p.lat, 
            lng: p.lng, 
            startTime: now 
          }));
          
          // Use custom layer for propagating rings
          this.globe
            .ringsData(radarData)
            .ringLat('lat')
            .ringLng('lng')
            .ringAltitude(0.01)
            .ringColor(() => 'rgba(255, 86, 86, 0.6)')
            .ringMaxRadius(2.5)
            .ringPropagationSpeed(1.2)
            .ringRepeatPeriod(800);
          
          this._radarActive = true;
        }
      } else {
        // OFF - clear radar waves
        if (this._radarActive) {
          this.globe.ringsData([]);
          this._radarActive = false;
        }
      }
    }, 80);
  }

  initGlowHalos() {
    // Use a second rings layer specifically for ground glow
    // These will be static (non-propagating) halos that we control via data updates
    const glowRings = this.locations.map((p, i) => ({ 
      lat: p.lat, 
      lng: p.lng, 
      _phase: 0,
      maxR: 0.8,
      alt: 0
    }));
    
    this._glowRings = glowRings;
    
    // Add glow rings as a custom rings layer with custom accessor
    this.globe
      .ringsData([...this._glowRings])
      .ringLat(d => d.lat)
      .ringLng(d => d.lng)
      .ringAltitude(d => d.alt || 0)
      .ringColor(() => 'rgba(255, 131, 131, 0)')
      .ringMaxRadius(d => d.maxR || 0.8)
      .ringPropagationSpeed(() => 0)
      .ringRepeatPeriod(() => 100000000);
  }

  initRadarWaves() {
    // Separate propagating radar rings
    this._radarRings = [];
    this._radarActive = false;
  }

  injectSideUI() {
    const wrap = document.getElementById('mapWrap');
    if (!wrap) return;
    this.ui.pass = document.getElementById('bpCard') || (() => {
      const aside = document.createElement('aside');
      aside.className = 'map-side';
      const pass = document.createElement('div'); pass.id = 'bpCard'; pass.className = 'bp-card';
      const sel = document.createElement('div'); sel.id = 'citySelector'; sel.className = 'city-selector';
      aside.appendChild(pass); aside.appendChild(sel); wrap.appendChild(aside);
      return pass;
    })();
    this.ui.selector = document.getElementById('citySelector');
  }

  renderPass(loc) {
    if (!this.ui.pass) return;
    const code = this.codes.get(loc.name) || '— — —';
    const html = `
      <div class="bp-head">
        <div class="bp-route"><span class="bp-iata">${code}</span><span class="bp-arrow">→</span><span class="bp-city">${loc.name}</span></div>
        <div style="font-size:11px; opacity:.75;">BOARDING · PRIORITY</div>
      </div>
      <div class="bp-perf"></div>
      <div class="bp-desc">${loc.desc}</div>
      <div class="bp-meta">
        <div>Gate <strong>A${Math.abs(Math.floor(loc.lat + loc.lng)) % 9 + 1}</strong></div>
        <div>Seat <strong>${String.fromCharCode(65 + (Math.abs(Math.floor(loc.lng)) % 6))}${(Math.abs(Math.floor(loc.lat)) % 20) + 1}</strong></div>
        <div>Zone <strong>${(Math.abs(Math.floor(loc.lat + loc.lng)) % 3) + 1}</strong></div>
      </div>
    `;
    this.ui.pass.innerHTML = html;
  }

  renderSelector(active) {
    if (!this.ui.selector) return;
    this.ui.selector.innerHTML = '';
    this.locations.forEach(loc => {
      const btn = document.createElement('button');
      btn.className = 'city-btn';
      btn.type = 'button';
      btn.role = 'radio';
      btn.setAttribute('aria-checked', String(loc === active));
      btn.textContent = loc.name.split(',')[0];
      btn.addEventListener('click', () => this.onSelectCity(loc));
      this.ui.selector.appendChild(btn);
    });
  }

  onSelectCity(loc) {
    // Update selector state
    if (this.ui.selector) {
      [...this.ui.selector.querySelectorAll('.city-btn')].forEach(btn => {
        btn.setAttribute('aria-checked', String(btn.textContent === loc.name.split(',')[0]));
      });
    }

    // Animate boarding pass out, then in with new content
    if (this.ui.pass) {
      this.ui.pass.classList.remove('bp-enter');
      this.ui.pass.classList.add('bp-exit');
      const onEnd = () => {
        this.ui.pass.removeEventListener('animationend', onEnd);
        this.renderPass(loc);
        this.ui.pass.classList.remove('bp-exit');
        void this.ui.pass.offsetWidth; // reflow for restart
        this.ui.pass.classList.add('bp-enter');
      };
      this.ui.pass.addEventListener('animationend', onEnd);
    }

    // Persist selection
    this.saveSelection(loc);

    // Focus globe/ map on the selection with an auto zoom in-out sequence
    if (this.globe && typeof this.globe.pointOfView === 'function') {
      this.focusAndZoom(loc);
    } else if (window.L && this._leafletMap) {
      this.focusAndZoomLeaflet(loc);
    }
  }

  clearZoomTimers() {
    this._zoomTimers.forEach(t => clearTimeout(t));
    this._zoomTimers = [];
  }

  focusAndZoom(loc) {
    if (!this.globe) return;
    this.clearZoomTimers();
    
    const isLocationChange = this._currentLocation && this._currentLocation.name !== loc.name;
    
    // Pause auto rotate and remember previous state
    if (this.controls) {
      this._savedAutoRotate = !!this.controls.autoRotate;
      this.controls.autoRotate = false;
    }
    const base = this.getCameraPosition(loc);
    const [approach, zoomIn1, zoomIn2, zoomOut1, zoomOut2] = this.getZoomProfile(loc);
    
    if (isLocationChange) {
      // Switching cities: zoom out 2x from current position, then move and zoom in 2x to new city
      const currentPOV = this.globe.pointOfView();
      
      // Step 1: zoom out (first) from current position
      this.globe.pointOfView({ lat: currentPOV.lat, lng: currentPOV.lng, altitude: zoomOut1 }, 600);
      // Step 2: zoom out (second) from current position
      const t1 = setTimeout(() => {
        this.globe.pointOfView({ lat: currentPOV.lat, lng: currentPOV.lng, altitude: zoomOut2 }, 650);
      }, 650);
      // Step 3: move to new location
      const t2 = setTimeout(() => {
        this.globe.pointOfView({ ...base, altitude: approach }, 750);
      }, 1350);
      // Step 4: zoom in (first) to new city
      const t3 = setTimeout(() => {
        this.globe.pointOfView({ ...base, altitude: zoomIn1 }, 600);
      }, 2150);
      // Step 5: zoom in (second) to new city
      const t4 = setTimeout(() => {
        this.globe.pointOfView({ ...base, altitude: zoomIn2 }, 650);
      }, 2800);
      // Step 6: hold for 15 seconds
      // Step 7: zoom out (first) after hold
      const t5 = setTimeout(() => {
        this.globe.pointOfView({ ...base, altitude: zoomOut1 }, 700);
      }, 18500);
      // Step 8: zoom out (second) after hold
      const t6 = setTimeout(() => {
        this.globe.pointOfView({ ...base, altitude: zoomOut2 }, 750);
      }, 19250);
      // Step 9: resume auto rotate
      const t7 = setTimeout(() => {
        if (this.controls) this.controls.autoRotate = this._savedAutoRotate;
      }, 20050);
      this._zoomTimers.push(t1, t2, t3, t4, t5, t6, t7);
    } else {
      // Same location or first click: only zoom in 2x, hold 15s, zoom out 2x, resume
      // Step 1: approach
      this.globe.pointOfView({ ...base, altitude: approach }, 700);
      // Step 2: zoom in (first)
      const t1 = setTimeout(() => {
        this.globe.pointOfView({ ...base, altitude: zoomIn1 }, 600);
      }, 750);
      // Step 3: zoom in (second)
      const t2 = setTimeout(() => {
        this.globe.pointOfView({ ...base, altitude: zoomIn2 }, 650);
      }, 1400);
      // Step 4: hold for 15 seconds
      // Step 5: zoom out (first) after hold
      const t3 = setTimeout(() => {
        this.globe.pointOfView({ ...base, altitude: zoomOut1 }, 700);
      }, 17100);
      // Step 6: zoom out (second) after hold
      const t4 = setTimeout(() => {
        this.globe.pointOfView({ ...base, altitude: zoomOut2 }, 750);
      }, 17850);
      // Step 7: resume auto rotate
      const t5 = setTimeout(() => {
        if (this.controls) this.controls.autoRotate = this._savedAutoRotate;
      }, 18650);
      this._zoomTimers.push(t1, t2, t3, t4, t5);
    }
    
    // Update current location after starting animation
    this._currentLocation = loc;
  }

  focusAndZoomLeaflet(loc) {
    if (!this._leafletMap) return;
    this.clearZoomTimers();
    const center = [loc.lat, this.getLngWithOffset(loc.lng)];
    // Step 1: approach
    this._leafletMap.flyTo(center, 5, { duration: 0.9 });
    // Step 2: zoom in (first)
    const t1 = setTimeout(() => this._leafletMap.flyTo(center, 6, { duration: 0.8 }), 950);
    // Step 3: zoom in (second)
    const t2 = setTimeout(() => this._leafletMap.flyTo(center, 7, { duration: 0.8 }), 1800);
    // Step 4: zoom out (first)
    const t3 = setTimeout(() => this._leafletMap.flyTo(center, 5, { duration: 0.85 }), 2650);
    // Step 5: zoom out (second)
    const t4 = setTimeout(() => this._leafletMap.flyTo(center, 4, { duration: 0.9 }), 3550);
    // Step 6: slight pan to clear overlay
    const t5 = setTimeout(() => {
      const side = document.querySelector('.map-side');
      const isDesktop = window.innerWidth > 980 && side && getComputedStyle(side).position === 'absolute';
      if (isDesktop) {
        const dx = Math.min(side.offsetWidth * 0.35, 140);
        this._leafletMap.panBy([dx, 0], { animate: true, duration: 0.6 });
      }
    }, 4500);
    this._zoomTimers.push(t1, t2, t3, t4, t5);
  }

  getZoomProfile(loc) {
    return this.zoomProfiles.get(loc.name) || [1.65, 1.15, 0.8, 1.4, 1.8];
  }

  // Get camera position with offsets to keep city visible on screen
  getCameraPosition(loc) {
    // No longitude offset - center directly on the city
    // Offset latitude downward so city appears higher on screen (compensate for perspective)
    const latOffset = -12; // degrees lower to keep city centered and visible during zoom
    return { lat: loc.lat + latOffset, lng: loc.lng };
  }

  saveSelection(loc) {
    try {
      sessionStorage.setItem(this.storageKey, loc.name);
    } catch {}
  }

  restoreSelection() {
    try {
      const name = sessionStorage.getItem(this.storageKey);
      if (!name) return null;
      return this.locations.find(l => l.name === name) || null;
    } catch {
      return null;
    }
  }

  setupGlobeInteractions() {
    // Tooltip element
    const tip = document.createElement('div');
    tip.id = 'mapTooltip';
    tip.style.position = 'fixed';
    tip.style.zIndex = '1000';
    tip.style.pointerEvents = 'none';
    tip.style.background = 'rgba(12, 15, 18, 0.86)';
    tip.style.border = '1px solid rgba(255,255,255,0.08)';
    tip.style.backdropFilter = 'blur(6px) saturate(140%)';
    tip.style.webkitBackdropFilter = 'blur(6px) saturate(140%)';
    tip.style.color = '#e8eef7';
    tip.style.padding = '8px 10px';
    tip.style.borderRadius = '8px';
    tip.style.fontSize = '12px';
    tip.style.boxShadow = '0 6px 20px rgba(0,0,0,0.35)';
    tip.style.opacity = '0';
    tip.style.transition = 'opacity .18s ease, transform .18s ease';
    document.body.appendChild(tip);

    // Keep ambient rings set globally; on hover we don't override ring color

    // Hover handler only for pinned points
    this._hoveredPoint = null;
    this.globe.onPointHover(pt => {
      this._hoveredPoint = pt || null;
      if (pt) {
        tip.innerHTML = `<strong>${pt.name}</strong><br>${pt.desc}`;
        tip.style.opacity = '1';
        tip.style.transform = 'translateY(0)';
      } else {
        tip.style.opacity = '0';
        tip.style.transform = 'translateY(6px)';
      }
    });

    // Track mouse for tooltip position
    const moveTip = (e) => {
      const x = e.clientX + 12;
      const y = e.clientY + 12;
      tip.style.left = `${x}px`;
      tip.style.top = `${y}px`;
    };
    window.addEventListener('mousemove', moveTip, { passive: true });
  }

  initLeafletFallback() {
    const map = L.map(this.el, { zoomControl: true, scrollWheelZoom: false, attributionControl: false });
    const layer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { subdomains: 'abcd', maxZoom: 20 });
    layer.addTo(map);

    const iconHtml = `
      <div class="lv-pin" aria-hidden="true">
        <div class="lv-pin-pulse"></div>
        <div class="lv-pin-pulse2"></div>
        <div class="lv-pin-dot"></div>
      </div>
    `;
    const elIcon = L.divIcon({ html: iconHtml, className: 'lv-marker', iconSize: [28, 28], iconAnchor: [14, 14] });

    const markers = this.locations.map(loc => {
      const m = L.marker([loc.lat, loc.lng], { icon: elIcon }).addTo(map);
      m.bindPopup(`<strong>${loc.name}</strong><br>${loc.desc}`);
      return m;
    });
    const group = new L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.1), { maxZoom: 4 });

    // Hover enable/disable scroll zoom
    this.el.addEventListener('mouseenter', () => map.scrollWheelZoom.enable());
    this.el.addEventListener('mouseleave', () => map.scrollWheelZoom.disable());

    // Expose for selector
    this._leafletMap = map;
    this.injectSideUI();
    const active = this.restoreSelection() || this.locations[0];
    this._currentLocation = active;
    this.renderPass(active);
    this.renderSelector(active);
  }

  // Keep selected point comfortably visible beside the left overlay by nudging center longitude
  getLngWithOffset(lng) {
    const side = document.querySelector('.map-side');
    const isDesktop = window.innerWidth > 980 && side && getComputedStyle(side).position === 'absolute';
    const offsetDeg = isDesktop ? -8 : 0; // slight west offset to clear the overlay
    return this.normalizeLng(lng + offsetDeg);
  }

  normalizeLng(lng) {
    let x = lng;
    while (x > 180) x -= 360;
    while (x < -180) x += 360;
    return x;
  }

  supportsWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  }
}

// Initialize when DOM is ready
window.addEventListener('load', () => new GlobeManager());

export { GlobeManager };
