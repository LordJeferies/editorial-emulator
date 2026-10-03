#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
APP_NAME="Editorial Emulator"
APP="$ROOT/dist/${APP_NAME}.app"
ZIP="$ROOT/dist/Editorial-Emulator-macOS.zip"
SRC="$ROOT/desktop/mac/App.swift"
PLIST="$ROOT/desktop/mac/Info.plist"
ICON_SVG="$ROOT/icons/icon.svg"
TMP="${TMPDIR:-/tmp}/editorial-emulator-iconset-$$"

command -v xcrun >/dev/null || { echo "Falta Xcode Command Line Tools. Ejecuta: xcode-select --install"; exit 1; }
command -v ditto >/dev/null || { echo "Falta ditto en macOS."; exit 1; }

rm -rf "$APP" "$ZIP" "$TMP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources" "$ROOT/dist"
cp "$PLIST" "$APP/Contents/Info.plist"

ARCH="$(uname -m)"
TARGET=""
case "$ARCH" in
  arm64) TARGET="arm64-apple-macos13.0" ;;
  x86_64) TARGET="x86_64-apple-macos13.0" ;;
  *) echo "Arquitectura no soportada: $ARCH"; exit 1 ;;
esac

echo "[1/5] Compilando $APP_NAME para $ARCH..."
xcrun swiftc -O -target "$TARGET" -framework AppKit -framework WebKit "$SRC" -o "$APP/Contents/MacOS/$APP_NAME"
chmod +x "$APP/Contents/MacOS/$APP_NAME"

echo "[2/5] Generando icono macOS..."
mkdir -p "$TMP/icon.iconset" "$TMP/render"
ICON_OK=0
if [ -f "$ICON_SVG" ] && command -v qlmanage >/dev/null; then
  qlmanage -t -s 1024 -o "$TMP/render" "$ICON_SVG" >/dev/null 2>&1 || true
  RENDERED="$(find "$TMP/render" -maxdepth 1 -type f -name '*.png' | head -1 || true)"
  if [ -n "$RENDERED" ] && [ -f "$RENDERED" ]; then
    sips -z 16 16 "$RENDERED" --out "$TMP/icon.iconset/icon_16x16.png" >/dev/null
    sips -z 32 32 "$RENDERED" --out "$TMP/icon.iconset/icon_16x16@2x.png" >/dev/null
    sips -z 32 32 "$RENDERED" --out "$TMP/icon.iconset/icon_32x32.png" >/dev/null
    sips -z 64 64 "$RENDERED" --out "$TMP/icon.iconset/icon_32x32@2x.png" >/dev/null
    sips -z 128 128 "$RENDERED" --out "$TMP/icon.iconset/icon_128x128.png" >/dev/null
    sips -z 256 256 "$RENDERED" --out "$TMP/icon.iconset/icon_128x128@2x.png" >/dev/null
    sips -z 256 256 "$RENDERED" --out "$TMP/icon.iconset/icon_256x256.png" >/dev/null
    sips -z 512 512 "$RENDERED" --out "$TMP/icon.iconset/icon_256x256@2x.png" >/dev/null
    sips -z 512 512 "$RENDERED" --out "$TMP/icon.iconset/icon_512x512.png" >/dev/null
    sips -z 1024 1024 "$RENDERED" --out "$TMP/icon.iconset/icon_512x512@2x.png" >/dev/null
    if iconutil -c icns "$TMP/icon.iconset" -o "$APP/Contents/Resources/AppIcon.icns" >/dev/null 2>&1; then ICON_OK=1; fi
  fi
fi
if [ "$ICON_OK" -eq 0 ]; then
  echo "  Aviso: no se pudo generar AppIcon.icns; macOS usará icono genérico."
fi

echo "[3/5] Firma ad-hoc..."
codesign --force --deep --sign - "$APP" >/dev/null

echo "[4/5] Empaquetando..."
ditto -c -k --sequesterRsrc --keepParent "$APP" "$ZIP"

echo "[5/5] Validando..."
/usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' "$APP/Contents/Info.plist" >/dev/null
codesign --verify --deep --strict "$APP"

rm -rf "$TMP"
echo
echo "LISTO"
echo "App: $APP"
echo "ZIP: $ZIP"
