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
    this._selectedLocationState = 'red'; // States: 'red', 'orange', 'green'
    this.storageKey = 'cravelle:lastCity';
    this.zoomProfiles = new Map([
      ['Dubai, UAE', [1.10, 0.85, 0.65, 0.95, 1.10]],
      ['Cairo, Egypt', [1.10, 0.85, 0.65, 0.95, 1.10]],
      ['Amsterdam, Netherlands', [1.08, 0.85, 0.65, 0.95, 1.10]],
      ['London, UK', [1.08, 0.85, 0.65, 0.95, 1.10]],
      ['Warsaw, Poland', [1.08, 0.85, 0.65, 0.95, 1.10]]
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
      this.globe = Globe({ animateIn: true })(this.el);

      // Ensure initial sizing in case CSS/layout settles after load (mobile)
      this.requestResize();
      window.addEventListener('resize', () => this.requestResize(), { passive: true });
      window.addEventListener('orientationchange', () => {
        // give layout a tick to settle on rotation
        setTimeout(() => this.requestResize(), 120);
      });

      const textureUrl = await this.resolveGlobeTexture([
        'https://unpkg.com/three-globe/example/img/earth-dark.jpg'
      ]);
      const bumpUrl = await this.resolveGlobeTexture([
        'https://unpkg.com/three-globe/example/img/earth-topology.png'
      ]);

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

      const controls = this.globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.6;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableRotate = false;
      this.controls = controls;

      this.globe.pointOfView({ lat: 30, lng: 25, altitude: 1.3 }, 900);

      this.initGlowHalos();

      this.initRadarWaves();

      this.startPinStrobe();

      this.setupGlobeInteractions();


      this.injectSideUI();
      const active = this.restoreSelection() || this.locations[0];
      this._currentLocation = active;
      this.renderPass(active);
      this.renderSelector(active);
    } catch (err) {
      if (window.L) {
        this.initLeafletFallback();
      } else {
        console.error('Globe initialization failed and Leaflet not available:', err);
      }
    }
  }

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

  startPinStrobe() {
    if (!this.globe) return;
    if (this._strobeTimer) clearInterval(this._strobeTimer);

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
      
      const isSelected = this._currentLocation && p.name === this._currentLocation.name;
      
      if (t < offWindow) {
        let offCol, onCol, settleBase;
        if (isSelected && this._selectedLocationState === 'green') {
          offCol = 'rgba(15, 143, 15, 1)';
          onCol = 'rgba(69, 255, 69, 1)';
          settleBase = { r: 15, g: 143, b: 15, onR: 69, onG: 255, onB: 69 };
        } else if (isSelected && this._selectedLocationState === 'orange') {
          offCol = 'rgba(255, 143, 15, 1)';
          onCol = 'rgba(255, 181, 69, 1)';
          settleBase = { r: 255, g: 143, b: 15, onR: 255, onG: 181, onB: 69 };
        } else {
          offCol = 'rgba(255, 15, 15, 1)';
          onCol = 'rgba(255, 69, 69, 1)';
          settleBase = { r: 255, g: 15, b: 15, onR: 255, onG: 69, onB: 69 };
        }
        res = { alt: baseAlt * 0.9, rad: baseRad * 0.9, col: offCol };
      } else if (t < offWindow + onWindow) {
        let onCol;
        if (isSelected && this._selectedLocationState === 'green') {
          onCol = 'rgba(69, 255, 69, 1)';
        } else if (isSelected && this._selectedLocationState === 'orange') {
          onCol = 'rgba(255, 181, 69, 1)';
        } else {
          onCol = 'rgba(255, 69, 69, 1)';
        }
        res = { alt: spikeAlt, rad: spikeRad, col: onCol };
      } else {
        const k = (t - offWindow - onWindow) / Math.max(1, settle); // 0..1
        const alt = glowAlt + (baseAlt - glowAlt) * k;
        const rad = glowRad + (baseRad - glowRad) * k;
        
        let settleCol;
        if (isSelected && this._selectedLocationState === 'green') {
          const g = Math.floor(143 + (112 * (1 - k))); // 143..255 for green
          settleCol = `rgba(15, ${g}, 15, 1)`;
        } else if (isSelected && this._selectedLocationState === 'orange') {
          const g = Math.floor(143 + (38 * (1 - k))); // 143..181 for orange
          settleCol = `rgba(255, ${g}, 69, 1)`;
        } else {
          const g = Math.floor(120 + (52 * (1 - k))); // 120..172 for red (original)
          settleCol = `rgba(255, ${g}, ${g}, 1)`;
        }
        res = { alt, rad, col: settleCol };
      }

      if (this._hoveredPoint && p === this._hoveredPoint) {
        const brighten = (col) => {
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

      const now = performance.now();
      const t = now % period;
      
      if (t >= offWindow && t < offWindow + onWindow) {
        if (!this._radarActive) {
          const radarData = this.locations.map(p => ({ 
            lat: p.lat, 
            lng: p.lng, 
            startTime: now,
            location: p
          }));
          
          const getRingColor = (d) => {
            const isSelected = this._currentLocation && d.location && d.location.name === this._currentLocation.name;
            if (!isSelected) return 'rgba(255, 86, 86, 0.6)';
            
            if (this._selectedLocationState === 'green') {
              return 'rgba(86, 255, 86, 0.6)';
            } else if (this._selectedLocationState === 'orange') {
              return 'rgba(255, 181, 86, 0.6)';
            }
            return 'rgba(255, 86, 86, 0.6)';
          };
          
          this.globe
            .ringsData(radarData)
            .ringLat('lat')
            .ringLng('lng')
            .ringAltitude(0.01)
            .ringColor(getRingColor)
            .ringMaxRadius(2.5)
            .ringPropagationSpeed(1.2)
            .ringRepeatPeriod(800);
          
          this._radarActive = true;
        }
      } else {
        if (this._radarActive) {
          this.globe.ringsData([]);
          this._radarActive = false;
        }
      }
    }, 80);
  }

  initGlowHalos() {
    const glowRings = this.locations.map((p, i) => ({ 
      lat: p.lat, 
      lng: p.lng, 
      _phase: 0,
      maxR: 0.8,
      alt: 0
    }));
    
    this._glowRings = glowRings;
    
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
      <div class="bp-header">
        <div class="bp-logo">CRAVELLE</div>
        <div class="bp-class">BUSINESS</div>
      </div>
      <div class="bp-main">
        <div class="bp-route-wrap">
          <div class="bp-from">
            <div class="bp-label">FROM</div>
            <div class="bp-code">${code}</div>
          </div>
          <div class="bp-plane">✈</div>
          <div class="bp-to">
            <div class="bp-label">TO</div>
            <div class="bp-city-name">${loc.name.split(',')[0]}</div>
            <div class="bp-country">${loc.name.split(',')[1]?.trim() || ''}</div>
          </div>
        </div>
      </div>
      <div class="bp-divider"></div>
      <div class="bp-info">
        <div class="bp-info-item">
          <div class="bp-info-label">GATE</div>
          <div class="bp-info-value">A${Math.abs(Math.floor(loc.lat + loc.lng)) % 9 + 1}</div>
        </div>
        <div class="bp-info-item">
          <div class="bp-info-label">SEAT</div>
          <div class="bp-info-value">${String.fromCharCode(65 + (Math.abs(Math.floor(loc.lng)) % 6))}${(Math.abs(Math.floor(loc.lat)) % 20) + 1}</div>
        </div>
        <div class="bp-info-item">
          <div class="bp-info-label">ZONE</div>
          <div class="bp-info-value">${(Math.abs(Math.floor(loc.lat + loc.lng)) % 3) + 1}</div>
        </div>
      </div>
      <div class="bp-footer">
        <div class="bp-desc">${loc.desc}</div>
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
    if (this.ui.selector) {
      [...this.ui.selector.querySelectorAll('.city-btn')].forEach(btn => {
        btn.setAttribute('aria-checked', String(btn.textContent === loc.name.split(',')[0]));
      });
    }

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

    this.saveSelection(loc);

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
    
    this._selectedLocationState = 'orange';
    
    if (this.controls) {
      this._savedAutoRotate = !!this.controls.autoRotate;
      this.controls.autoRotate = false;
    }
    const base = this.getCameraPosition(loc);
    const [approach, zoomIn1, zoomIn2, zoomOut1, zoomOut2] = this.getZoomProfile(loc);
    
    if (isLocationChange) {
      const currentPOV = this.globe.pointOfView();
      
      this.globe.pointOfView({ lat: currentPOV.lat, lng: currentPOV.lng, altitude: zoomOut1 }, 600);
      const t1 = setTimeout(() => {
        this.globe.pointOfView({ lat: currentPOV.lat, lng: currentPOV.lng, altitude: zoomOut2 }, 650);
      }, 650);
      const t2 = setTimeout(() => {
        this.globe.pointOfView({ ...base, altitude: approach }, 750);
      }, 1350);
      const t3 = setTimeout(() => {
        this.globe.pointOfView({ ...base, altitude: zoomIn1 }, 600);
      }, 2150);
      const t4 = setTimeout(() => {
        this.globe.pointOfView({ ...base, altitude: zoomIn2 }, 650);
      }, 2800);
      const tGreen = setTimeout(() => {
        this._selectedLocationState = 'green';
      }, 3500);
      const tOrange = setTimeout(() => {
        this._selectedLocationState = 'orange';
      }, 13500);
      const t5 = setTimeout(() => {
        this._selectedLocationState = 'red';
        this.globe.pointOfView({ ...base, altitude: zoomOut1 }, 700);
      }, 18500);
      const t6 = setTimeout(() => {
        this.globe.pointOfView({ ...base, altitude: zoomOut2 }, 750);
      }, 19250);
      const t7 = setTimeout(() => {
        if (this.controls) this.controls.autoRotate = this._savedAutoRotate;
      }, 20050);
      this._zoomTimers.push(t1, t2, t3, t4, tGreen, tOrange, t5, t6, t7);
    } else {
      this.globe.pointOfView({ ...base, altitude: approach }, 700);
      const t1 = setTimeout(() => {
        this.globe.pointOfView({ ...base, altitude: zoomIn1 }, 600);
      }, 750);
      const t2 = setTimeout(() => {
        this.globe.pointOfView({ ...base, altitude: zoomIn2 }, 650);
      }, 1400);
      const tGreen = setTimeout(() => {
        this._selectedLocationState = 'green';
      }, 2100);
      const tOrange = setTimeout(() => {
        this._selectedLocationState = 'orange';
      }, 12100);
      const t3 = setTimeout(() => {
        this._selectedLocationState = 'red';
        this.globe.pointOfView({ ...base, altitude: zoomOut1 }, 700);
      }, 17100);
      const t4 = setTimeout(() => {
        this.globe.pointOfView({ ...base, altitude: zoomOut2 }, 750);
      }, 17850);
      const t5 = setTimeout(() => {
        if (this.controls) this.controls.autoRotate = this._savedAutoRotate;
      }, 18650);
      this._zoomTimers.push(t1, t2, tGreen, tOrange, t3, t4, t5);
    }
    
    this._currentLocation = loc;
  }

  focusAndZoomLeaflet(loc) {
    if (!this._leafletMap) return;
    this.clearZoomTimers();
    const center = [loc.lat, this.getLngWithOffset(loc.lng)];
    this._leafletMap.flyTo(center, 5, { duration: 0.9 });
    const t1 = setTimeout(() => this._leafletMap.flyTo(center, 6, { duration: 0.8 }), 950);
    const t2 = setTimeout(() => this._leafletMap.flyTo(center, 7, { duration: 0.8 }), 1800);
    const t3 = setTimeout(() => this._leafletMap.flyTo(center, 5, { duration: 0.85 }), 2650);
    const t4 = setTimeout(() => this._leafletMap.flyTo(center, 4, { duration: 0.9 }), 3550);
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

  getCameraPosition(loc) {
    // Adjust offset based on screen size - desktop needs less offset to prevent weird positioning
    const isMobile = window.innerWidth <= 980;
    const latOffset = isMobile ? -12 : -6; // smaller offset for desktop, larger for mobile
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

    this.el.addEventListener('mouseenter', () => map.scrollWheelZoom.enable());
    this.el.addEventListener('mouseleave', () => map.scrollWheelZoom.disable());

    this._leafletMap = map;
    this.injectSideUI();
    const active = this.restoreSelection() || this.locations[0];
    this._currentLocation = active;
    this.renderPass(active);
    this.renderSelector(active);
  }

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

  requestResize() {
    if (!this.el || !this.globe) return;
    const w = this.el.clientWidth || this.el.offsetWidth || 0;
    const h = this.el.clientHeight || this.el.offsetHeight || 0;
    if (w > 0 && h > 0 && typeof this.globe.width === 'function' && typeof this.globe.height === 'function') {
      this.globe.width(w).height(h);
    }
  }
}

window.addEventListener('load', () => new GlobeManager());

export { GlobeManager };
