#!/usr/bin/env bash
#
# reindex-materials.sh
# Reads all mat-*.json files from the items/ directory and rebuilds index.json.
#
# Usage:
#   ./scripts/reindex-materials.sh [MATERIALS_DIR]
#
# If MATERIALS_DIR is not provided, defaults to:
#   _shared/assets/data/materials (relative to the project root)
#

set -euo pipefail

# Determine the materials directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

if [ -n "${1:-}" ]; then
    MATERIALS_DIR="$1"
else
    MATERIALS_DIR="$PROJECT_ROOT/_shared/assets/data/materials"
fi

ITEMS_DIR="$MATERIALS_DIR/items"
INDEX_FILE="$MATERIALS_DIR/index.json"

# Validate directories
if [ ! -d "$ITEMS_DIR" ]; then
    echo "Error: Items directory not found: $ITEMS_DIR" >&2
    exit 1
fi

# Count item files
ITEM_FILES=("$ITEMS_DIR"/mat-*.json)
if [ ! -e "${ITEM_FILES[0]}" ]; then
    echo "Warning: No mat-*.json files found in $ITEMS_DIR" >&2
    echo "[]" > "$INDEX_FILE"
    echo "Created empty index at $INDEX_FILE"
    exit 0
fi

ITEM_COUNT="${#ITEM_FILES[@]}"
echo "Found $ITEM_COUNT material item(s) in $ITEMS_DIR"

# Build index.json by merging all mat-*.json files into a JSON array
# Uses jq if available, otherwise falls back to manual assembly
if command -v jq &> /dev/null; then
    jq -s '.' "${ITEM_FILES[@]}" > "$INDEX_FILE"
else
    echo "Warning: jq not found, using fallback method" >&2

    echo "[" > "$INDEX_FILE"

    FIRST=true
    for FILE in "${ITEM_FILES[@]}"; do
        if [ "$FIRST" = true ]; then
            FIRST=false
        else
            echo "," >> "$INDEX_FILE"
        fi
        # Read file content and append (trimming trailing newline)
        cat "$FILE" | tr -d '\n' >> "$INDEX_FILE"
    done

    echo "" >> "$INDEX_FILE"
    echo "]" >> "$INDEX_FILE"
fi

echo "Index rebuilt: $INDEX_FILE ($ITEM_COUNT items)"
