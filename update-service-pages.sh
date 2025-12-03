#!/bin/bash

# List of service files to update
SERVICE_FILES=(
  "services/connect.html"
  "services/digital.html"
  "services/diplomacy.html"
  "services/edu-connect.html"
  "services/prive.html"
  "services/trade.html"
  "services/translation.html"
  "services/voice.html"
)

echo "Service pages to update:"
for file in "${SERVICE_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  - $file"
  fi
done

echo ""
echo "Update script ready. Files found: ${#SERVICE_FILES[@]}"
