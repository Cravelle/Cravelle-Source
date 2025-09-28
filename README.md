
The site is HTML-only (100% HTML language according to repo metadata) and references image assets from `images/` and service-specific backgrounds in `images/services/`. :contentReference[oaicite:3]{index=3}

---

## Assets required / Image placeholders

The repository’s existing README includes an explicit list of images that need to be placed in the `images/` tree so the site loads them automatically. Use exactly these names/paths (case-sensitive):

- `images/hero/hero-banner.jpg` — Top hero banner background  
- `images/services/academy-bg.jpg` — Service card background: Luxverra Academy  
- `images/services/diplomacy-bg.jpg` — Service card background: Luxverra Diplomacy  
- `images/services/translation-bg.jpg` — Service card background: Luxverra Translations  
- `images/services/trade-bg.jpg` — Service card background: Luxverra Trade  
- `images/services/prive-bg.jpg` — Service card background: Luxverra Privé  
- `images/services/digital-bg.jpg` — Service card background: Luxverra Digital  
- `images/services/voice-bg.jpg` — Service card background: Luxverra Voice  
- `images/services/connect-bg.jpg` — Service card background: Luxverra Connect  
- `images/services/edu-connect-bg.jpg` — Service card background: Luxverra Edu Connect

**Notes from repository:** recommended minimum size 1600×1000 px (JPG), web-optimised (~70% quality). Filenames are already referenced by `index.html` and — once added — will load automatically. :contentReference[oaicite:4]{index=4}

---

## Local preview / development

No build system is required. Two easy ways to preview:

1. Open the file directly in your browser  
   - Double-click `index.html` in your file manager, or open it from the browser (`File → Open File`).

2. Run a lightweight local HTTP server (recommended to avoid issues with some features that expect an HTTP origin):

```bash
# Python 3 (from repository root)
python -m http.server 8000

# Then open:
# http://localhost:8000/index.html
