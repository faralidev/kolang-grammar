#!/usr/bin/env bash
#
# sync-vscode.sh — همگام‌سازی خروجی TextMate با kolang-vscode
#
# خروجی فرمت TextMate (textmate/kolang.tmLanguage.json) را در مخزن
# kolang-vscode جایگزین می‌کند:
#   ../kolang-vscode/syntaxes/kolang.tmLanguage.json
#
# کاربرد:
#   ./scripts/sync-vscode.sh [DEST]
#   (پیش‌فرض DEST: ../kolang-vscode/syntaxes/kolang.tmLanguage.json)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
SOURCE="$ROOT_DIR/textmate/kolang.tmLanguage.json"
DEST="${1:-$ROOT_DIR/../kolang-vscode/syntaxes/kolang.tmLanguage.json}"

if [ ! -f "$SOURCE" ]; then
  echo "error: فایل منبع یافت نشد: $SOURCE" >&2
  exit 1
fi

mkdir -p "$(dirname "$DEST")"
cp "$SOURCE" "$DEST"
echo "✓ همگام شد: $DEST"