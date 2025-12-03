#!/usr/bin/env python3
"""
Batch update service pages with dark theme, iridescence background, and gradient text
"""

import re
import os
from pathlib import Path

# Define the base directory
BASE_DIR = Path("/Users/meteyalcinkaya/Documents/VSC Projects/Cravelle-Source/services")

# List of files to update (excluding academy.html which is already done)
SERVICE_FILES = [
    "connect.html",
    "digital.html",
    "diplomacy.html",
    "edu-connect.html",
    "prive.html",
    "trade.html",
    "translation.html",
    "voice.html"
]

# Dark theme CSS variables
DARK_THEME_VARS = """      --charcoal: #0A0A0A;
      --graphite: #1A1A1A;
      --slate: #2A2A2A;
      --stone: #4A4A4A;
      --silver: #8A8A8A;
      --platinum: #CFCFCF;
      --pearl: #F5F5F7;
      --ivory: #FAFAFA;
      --accent: #7A9CC6;
      --accent-hover: #93B4DB;
      --border: rgba(255, 255, 255, 0.12);
      --nav-bg: rgba(10, 10, 10, 0.95);
      --nav-text: var(--pearl);
      --text: var(--pearl);
      --text-secondary: var(--platinum);"""

# Iridescence background HTML
IRIDESCENCE_BG = """  <!-- Iridescence Background -->
  <div class="iridescence-bg">
    <div class="iridescence-layer-1"></div>
    <div class="iridescence-layer-2"></div>
    <div class="iridescence-layer-3"></div>
  </div>
  
"""

def update_service_page(filepath):
    """Update a single service page"""
    print(f"Updating {filepath.name}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Update CSS variables to dark theme
    content = re.sub(
        r'--accent: #283540;',
        '--accent: #7A9CC6;',
        content
    )
    content = re.sub(
        r'--accent-hover: #3a4b5a;',
        '--accent-hover: #93B4DB;',
        content
    )
    content = re.sub(
        r'--border: rgba\(10, 10, 10, 0\.08\);',
        '--border: rgba(255, 255, 255, 0.12);',
        content
    )
    content = re.sub(
        r'--nav-bg: rgba\(250, 250, 250, 0\.95\);',
        '--nav-bg: rgba(10, 10, 10, 0.95);',
        content
    )
    content = re.sub(
        r'--nav-text: var\(--charcoal\);',
        '--nav-text: var(--pearl);',
        content
    )
    content = re.sub(
        r'--text: var\(--charcoal\);',
        '--text: var(--pearl);',
        content
    )
    content = re.sub(
        r'--text-secondary: var\(--silver\);',
        '--text-secondary: var(--platinum);',
        content
    )
    
    # 2. Update body background
    content = re.sub(
        r'background: var\(--ivory\);',
        'background: var(--charcoal);',
        content
    )
    
    # 3. Add CSS import before <style> if not present
    if '<link rel="stylesheet" href="/src/css/main.css">' not in content:
        content = content.replace(
            '<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">',
            '<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">\n  \n  <!-- Import main CSS -->\n  <link rel="stylesheet" href="/src/css/main.css">'
        )
    
    # 4. Add iridescence background after <body> if not present
    if 'iridescence-bg' not in content:
        content = content.replace('<body>\n  <!-- Navigation -->', '<body>\n' + IRIDESCENCE_BG + '  <!-- Navigation -->')
        content = content.replace('<body>\n  <nav>', '<body>\n' + IRIDESCENCE_BG + '  <nav>')
    
    # 5. Add gradient-text class to h1, h2, h3 tags
    # Add to h1 tags
    content = re.sub(
        r'<h1([^>]*?)>',
        r'<h1 class="gradient-text"\1>',
        content
    )
    # Add to h2 tags (with variations)
    content = re.sub(
        r'<h2([^>]*?)>',
        lambda m: f'<h2 class="gradient-text gradient-text--purple"{m.group(1)}>',
        content
    )
    # Add to h3 tags (with gold variant)
    content = re.sub(
        r'<h3([^>]*?)>',
        lambda m: f'<h3 class="gradient-text gradient-text--gold"{m.group(1)}>',
        content
    )
    
    # Fix duplicate class attributes if any
    content = re.sub(r'class="([^"]*)" class="([^"]*)"', r'class="\1 \2"', content)
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  ✓ Updated {filepath.name}")

def main():
    print("Starting batch update of service pages...")
    print()
    
    updated = 0
    for filename in SERVICE_FILES:
        filepath = BASE_DIR / filename
        if filepath.exists():
            try:
                update_service_page(filepath)
                updated += 1
            except Exception as e:
                print(f"  ✗ Error updating {filename}: {e}")
        else:
            print(f"  ⚠ File not found: {filename}")
    
    print()
    print(f"Completed! Updated {updated}/{len(SERVICE_FILES)} files.")

if __name__ == "__main__":
    main()
