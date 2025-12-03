#!/usr/bin/env python3
"""Fix service pages: remove background images, add glass morphism"""

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
        
        # Remove background-image from .hero style
        content = re.sub(
            r'(\.hero\s*\{[^}]*?)background-image:[^;]+;([^}]*?\})',
            r'\1\2',
            content,
            flags=re.DOTALL
        )
        
        # Remove background-size from .hero style
        content = re.sub(
            r'(\.hero\s*\{[^}]*?)background-size:[^;]+;([^}]*?\})',
            r'\1\2',
            content,
            flags=re.DOTALL
        )
        
        # Remove background-position from .hero style
        content = re.sub(
            r'(\.hero\s*\{[^}]*?)background-position:[^;]+;([^}]*?\})',
            r'\1\2',
            content,
            flags=re.DOTALL
        )
        
        # Add glass morphism to features section
        content = re.sub(
            r'(\.features\s*\{[^}]*?padding:\s*100px\s+5%;)',
            r'\1\n      backdrop-filter: blur(20px);\n      -webkit-backdrop-filter: blur(20px);',
            content
        )
        
        if content != original_content:
            file_path.write_text(content, encoding='utf-8')
            print(f"✅ Fixed: {service_file}")
        else:
            print(f"ℹ️  No changes needed: {service_file}")
            
    except Exception as e:
        print(f"❌ Error processing {service_file}: {e}")

print("\n✅ All service pages processed!")
