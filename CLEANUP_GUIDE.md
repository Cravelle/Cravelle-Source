# Files Cleanup Guide

## Safe to Remove (Backups & Old Files)

These files are backups or old versions and can be safely deleted:

```bash
# Backup files
index.html.backup          # Original 1,497-line file (keep for reference)
index_old.html            # Another backup (can remove if index.html.backup exists)

# Old documentation (replaced with new docs)
README.md                 # Old readme (if you want to use README_NEW.md instead)
```

## Files to Keep

### Configuration Files
- `package.json` - Dependencies and scripts
- `package-lock.json` - Dependency lock file
- `vite.config.js` - Build configuration
- `postcss.config.js` - CSS processing config
- `.gitignore` - Git ignore rules
- `SECURITY.md` - Security policy

### Documentation
- `README_NEW.md` - Modern documentation
- `MODERNIZATION_PLAN.md` - Architecture planning
- `PROJECT_STATUS.md` - Original status doc
- `MODERNIZATION_COMPLETE.md` - Completion report

### Source Files
- `index.html` - Main page (modernized)
- `src/` directory - All CSS and JS modules
- `lang/` directory - Translation files
- `images/` directory - All images
- `services/` directory - Service pages (need modernization)

### Build Output
- `dist/` directory - Production build (auto-generated)
- `node_modules/` directory - Dependencies (auto-generated)

## Recommended Cleanup Commands

```bash
# Remove backup if you're confident in the new version
rm index_old.html

# Optionally replace old README
mv README.md README_old.md
mv README_NEW.md README.md

# Clean up any IDE or system files
rm -rf .DS_Store
find . -name ".DS_Store" -delete
```

## Service Pages - Next Steps

The service pages need to be modernized. They currently have:
- Invalid HTML structure (script before DOCTYPE)
- Duplicate inline CSS/JS
- No build process integration

**Recommended approach:**
1. Create a service page template using the main page architecture
2. Extract service-specific content
3. Reuse navigation, footer, theme, and i18n modules
4. Update vite.config.js to include service pages in build

## File Size Comparison

### Before Modernization
- `index.html`: 1,497 lines (~80 KB)
- Total: ~80 KB for main page

### After Modernization
- `index.html`: 580 lines (~23.5 KB)
- `dist/assets/main.css`: 24.43 KB (5.94 KB gzipped)
- `dist/assets/main.js`: 19.09 KB (5.74 KB gzipped)
- **Total Initial Load**: ~67 KB raw, ~35 KB gzipped
- **Reduction**: ~45 KB raw, ~55% gzipped

## Git Recommendations

If using version control:

```bash
# Stage new files
git add src/ dist/ package*.json vite.config.js postcss.config.js
git add index.html MODERNIZATION_COMPLETE.md

# Commit
git commit -m "feat: modernize architecture with Vite, modular CSS/JS, and build optimization"

# Optionally remove old backups from tracking
echo "index.html.backup" >> .gitignore
echo "index_old.html" >> .gitignore
git add .gitignore
git commit -m "chore: ignore backup files"
```

## Production Deployment Checklist

Before deploying to production:

- [ ] Run `npm run build` and verify no errors
- [ ] Test dist/ folder with `npm run preview`
- [ ] Check all links work in production build
- [ ] Verify images load correctly
- [ ] Test theme switching
- [ ] Test language switching
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit
- [ ] Check console for errors
- [ ] Verify contact form works
- [ ] Test map interactions

## Maintenance Notes

### Adding New Features
1. Create new component CSS in `src/css/components/`
2. Import in `src/css/main.css`
3. Create new JS module in `src/js/`
4. Import in `src/main.js`
5. Run `npm run dev` to test
6. Run `npm run build` before deployment

### Updating Dependencies
```bash
# Check for updates
npm outdated

# Update specific package
npm update package-name

# Update all packages (be careful)
npm update

# Audit for security issues
npm audit
npm audit fix
```

### Performance Monitoring
- Use Lighthouse in Chrome DevTools
- Monitor bundle sizes in build output
- Check for unused code with coverage tools
- Use WebPageTest for real-world performance

---

**Note**: Keep `index.html.backup` for at least one release cycle in case you need to reference the original implementation.
