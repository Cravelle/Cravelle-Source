#!/usr/bin/env python3
"""Final cleanup: remove duplicate rules and extra whitespace"""

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

def final_cleanup(file_path):
    """Remove duplicates and clean whitespace"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Remove extra whitespace between CSS rules (more than 2 newlines)
    content = re.sub(r'\n\s*\n\s*\n+', '\n\n', content)
    
    # Find and remove duplicate body rules, keeping only one consolidated version
    body_match = re.search(r'body \{[^}]*\}', content, flags=re.DOTALL)
    if body_match:
        # Remove all body rules
        content = re.sub(r'body \{[^}]*\}', '', content, flags=re.DOTALL)
        
        # Add one clean body rule after :root
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
        
        # Insert after :root block
        content = re.sub(
            r'(:root \{[^}]*\})',
            r'\1\n\n    ' + clean_body,
            content,
            count=1,
            flags=re.DOTALL
        )
    
    # Remove empty comment blocks
    content = re.sub(r'/\* Language Dropdown \(minimal styles\) \*/\s*(?=/\*|\.|\[)', '', content)
    content = re.sub(r'\[dir="rtl"\]\s*(?=/\*|\.)', '', content)
    
    # Clean up extra whitespace again after removals
    content = re.sub(r'\n\s*\n\s*\n+', '\n\n', content)
    
    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    print("🧹 Final Cleanup: Removing Duplicates and Whitespace...")
    print("=" * 70)
    
    fixed_count = 0
    for file_path in service_files:
        path = Path(file_path)
        if path.exists():
            if final_cleanup(file_path):
                print(f"✅ Cleaned: {file_path}")
                fixed_count += 1
            else:
                print(f"ℹ️  Already clean: {file_path}")
        else:
            print(f"❌ Not found: {file_path}")
    
    print("\n" + "=" * 70)
    print(f"✨ Cleaned {fixed_count} service pages!")

if __name__ == '__main__':
    main()
