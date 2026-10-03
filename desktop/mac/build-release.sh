#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TAG="desktop-latest"
ASSET="$ROOT/dist/Editorial-Emulator-macOS.zip"
INSTALL=0
PUBLISH=0

for arg in "$@"; do
  case "$arg" in
    --install) INSTALL=1 ;;
    --publish) PUBLISH=1 ;;
    *) echo "Opción desconocida: $arg"; exit 2 ;;
  esac
done

"$ROOT/desktop/mac/build.sh"

if [ "$INSTALL" -eq 1 ]; then
  "$ROOT/desktop/mac/install.sh"
fi

if [ "$PUBLISH" -eq 1 ]; then
  command -v gh >/dev/null || { echo "Falta GitHub CLI (gh)."; exit 1; }
  gh auth status >/dev/null 2>&1 || { echo "Ejecuta primero: gh auth login"; exit 1; }
  cd "$ROOT"
  if gh release view "$TAG" >/dev/null 2>&1; then
    gh release upload "$TAG" "$ASSET" --clobber
    gh release edit "$TAG" --title "Editorial Emulator Desktop" --notes "Desktop macOS wrapper para la app canónica de GitHub Pages. La interfaz y los datos siguen viniendo de https://lordjeferies.github.io/editorial-emulator/ y se actualizan sin reinstalar la app."
  else
    gh release create "$TAG" "$ASSET" --title "Editorial Emulator Desktop" --notes "Desktop macOS wrapper para la app canónica de GitHub Pages. La interfaz y los datos siguen viniendo de https://lordjeferies.github.io/editorial-emulator/ y se actualizan sin reinstalar la app."
  fi
  echo "Publicado: https://github.com/LordJeferies/editorial-emulator/releases/download/$TAG/Editorial-Emulator-macOS.zip"
fi
