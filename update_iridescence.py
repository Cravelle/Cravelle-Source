#!/usr/bin/env python3
"""Update all service pages with WebGL iridescence and fix gradient text"""

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

# WebGL iridescence script to add before </body>
iridescence_script = '''
  <!-- WebGL Iridescence Background -->
  <script type="module">
    import { initIridescence } from '../src/js/iridescence-webgl.js';
    
    // Initialize WebGL iridescence on page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initIridescence('body', {
          color: [1, 1, 1],
          speed: 1.0,
          amplitude: 0.1,
          mouseReact: false
        });
      });
    } else {
      initIridescence('body', {
        color: [1, 1, 1],
        speed: 1.0,
        amplitude: 0.1,
        mouseReact: false
      });
    }
  </script>
</body>'''

for service_file in service_files:
    file_path = Path(service_file)
    
    if not file_path.exists():
        print(f"❌ File not found: {service_file}")
        continue
    
    try:
        content = file_path.read_text(encoding='utf-8')
        original_content = content
        
        # Remove old CSS iridescence div if it exists
        content = re.sub(
            r'  <!-- Iridescence Background -->\s*<div class="iridescence-bg">.*?</div>\s*',
            '',
            content,
            flags=re.DOTALL
        )
        
        # Add WebGL iridescence script before </body>
        if '<script type="module">' not in content or 'initIridescence' not in content:
            content = content.replace('</body>', iridescence_script)
        
        if content != original_content:
            file_path.write_text(content, encoding='utf-8')
            print(f"✅ Updated: {service_file}")
        else:
            print(f"ℹ️  No changes needed: {service_file}")
            
    except Exception as e:
        print(f"❌ Error processing {service_file}: {e}")

print("\n✅ All service pages processed!")
