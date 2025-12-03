#!/usr/bin/env python3
"""Fix service page navigation to match landing page"""

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

new_nav = '''<nav role="navigation" aria-label="Main navigation" class="nav">
    <div class="nav__left">
        <a href="/" aria-label="Home"><img src="/images/assets/logos/logo.png" alt="Cravelle Logo" class="nav__logo"></a>
    </div>

    <div class="nav__center desktop-only">
        <div id="navLinks" class="nav__links" aria-label="Primary">
            <a href="/" class="nav__link" data-key="homeNav">Home</a>
            <a href="/services/academy.html" class="nav__link" data-key="servicesNav">Services</a>
            <a href="/#values" class="nav__link" data-key="valuesNav">Values</a>
            <a href="#contact" class="nav__link" data-key="contactNav">Contact</a>
        </div>
    </div>

    <div class="nav__right">
        <div class="language-dropdown" id="languageGroup">
            <button id="language-toggle" class="language-toggle" aria-haspopup="true" aria-expanded="false" onclick="toggleLanguageMenu(event)">
                <img src="https://flagcdn.com/w20/gb.png" alt="UK Flag" class="language-toggle__flag" id="current-flag"> English
            </button>
            <div id="language-menu" class="language-menu" role="menu" aria-hidden="true">
                <div class="lang-block">
                    <div class="lang-title">Languages</div>
                    <div class="lang-list">
                        <button class="lang-list__button" onclick="changeLanguage('en', event)"><img src="https://flagcdn.com/w20/gb.png" alt=""> English</button>
                        <button class="lang-list__button" onclick="changeLanguage('tr', event)"><img src="https://flagcdn.com/w20/tr.png" alt=""> Türkçe</button>
                        <button class="lang-list__button" onclick="changeLanguage('pl', event)"><img src="https://flagcdn.com/w20/pl.png" alt=""> Polski</button>
                        <button class="lang-list__button" onclick="changeLanguage('ar', event)"><img src="https://flagcdn.com/w20/eg.png" alt=""> العربية</button>
                    </div>
                </div>
            </div>
        </div>

        <button class="hamburger" id="hamburger" aria-label="Menu" aria-expanded="false" onclick="toggleMobileMenu()">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>
</nav>'''

for service_file in service_files:
    file_path = Path(service_file)
    
    if not file_path.exists():
        print(f"❌ File not found: {service_file}")
        continue
    
    try:
        content = file_path.read_text(encoding='utf-8')
        original_content = content
        
        # Replace navigation
        content = re.sub(
            r'<nav[^>]*>.*?</nav>',
            new_nav,
            content,
            flags=re.DOTALL
        )
        
        if content != original_content:
            file_path.write_text(content, encoding='utf-8')
            print(f"✅ Fixed: {service_file}")
        else:
            print(f"ℹ️  No changes needed: {service_file}")
            
    except Exception as e:
        print(f"❌ Error processing {service_file}: {e}")

print("\n✅ All service pages processed!")
