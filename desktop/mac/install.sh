#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
APP_NAME="Editorial Emulator"
SOURCE="$ROOT/dist/${APP_NAME}.app"
DEST="/Applications/${APP_NAME}.app"
DESKTOP_ALIAS="$HOME/Desktop/${APP_NAME}.app"

if [ ! -d "$SOURCE" ]; then
  "$ROOT/desktop/mac/build.sh"
fi

rm -rf "$DEST"
ditto "$SOURCE" "$DEST"
xattr -dr com.apple.quarantine "$DEST" 2>/dev/null || true

# Alias en Escritorio. Si ya existe, lo sustituye.
rm -f "$DESKTOP_ALIAS" 2>/dev/null || true
osascript <<OSA
try
  tell application "Finder"
    set appFile to POSIX file "$DEST" as alias
    set desktopFolder to path to desktop folder
    make new alias file at desktopFolder to appFile with properties {name:"$APP_NAME"}
  end tell
end try
OSA

open "$DEST"
echo "Instalado: $DEST"
echo "También se creó un alias en el Escritorio cuando Finder lo permitió."
