# Mobile Optimization Quick Reference

## Breakpoints Overview

### Main Breakpoints
| Breakpoint | Device Type | Changes Applied |
|------------|-------------|-----------------|
| 1024px | Large tablets | Reduced font sizes, adjusted spacing |
| 980px | Tablet/Mobile | Mobile menu activates, 2-column layouts |
| 768px | Standard Mobile | Single column, optimized touch targets |
| 640px | Small Mobile | Compact spacing, further optimizations |
| 480px | Extra Small | Full-width buttons, minimal padding |
| 375px | Smallest Devices | Maximum compactness, essential content only |

---

## Component Breakpoints

### Navigation
- **980px**: Mobile menu, hamburger icon appears
- **640px**: Compact logo (36px), smaller language toggle
- **480px**: Further reduced spacing
- **375px**: Minimal logo (32px)

### Hero Section
- **768px**: 160px logo, adjusted motto size
- **640px**: 130px logo, more compact layout
- **480px**: 100px logo, minimal spacing
- **375px**: 85px logo, ultra-compact

### Services Slider
- **768px**: Reduced height (70vh), hidden arrows
- **640px**: Height 65vh, smaller dots
- **480px**: Height 60vh, compact controls

### Service Cards
- **768px**: Icons 2.25rem, titles clamp(1.5rem, 6vw, 2rem)
- **640px**: Icons 2rem, reduced padding
- **480px**: Icons 1.85rem, minimal spacing

### Map Component
- **980px**: Map below controls, full width
- **768px**: Height 350px, 3-column city selector
- **640px**: Height 320px, 2-column selector
- **480px**: Height 280px, smaller text
- **375px**: Height 250px, 1-column selector

### Forms
- **768px**: 16px font (prevents iOS zoom), 44px height
- **640px**: Reduced padding, compact layout
- **480px**: Full-width buttons

### Sections
- **980px**: padding: 3rem 1.25rem
- **768px**: padding: 2.5rem 1rem
- **640px**: padding: 2rem 0.75rem
- **480px**: padding: 1.5rem 0.5rem

---

## Touch Target Sizes

### Minimum Sizes (Mobile)
- Buttons: **44px × 44px**
- Navigation links: **44px height**
- Input fields: **44px height**
- Dots/Indicators: **8-10px** (with padding for 44px total)
- City selector buttons: **44px height**

---

## Typography Scale (Mobile)

### Font Sizes
```css
/* 768px and below */
html: 14px
h1: clamp(2rem, 8vw, 3rem)
h2: clamp(1.75rem, 7vw, 2.5rem)
h3: clamp(1.5rem, 6vw, 2rem)
p: 15px

/* 480px and below */
html: 13px
h1: clamp(1.5rem, 10vw, 2.25rem)
h2: clamp(1.35rem, 8vw, 1.85rem)
h3: clamp(1.2rem, 7vw, 1.6rem)
p: 14px
```

---

## Spacing Scale (Mobile)

### Adaptive Spacing
```css
/* 768px */
--spacing-12: 2.5rem
--spacing-16: 3rem
--spacing-20: 4rem

/* 640px */
--spacing-10: 2rem
--spacing-12: 2.25rem
--spacing-16: 2.5rem

/* 480px */
--spacing-8: 1.75rem
--spacing-10: 1.85rem
--spacing-12: 2rem
```

---

## Grid Layouts

### Responsive Grids
```css
/* Stats */
Default: 4 columns
768px: 2 columns
480px: 1 column

/* News */
Default: 3 columns
768px: 1 column

/* Brand Values */
Default: 3 columns
768px: 1 column

/* Features (Service Pages) */
Default: Auto-fit minmax(280px, 1fr)
768px: 1 column
```

---

## Performance Optimizations

### Mobile-Specific
- Animation duration: **≤0.6s**
- Complex animations: **Disabled**
- Background-attachment: **scroll** (not fixed)
- Overflow scrolling: **-webkit-overflow-scrolling: touch**
- Will-change: **Removed on mobile**

---

## iOS-Specific Fixes

### Safari Optimizations
```css
/* Prevent zoom on input focus */
input, textarea: font-size >= 16px

/* Viewport height */
height: -webkit-fill-available

/* Autofill styling */
-webkit-box-shadow: 0 0 0 1000px var(--bg) inset
```

---

## Common Issues & Solutions

### Problem: Horizontal scroll on mobile
**Solution**: 
- Check max-width: 100vw on body
- Verify overflow-x: hidden
- Test all full-width sections

### Problem: iOS input zoom
**Solution**: 
- Set font-size: 16px minimum on inputs

### Problem: Touch targets too small
**Solution**: 
- Ensure min-width/height: 44px
- Add padding to increase hit area

### Problem: Layout shifts
**Solution**: 
- Set explicit heights on images
- Use aspect-ratio or padding-bottom technique

---

## Testing Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Browser DevTools Testing

### Chrome DevTools
1. Open DevTools (F12)
2. Click device toolbar (Ctrl+Shift+M)
3. Select device or custom size
4. Test both portrait and landscape

### Recommended Test Sizes
- **iPhone SE**: 375 × 667
- **iPhone 12/13**: 390 × 844
- **Samsung Galaxy S20**: 360 × 800
- **iPad Mini**: 768 × 1024
- **Custom**: 320 × 568 (smallest)

---

## Accessibility Checklist

### Mobile-Specific
- [ ] Focus indicators visible (3px outline)
- [ ] Touch targets ≥ 44px
- [ ] Sufficient color contrast
- [ ] Screen reader friendly
- [ ] Keyboard navigable
- [ ] ARIA labels present
- [ ] Semantic HTML
- [ ] No zoom disabled

---

## File Organization

### CSS Architecture
```
src/css/
├── main.css (entry point)
├── variables.css (breakpoint-responsive)
├── base.css (typography, overflow fixes)
├── mobile-enhancements.css (NEW - mobile-specific)
└── components/
    ├── navigation.css (mobile menu)
    ├── hero.css (responsive hero)
    ├── services.css (slider optimization)
    ├── common.css (forms, buttons, sections)
    ├── footer.css (stats, news, contact)
    ├── map.css (responsive map)
    └── gallery.css (mobile gallery)
```

---

## Key CSS Features Used

### Modern CSS
- `clamp()` for fluid typography
- CSS Grid with `auto-fit`
- `env(safe-area-inset-*)`
- `backdrop-filter`
- `-webkit-fill-available`
- Custom properties (CSS variables)
- `@supports` queries

---

## Version History

**v2.0.0** (Current)
- Comprehensive mobile optimization
- Touch-friendly interactions
- Responsive breakpoints
- Performance improvements
- Accessibility enhancements

---

## Support

For issues or questions:
1. Check MOBILE_OPTIMIZATION_SUMMARY.md
2. Review browser console for errors
3. Test on actual devices
4. Verify Lighthouse scores

---

**Quick Start**: All mobile optimizations are automatically applied. No configuration needed. Just run `npm run dev` to test!
