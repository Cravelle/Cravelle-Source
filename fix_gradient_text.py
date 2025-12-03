#!/usr/bin/env python3
"""Fix service pages to properly support gradient text by updating inline styles"""

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

# Fix section-header h2 to not override gradient text
old_section_header_h2 = r'\.section-header h2 \{[^}]*color: var\(--accent\);[^}]*\}'
new_section_header_h2 = '''.section-header h2 {
      font-family: 'Playfair Display', serif;
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 700;
      margin-bottom: 16px;
    }
    
    .section-header h2:not(.gradient-text) {
      color: var(--accent);
    }'''

# Fix feature-card h3 to not override gradient text  
old_feature_h3 = r'\.feature-card h3 \{[^}]*color: var\(--accent\);[^}]*\}'
new_feature_h3 = '''.feature-card h3 {
      font-family: 'Playfair Display', serif;
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 12px;
    }
    
    .feature-card h3:not(.gradient-text) {
      color: var(--accent);
    }'''

for service_file in service_files:
    file_path = Path(service_file)
    
    if not file_path.exists():
        print(f"❌ File not found: {service_file}")
        continue
    
    try:
        content = file_path.read_text(encoding='utf-8')
        original_content = content
        
        # Fix section-header h2
        content = re.sub(old_section_header_h2, new_section_header_h2, content, flags=re.DOTALL)
        
        # Fix feature-card h3
        content = re.sub(old_feature_h3, new_feature_h3, content, flags=re.DOTALL)
        
        if content != original_content:
            file_path.write_text(content, encoding='utf-8')
            print(f"✅ Fixed: {service_file}")
        else:
            print(f"ℹ️  No changes needed: {service_file}")
            
    except Exception as e:
        print(f"❌ Error processing {service_file}: {e}")

print("\n✅ All service pages processed!")
