---
title: "Cravelle — Source (internal)"
repo: "Cravelle/Cravelle-Source"
visibility: "private"
site: "https://cravelle.github.io"
last_updated: "2025-10-23"
license: "All rights reserved"
---

# Cravelle — Source (internal)

**Status:** This repository contains the source code, configuration and CI for the Cravelle website. The repository must remain **private** and accessible only to authorised team members.

---

## One-line summary
This repo holds the app source (frontend, backend, build configuration). The public website is published from a separate **public** Pages repository.

---

## Security — mandatory
1. Do **not** commit secrets or credentials (`.env`, `*.key`, `*.pem`, API keys).  
2. Disable source maps for production builds (`*.map`) to avoid exposing source.  
3. Store deploy tokens and other secrets in **Settings → Secrets → Actions** only. Use a minimal-scope PAT named `DEPLOY_PAT`.  
4. Make this repo private immediately (Settings → Danger Zone → Make private).

---

## Quick start (local)

### Node (Vite / React / Vue)
```bash
npm ci
npm run dev           # development server
npm run build         # production build -> output: dist/
