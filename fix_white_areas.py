#!/usr/bin/env python3
"""Fix white areas in service pages - ensure dark theme"""

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
        
        # Change gallery section background from pearl to dark with glass
        content = re.sub(
            r'(\.gallery-section\s*\{[^}]*?)background:\s*var\(--pearl\);',
            r'\1background: rgba(26, 26, 26, 0.85);\n      backdrop-filter: blur(20px);\n      -webkit-backdrop-filter: blur(20px);',
            content
        )
        
        # Change contact section background to dark
        content = re.sub(
            r'(\.contact-section\s*\{[^}]*?)background:\s*var\(--pearl\);',
            r'\1background: rgba(10, 10, 10, 0.9);\n      backdrop-filter: blur(20px);\n      -webkit-backdrop-filter: blur(20px);',
            content
        )
        
        # Ensure body has dark background
        content = re.sub(
            r'body\s*\{',
            r'body {\n      background: var(--charcoal);',
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
