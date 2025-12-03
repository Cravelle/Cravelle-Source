#!/usr/bin/env python3
"""Fix white boxes, center titles, and fix contact section backgrounds"""

import re
from pathlib import Path

def fix_index_html():
    """Remove section--light class from index.html to fix white boxes"""
    file_path = 'index.html'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Remove all section--light classes
    content = re.sub(r'\s*section--light', '', content)
    
    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def fix_service_pages():
    """Fix service pages: center titles and fix contact background"""
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
    
    results = []
    
    for file_path in service_files:
        path = Path(file_path)
        if not path.exists():
            results.append((file_path, 'NOT FOUND'))
            continue
            
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Fix section-header to ensure proper centering
        content = re.sub(
            r'\.section-header \{[^}]*\}',
            '''.section-header {
      text-align: center;
      max-width: 700px;
      margin: 0 auto 60px;
    }''',
            content,
            flags=re.DOTALL
        )
        
        # Fix contact section background to black instead of blue gradient
        content = re.sub(
            r'\.cta-section \{\s*padding: 100px 5%;[^}]*background:[^;]*;',
            '''.cta-section {
      padding: 100px 5%;
      background: rgba(10, 10, 10, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);''',
            content,
            flags=re.DOTALL
        )
        
        # Ensure .section-header h2 is centered
        if '.section-header h2 {' in content:
            content = re.sub(
                r'\.section-header h2 \{[^}]*\}',
                '''.section-header h2 {
      font-family: 'Playfair Display', serif;
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 700;
      margin-bottom: 16px;
      text-align: center;
    }''',
                content,
                flags=re.DOTALL
            )
        
        # Make sure gallery section headers are centered
        content = re.sub(
            r'\.gallery-section \.section-header \{[^}]*\}',
            '''.gallery-section .section-header {
      text-align: center;
      max-width: 700px;
      margin: 0 auto 60px;
    }''',
            content,
            flags=re.DOTALL
        )
        
        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            results.append((file_path, 'FIXED'))
        else:
            results.append((file_path, 'NO CHANGES'))
    
    return results

def main():
    print("🔧 Fixing white boxes, title alignment, and contact backgrounds...")
    print("=" * 70)
    
    # Fix index.html
    print("\n📄 Fixing index.html...")
    if fix_index_html():
        print("✅ Fixed: index.html - Removed section--light classes")
    else:
        print("ℹ️  No changes needed: index.html")
    
    # Fix service pages
    print("\n📄 Fixing service pages...")
    results = fix_service_pages()
    
    for file_path, status in results:
        if status == 'FIXED':
            print(f"✅ Fixed: {file_path}")
        elif status == 'NO CHANGES':
            print(f"ℹ️  No changes: {file_path}")
        else:
            print(f"❌ {status}: {file_path}")
    
    print("\n" + "=" * 70)
    print("✨ All fixes applied!")
    print("📌 Changes made:")
    print("   - Removed all section--light classes from index.html (white boxes)")
    print("   - Centered all section headers in service pages")
    print("   - Changed contact section background from blue to black")

if __name__ == '__main__':
    main()
