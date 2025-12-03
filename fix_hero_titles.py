#!/usr/bin/env python3
"""Fix hero section titles and styling in all service pages"""

import re
from pathlib import Path

service_files = [
    'services/academy.html',
    'services/connect.html',
    'services/digital.html',
    'services/diplomacy.html',
    'services/edu-connect.html',
    'services/prive.html',
    'services/trade.html',
    'services/translation.html',
    'services/voice.html'
]

def fix_hero_section(file_path):
    """Fix hero section CSS and ensure proper title styling"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # 1. Fix the corrupted hero section CSS - remove duplicates and clean it up
    hero_css = '''/* Hero Section */
    .hero {
      position: relative;
      overflow: hidden;
      padding: 100px 5% 80px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
    }'''
    
    # Remove all existing hero section CSS and replace with clean version
    content = re.sub(
        r'/\* Hero Section \*/\s*\.hero \{[^}]*\}',
        hero_css,
        content,
        flags=re.DOTALL
    )
    
    # 2. Ensure hero h1 has proper styling
    hero_h1_css = '''
    .hero h1 {
      font-family: 'Playfair Display', serif;
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 700;
      color: #ffffff;
      text-shadow: 0 2px 12px rgba(0,0,0,0.45);
      margin-bottom: 24px;
      line-height: 1.2;
      text-align: center;
    }'''
    
    if '.hero h1 {' in content:
        content = re.sub(
            r'\.hero h1 \{[^}]*\}',
            hero_h1_css,
            content,
            flags=re.DOTALL
        )
    else:
        # Add after hero section if not present
        content = re.sub(
            r'(\.hero::before \{[^}]*\})',
            r'\1\n' + hero_h1_css,
            content,
            flags=re.DOTALL
        )
    
    # 3. Fix hero-content styling
    hero_content_css = '''
    .hero-content {
      max-width: 800px;
      position: relative;
      z-index: 1;
    }'''
    
    content = re.sub(
        r'\.hero-content \{[^}]*\}',
        hero_content_css,
        content,
        flags=re.DOTALL
    )
    
    # 4. Ensure hero paragraph has proper spacing
    hero_p_css = '''
    .hero p {
      font-size: clamp(1.1rem, 2vw, 1.25rem);
      color: rgba(255,255,255,0.92);
      text-shadow: 0 1px 8px rgba(0,0,0,0.35);
      margin-bottom: 40px;
      line-height: 1.8;
      text-align: center;
    }'''
    
    content = re.sub(
        r'\.hero p \{[^}]*\}',
        hero_p_css,
        content,
        flags=re.DOTALL
    )
    
    # 5. Fix hero-cta styling
    hero_cta_css = '''
    .hero-cta {
      display: inline-flex;
      gap: 16px;
      flex-wrap: wrap;
      justify-content: center;
    }'''
    
    content = re.sub(
        r'\.hero-cta \{[^}]*\}',
        hero_cta_css,
        content,
        flags=re.DOTALL
    )
    
    # 6. Clean up any duplicate body rules
    if 'body {' in content:
        # Find all body rules and consolidate
        body_rules = re.findall(r'body \{[^}]*\}', content, flags=re.DOTALL)
        if len(body_rules) > 1:
            # Remove all body rules
            content = re.sub(r'body \{[^}]*\}', '', content, flags=re.DOTALL)
            # Add one clean body rule at the beginning
            clean_body = '''body {
      background: var(--charcoal);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: var(--text);
      overflow-x: hidden;
      line-height: 1.6;
      position: relative;
      margin: 0;
      padding: 0;
    }'''
            # Insert after the last CSS variable definition or at style start
            content = re.sub(
                r'(:root \{[^}]*\})',
                r'\1\n\n    ' + clean_body,
                content,
                count=1,
                flags=re.DOTALL
            )
    
    # 7. Remove any corrupted language dropdown remnants
    content = re.sub(r'\[dir="rtl"\]\s*(?=/\*|\.)', '', content)
    
    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    print("🔧 Fixing Hero Section Titles and Styling...")
    print("=" * 70)
    
    fixed_count = 0
    for file_path in service_files:
        path = Path(file_path)
        if path.exists():
            if fix_hero_section(file_path):
                print(f"✅ Fixed: {file_path}")
                fixed_count += 1
            else:
                print(f"ℹ️  No changes: {file_path}")
        else:
            print(f"❌ Not found: {file_path}")
    
    print("\n" + "=" * 70)
    print(f"✨ Fixed {fixed_count} service pages!")
    print("\n📌 Changes applied:")
    print("   ✅ Removed duplicate hero CSS rules")
    print("   ✅ Fixed h1 title alignment and spacing")
    print("   ✅ Centered hero content properly")
    print("   ✅ Added proper gaps and margins")
    print("   ✅ Cleaned up corrupted CSS")

if __name__ == '__main__':
    main()
