#!/usr/bin/env python3
"""Fix all white boxes and darken feature cards"""

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
        
        # Change feature cards from light to very dark with spotlight effect
        content = re.sub(
            r'\.feature-card\s*\{[^}]*background:[^;]+;[^}]*backdrop-filter:[^;]+;[^}]*-webkit-backdrop-filter:[^;]+;',
            r'''.feature-card {
      position: relative;
      background: rgba(17, 17, 17, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      overflow: hidden;
      --mouse-x: 50%;
      --mouse-y: 50%;''',
            content,
            flags=re.DOTALL
        )
        
        # Add spotlight effect to feature cards
        if '.feature-card:hover {' in content and '.feature-card::before' not in content:
            content = re.sub(
                r'(\.feature-card:hover\s*\{)',
                r'''.feature-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(201, 169, 97, 0.15), transparent 80%);
      opacity: 0;
      transition: opacity 0.5s ease;
      pointer-events: none;
    }

    .feature-card:hover::before {
      opacity: 1;
    }

    \1''',
                content,
                count=1
            )
        
        # Fix contact section background
        content = re.sub(
            r'#contact\s*\{[^}]*\}',
            r'''#contact {
      padding: 100px 5% 0;
      background: rgba(10, 10, 10, 0.95);
      margin: 0;
    }''',
            content
        )
        
        # Ensure footer has no gap
        if 'footer {' not in content:
            content = re.sub(
                r'</style>',
                r'''    footer {
      margin: 0;
      padding: 40px 5%;
      background: var(--charcoal);
    }
  </style>''',
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
