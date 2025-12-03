#!/usr/bin/env python3
"""Comprehensive fix: alignment, gaps, and color consistency"""

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

def fix_service_page(file_path):
    """Fix alignment, gaps, and color consistency"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # 1. Fix section-header alignment - ensure proper centering
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
    
    # 2. Fix section-header h2 alignment
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
    
    # 3. Fix gallery section header alignment
    if '.gallery-section .section-header' in content:
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
    
    # 4. Fix footer to remove gap below contact section
    content = re.sub(
        r'footer \{[^}]*\}',
        '''footer {
      background-color: var(--charcoal);
      color: var(--platinum);
      text-align: center;
      padding: 40px 5%;
      font-size: 14px;
      margin: 0;
    }''',
        content,
        flags=re.DOTALL
    )
    
    # 5. Fix body to prevent gaps
    if 'body {' in content:
        content = re.sub(
            r'body \{([^}]*)\}',
            lambda m: 'body {\n' + m.group(1).strip() + '\n      margin: 0;\n      padding: 0;\n    }',
            content,
            flags=re.DOTALL
        )
    
    # 6. Ensure CTA section has no bottom margin
    content = re.sub(
        r'(\.cta-section \{[^}]*)(padding: 100px 5%;)',
        r'\1padding: 100px 5% 80px 5%;\n      margin: 0;',
        content,
        flags=re.DOTALL
    )
    
    # 7. Update gradient colors to match elegant palette across all gradients
    # Change gradient-text--default to use elegant gold colors
    content = re.sub(
        r'<h2 class="gradient-text gradient-text--default"',
        '<h2 class="gradient-text gradient-text--gold"',
        content
    )
    
    # Change gradient-text--purple to use champagne gold
    # (already using elegant colors, keep as is)
    
    # Change gradient-text--blue to use elegant silver
    # (already using elegant colors, keep as is)
    
    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def update_gradient_css():
    """Update gradient-text.css to use only elegant premium colors"""
    file_path = 'src/css/components/gradient-text.css'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Update gradient-text--default to use elegant gold instead of rainbow
    content = re.sub(
        r'\.gradient-text--default \{[^}]*\}',
        '''.gradient-text--default {
  background: linear-gradient(
    to right,
    #C9A961 0%,
    #D4AF37 25%,
    #F4D03F 50%,
    #D4AF37 75%,
    #C9A961 100%
  );
  background-size: 200% auto;
}''',
        content,
        flags=re.DOTALL
    )
    
    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    print("🔧 Comprehensive Fix: Alignment, Gaps & Color Consistency")
    print("=" * 70)
    
    # Fix gradient CSS first
    print("\n📄 Updating gradient colors to elegant palette...")
    if update_gradient_css():
        print("✅ Updated: src/css/components/gradient-text.css")
    else:
        print("ℹ️  No changes: src/css/components/gradient-text.css")
    
    # Fix all service pages
    print("\n📄 Fixing service pages...")
    fixed_count = 0
    
    for file_path in service_files:
        path = Path(file_path)
        if path.exists():
            if fix_service_page(file_path):
                print(f"✅ Fixed: {file_path}")
                fixed_count += 1
            else:
                print(f"ℹ️  No changes: {file_path}")
        else:
            print(f"❌ Not found: {file_path}")
    
    print("\n" + "=" * 70)
    print(f"✨ Fixed {fixed_count} service pages!")
    print("\n📌 Changes applied:")
    print("   ✅ Centered all section headers properly")
    print("   ✅ Removed gaps below contact section")
    print("   ✅ Fixed footer margins")
    print("   ✅ Updated gradient colors to elegant premium palette")
    print("   ✅ Ensured consistent color scheme across all pages")

if __name__ == '__main__':
    main()
