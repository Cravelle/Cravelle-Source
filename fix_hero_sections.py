#!/usr/bin/env python3
"""Fix hero sections: remove backgrounds, ensure dark theme"""

import re
from pathlib import Path

service_files = [
    "services/academy.html",
    "services/diplomacy.html",
    "services/translation.html",
    "services/trade.html",
    "services/prive.html",
    "services/digital.html",
    "services/voice.html",
    "services/connect.html",
    "services/edu-connect.html",
]

for service_file in service_files:
    file_path = Path(service_file)
    
    if not file_path.exists():
        print(f"❌ File not found: {service_file}")
        continue
    
    try:
        content = file_path.read_text(encoding='utf-8')
        original_content = content
        
        # Remove any remaining background images from hero
        content = re.sub(
            r'(\.hero\s*\{[^}]*?)background:[^;]+url\([^)]+\)[^;]*;',
            r'\1',
            content,
            flags=re.DOTALL
        )
        
        # Ensure hero has proper height and styling without background
        content = re.sub(
            r'\.hero\s*\{[^}]*\}',
            lambda m: re.sub(r'min-height:[^;]+;', '', m.group(0)),
            content,
            flags=re.DOTALL
        )
        
        # Add consistent hero styling
        if '.hero {' in content:
            content = re.sub(
                r'(\.hero\s*\{)',
                r'\1\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      min-height: 60vh;\n      padding: 120px 5% 80px;\n      text-align: center;\n      position: relative;',
                content,
                count=1
            )
        
        if content != original_content:
            file_path.write_text(content, encoding='utf-8')
            print(f"✅ Fixed: {service_file}")
        else:
            print(f"ℹ️  No changes needed: {service_file}")
            
    except Exception as e:
        print(f"❌ Error processing {service_file}: {e}")

print("\n✅ All service pages processed!")
