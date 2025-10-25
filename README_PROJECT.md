# Cravelle - Where Elegance Meets Purpose

Modern, high-performance website for Cravelle - elite services in education, diplomacy, translation, trade, and consulting.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Optimize images
npm run optimize-images
```

## 📊 Performance Achievements

### Code Optimization
- **61% code reduction** - 1,497 lines → 580 lines
- **8.37MB images saved** - 93% compression on largest files
- **Build time**: ~600ms
- **Gzipped totals**: 17.46 KB (CSS + JS combined)

### Before vs After
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| HTML | 1,497 lines | 580 lines | **-61%** |
| CSS | Inline (~600 lines) | 23.12 KB (5.78 KB gzipped) | **Modular** |
| JS | Inline (~620 lines) | 19.09 KB (5.74 KB gzipped) | **Modular** |
| Images | ~12 MB | ~4 MB | **-66%** |
| library.jpg | 3.2 MB | 223 KB | **-93%** |
| Best Academy.png | 4.6 MB | 256 KB | **-94%** |

## 🏗️ Modern Architecture

### Technology Stack
- **Vite 5.4.21** - Lightning-fast dev server with HMR
- **PostCSS** - Autoprefixer + CSSNano optimization
- **ES6 Modules** - Clean, maintainable JavaScript
- **Sharp** - High-performance image optimization
- **Leaflet 1.9.4** - Interactive maps

### Project Structure
```
├── index.html              # Main landing page (580 lines)
├── src/
│   ├── css/
│   │   ├── main.css        # CSS entry point
│   │   ├── variables.css   # Design tokens (colors, spacing)
│   │   ├── base.css        # Reset + base styles
│   │   ├── animations.css  # Keyframe animations
│   │   ├── service-page.css # Service page styles
│   │   └── components/     # Modular components
│   │       ├── navigation.css   # Fixed nav with mobile menu
│   │       ├── hero.css         # Parallax hero banner
│   │       ├── gallery.css      # Interactive gallery
│   │       ├── services.css     # 3D card carousel
│   │       ├── map.css          # Leaflet map styles
│   │       ├── footer.css       # Footer, partners, testimonials
│   │       └── common.css       # Buttons, cards, forms
│   └── js/
│       ├── main.js              # JS entry point
│       ├── theme.js             # Theme manager (auto/light/dark)
│       ├── i18n.js              # Multi-language (EN/AR/PL/TR)
│       ├── navigation.js        # Smooth scrolling
│       ├── background.js        # Canvas particle animation
│       ├── gallery.js           # Gallery interactions
│       ├── services-carousel.js # Service cards carousel
│       ├── map.js               # Leaflet integration
│       ├── form-handler.js      # Contact form validation
│       ├── animations.js        # Counter animations
│       └── service-page.js      # Service page module
├── services/                    # Service pages (9 pages)
│   ├── academy.html
│   ├── connect.html
│   ├── digital.html
│   ├── diplomacy.html
│   ├── prive.html
│   ├── trade.html
│   ├── translation.html
│   └── voice.html
├── images/                      # Optimized images
├── lang/                        # Translation JSON files
│   ├── en.json
│   ├── ar.json
│   ├── pl.json
│   └── tr.json
├── scripts/
│   └── optimize-images.js       # Image optimization script
└── dist/                        # Production build output
```

## ✨ Features

### User Features
- ✅ **Theme System** - Auto/light/dark modes with localStorage persistence
- ✅ **Multi-Language** - EN/AR/PL/TR with RTL support for Arabic
- ✅ **Particle Animation** - 48 particles (light) / 120 particles (dark)
- ✅ **Parallax Hero** - Zoom effect on scroll (1.0 → 1.18)
- ✅ **Interactive Gallery** - Mouse tracking, keyboard navigation
- ✅ **3D Service Cards** - Tilt effect on hover, background parallax
- ✅ **Interactive Map** - 5 global locations with custom markers
- ✅ **Contact Form** - Client-side validation
- ✅ **Counter Animations** - Scroll-triggered number animations
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Accessibility** - ARIA labels, semantic HTML, keyboard navigation

### Developer Features
- Hot Module Replacement (HMR)
- Code splitting (vendor/i18n/theme chunks)
- Tree shaking for unused code
- Terser minification with drop_console
- Autoprefixer for browser compatibility
- CSSNano for CSS optimization
- Source maps in development
- Production-ready build system

## 🛠️ Development

### Available Commands
```bash
# Development
npm run dev              # Start dev server (localhost:3000)

# Production
npm run build            # Build for production (dist/)
npm run preview          # Preview production build (localhost:8080)

# Optimization
npm run optimize-images  # Optimize JPG/PNG images
npm run optimize-images -- --webp  # Generate WebP versions
```

### Adding New Features

1. **Create CSS Component**
   ```bash
   # Create new component file
   touch src/css/components/my-component.css
   ```
   ```css
   /* Import in main.css */
   @import './components/my-component.css';
   ```

2. **Create JS Module**
   ```bash
   # Create new module
   touch src/js/my-module.js
   ```
   ```javascript
   // Import in main.js
   import './my-module.js';
   ```

3. **Test & Build**
   ```bash
   npm run dev    # Test in development
   npm run build  # Build for production
   ```

## 📦 Build Output

### Production Build Stats
```
dist/
├── index.html                  23.49 KB (5.94 KB gzipped)
├── services/
│   ├── academy.html           18.47 KB (5.13 KB gzipped)
│   ├── diplomacy.html         18.41 KB (4.84 KB gzipped)
│   └── ... (7 more pages)
├── assets/
│   ├── main-[hash].css        23.12 KB (5.78 KB gzipped)
│   ├── main-[hash].js         19.09 KB (5.74 KB gzipped)
│   ├── theme-[hash].js         2.07 KB (0.82 KB gzipped)
│   ├── i18n-[hash].js          3.10 KB (1.24 KB gzipped)
│   └── images/                ~4 MB (optimized)
```

## 🎨 Design System

### CSS Variables
```css
--gold: #D4AF37;       /* Primary accent */
--black: #000000;      /* Background dark */
--ivory: #F5F5F5;      /* Text light */
--sage: #9CAF88;       /* Secondary accent */
```

### Typography
- **Headings**: Cinzel (serif)
- **Body**: Montserrat (sans-serif)

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 980px
- Desktop: > 980px

## 🌐 Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## 🚢 Deployment

### Build for Production
```bash
# Optimize images first
npm run optimize-images

# Build production bundle
npm run build

# Output will be in dist/ folder
```

### Hosting Options
- **Netlify** - `netlify deploy --prod --dir=dist`
- **Vercel** - `vercel --prod`
- **Cloudflare Pages** - Connect GitHub repo
- **GitHub Pages** - Deploy dist/ folder
- **Any static hosting** - Upload dist/ contents

### Deployment Checklist
- [ ] Run `npm run optimize-images`
- [ ] Run `npm run build`
- [ ] Test with `npm run preview`
- [ ] Check console for errors
- [ ] Verify all links work
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit
- [ ] Configure caching headers
- [ ] Set up CDN (optional)

## 📝 Documentation

- **[MODERNIZATION_COMPLETE.md](./MODERNIZATION_COMPLETE.md)** - Full completion report
- **[CLEANUP_GUIDE.md](./CLEANUP_GUIDE.md)** - File management guide
- **[MODERNIZATION_PLAN.md](./MODERNIZATION_PLAN.md)** - Architecture planning
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Original status

## 🔧 Configuration Files

- **vite.config.js** - Build configuration, multi-page setup
- **postcss.config.js** - CSS processing (autoprefixer, cssnano)
- **package.json** - Dependencies and scripts
- **.gitignore** - Git ignore rules

## 🐛 Known Issues

1. **edu-connect.html** - Excluded from build due to malformed HTML (script before DOCTYPE)
   - Solution: Needs manual recreation
   
2. **Empty vendor chunk** - Leaflet imported but creates empty chunk
   - Impact: Minimal, doesn't affect functionality

3. **npm audit warnings** - 2 moderate vulnerabilities in esbuild (dev dependency)
   - Impact: Development only, doesn't affect production

## 💡 Performance Tips

1. **Images** - Run `npm run optimize-images -- --webp` to generate WebP versions
2. **Caching** - Configure long cache times for hashed assets
3. **CDN** - Use CDN for static assets in production
4. **Lazy Loading** - Images below fold are lazy loaded
5. **Code Splitting** - Vendor, i18n, and theme are separate chunks

## 📧 Contact

**Cravelle** - Where Elegance Meets Purpose

- **Website**: [gravenor.com](https://gravenor.com)
- **Founder**: [Mahmoud Keweisy](https://www.linkedin.com/in/mahmoudkeweisy/)
- **Email**: Contact form on website

## 📄 License

© 2025 Cravelle. All rights reserved.  
Cravelle is a trading name of Cravelle Services.

---

**Version**: 2.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: October 25, 2025  
**Build Time**: ~600ms
