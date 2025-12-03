#!/usr/bin/env python3
"""Add spotlight cards script to service pages"""

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
        
        # Add spotlight cards script if not present
        if 'spotlight-cards.js' not in content:
            content = re.sub(
                r'(<script type="module" src="/src/js/form-handler\.js"></script>)',
                r'\1\n  <script type="module" src="/src/js/spotlight-cards.js"></script>',
                content
            )
        
        # Update iridescence initialization to use slower speed and mouse tracking
        content = re.sub(
            r'initIridescence\(\'body\',\s*\{[^}]+\}\)',
            r'''initIridescence('body', {
        color: [1, 1, 1],
        speed: 0.3,
        amplitude: 0.3,
        mouseReact: true
      })''',
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
