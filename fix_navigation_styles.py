#!/usr/bin/env python3
"""Remove inline navigation styles from service pages and let them use the shared navigation.css component"""

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

def fix_navigation_styles(file_path):
    """Remove inline navigation styles from service pages"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to remove navigation styles from the <style> tag
    # Match from /* Navigation */ to the end of navigation-related styles
    patterns_to_remove = [
        # Remove the navigation comment and all nav styles
        (r'/\* Navigation \*/.*?(?=/\*|\</style>)', ''),
        # Remove language dropdown styles  
        (r'/\* Language Dropdown.*?\[dir="rtl"\] \.language-menu \{ right: 0; left: auto; \}', ''),
        # Remove hamburger styles
        (r'\.hamburger \{.*?\}', ''),
    ]
    
    original_content = content
    
    # More targeted approach: remove just the inline nav styles block
    # Find the navigation styles section and remove it
    nav_styles_pattern = r'(/\* Navigation \*/\s*nav \{.*?z-index: 999;\s*\})'
    content = re.sub(nav_styles_pattern, '', content, flags=re.DOTALL)
    
    # Remove .nav-logo styles
    content = re.sub(r'\.nav-logo \{[^}]*\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\.nav-logo:hover \{[^}]*\}', '', content, flags=re.DOTALL)
    
    # Remove .nav-links styles
    content = re.sub(r'\.nav-links \{[^}]*\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\.nav-links a \{[^}]*\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\.nav-links a:hover \{[^}]*\}', '', content, flags=re.DOTALL)
    
    # Remove language dropdown styles
    content = re.sub(r'\.language-dropdown \{[^}]*\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\.language-toggle \{[^}]*\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\.language-toggle__flag \{[^}]*\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\.language-menu \{[^}]*\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\.lang-title \{[^}]*\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\.lang-list \{[^}]*\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\.lang-list__button \{[^}]*\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\.lang-list__button:hover \{[^}]*\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\[dir="rtl"\] \.language-menu \{[^}]*\}', '', content, flags=re.DOTALL)
    
    # Remove hamburger styles
    content = re.sub(r'\.hamburger \{[^}]*\}', '', content, flags=re.DOTALL)
    
    # Clean up extra whitespace
    content = re.sub(r'\n\s*\n\s*\n+', '\n\n', content)
    
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    print("🔧 Removing inline navigation styles from service pages...")
    print("=" * 60)
    
    for file_path in service_files:
        path = Path(file_path)
        if path.exists():
            if fix_navigation_styles(file_path):
                print(f"✅ Fixed: {file_path}")
            else:
                print(f"ℹ️  No changes needed: {file_path}")
        else:
            print(f"❌ Not found: {file_path}")
    
    print("=" * 60)
    print("✨ Done! Navigation styles removed from service pages.")
    print("📌 The pages will now use the shared navigation.css component.")

if __name__ == '__main__':
    main()
