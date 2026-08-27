#!/usr/bin/env bash
#
# sync-vscode.sh — sync TextMate output with kolang-vscode
#
# Replaces the TextMate-format output (textmate/kolang.tmLanguage.json)
# in the kolang-vscode repository:
#   ../kolang-vscode/syntaxes/kolang.tmLanguage.json
#
# Usage:
#   ./scripts/sync-vscode.sh [DEST]
#   (DEST defaults to: ../kolang-vscode/syntaxes/kolang.tmLanguage.json)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
SOURCE="$ROOT_DIR/textmate/kolang.tmLanguage.json"
DEST="${1:-$ROOT_DIR/../kolang-vscode/syntaxes/kolang.tmLanguage.json}"

if [ ! -f "$SOURCE" ]; then
  echo "error: source file not found: $SOURCE" >&2
  exit 1
fi

mkdir -p "$(dirname "$DEST")"
cp "$SOURCE" "$DEST"
echo "✓ Synced: $DEST"
