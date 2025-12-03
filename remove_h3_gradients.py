#!/usr/bin/env python3
"""Remove gradient-text from h3 elements, keep only on h1/h2"""

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
        
        # Remove gradient-text classes from h3 tags (keep h1, h2)
        content = re.sub(
            r'(<h3[^>]*class="[^"]*)\s*gradient-text[^"]*"',
            lambda m: m.group(1) + '"',
            content
        )
        
        # Clean up double spaces in class
        content = re.sub(r'class="\s+', 'class="', content)
        content = re.sub(r'\s+"', '"', content)
        
        if content != original_content:
            file_path.write_text(content, encoding='utf-8')
            print(f"✅ Fixed: {service_file}")
        else:
            print(f"ℹ️  No changes needed: {service_file}")
            
    except Exception as e:
        print(f"❌ Error processing {service_file}: {e}")

print("\n✅ All service pages processed!")
