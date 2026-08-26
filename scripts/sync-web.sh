#!/usr/bin/env bash
#
# sync-web.sh — همگام‌سازی خروجی CodeMirror با kolang-web
#
# توکن‌ایزر CodeMirror (codemirror/kolang-syntax.js) را در مخزن kolang-web
# جایگزین می‌کند:
#   ../kolang-web/src/kolang-syntax.js
#
# کاربرد:
#   ./scripts/sync-web.sh [DEST]
#   (پیش‌فرض DEST: ../kolang-web/src/kolang-syntax.js)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
SOURCE="$ROOT_DIR/codemirror/kolang-syntax.js"
DEST="${1:-$ROOT_DIR/../kolang-web/src/kolang-syntax.js}"

if [ ! -f "$SOURCE" ]; then
  echo "error: فایل منبع یافت نشد: $SOURCE" >&2
  exit 1
fi

mkdir -p "$(dirname "$DEST")"
cp "$SOURCE" "$DEST"
echo "✓ همگام شد: $DEST"