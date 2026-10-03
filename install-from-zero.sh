#!/bin/bash
set -euo pipefail

APP_NAME="Editorial Emulator"
PROJECT="$HOME/Downloads/editorial-emulator"
REPO_URL="https://github.com/LordJeferies/editorial-emulator.git"
RELEASE_URL="https://github.com/LordJeferies/editorial-emulator/releases/download/desktop-latest/Editorial-Emulator-macOS.zip"
KEY_HASH="ad2933fb937d4aff05e49bfc9f2349255c1ca7e5eb354ce75e3dc34a2bbc2ee0"

fail(){ echo; echo "ERROR: $1" >&2; exit 1; }
step(){ echo; echo "[$1] $2"; }
sha(){ printf '%s' "$1" | shasum -a 256 | awk '{print $1}'; }

[[ "$(uname -s)" == "Darwin" ]] || fail "Este instalador es sólo para macOS."

echo "=============================================================="
echo " Editorial Emulator · instalación limpia"
echo "=============================================================="
echo "Reinstala Desktop + repo + MCP."
echo "No borra datos de Supabase ni afecta la versión web."
echo

for attempt in 1 2 3; do
  read -r -s -p "Clave de instalación: " entered
  echo
  if [[ "$(sha "$entered")" == "$KEY_HASH" ]]; then
    unset entered
    break
  fi
  unset entered
  echo "Clave incorrecta."
  [[ "$attempt" == "3" ]] && fail "Demasiados intentos."
done

step "1/8" "Comprobando herramientas básicas..."
command -v curl >/dev/null 2>&1 || fail "Falta curl."
command -v git >/dev/null 2>&1 || fail "Falta git. Instala Xcode Command Line Tools con: xcode-select --install"
command -v ditto >/dev/null 2>&1 || fail "Falta ditto."

step "2/8" "Preparando Node.js para MCP..."
if ! command -v node >/dev/null 2>&1 || [[ "$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)" -lt 20 ]]; then
  if command -v brew >/dev/null 2>&1; then
    brew install node@20 || brew upgrade node@20 || true
    export PATH="$(brew --prefix node@20)/bin:$PATH"
  else
    open "https://nodejs.org/en/download"
    fail "Node.js 20+ no está instalado y Homebrew no está disponible. Instala Node.js 20+ desde la página que abrí y vuelve a ejecutar este instalador."
  fi
fi
[[ "$(node -p 'process.versions.node.split(".")[0]')" -ge 20 ]] || fail "Se requiere Node.js 20+."

step "3/8" "Limpiando la instalación local anterior..."
rm -rf "$PROJECT"
rm -rf "/Applications/${APP_NAME}.app" 2>/dev/null || true
rm -rf "$HOME/Applications/${APP_NAME}.app" 2>/dev/null || true
rm -f "$HOME/.local/bin/editorial-emulator-mcp" 2>/dev/null || true

step "4/8" "Descargando el repositorio actual..."
mkdir -p "$HOME/Downloads"
git clone --depth 1 "$REPO_URL" "$PROJECT"
cd "$PROJECT"
git config core.fileMode false

step "5/8" "Descargando e instalando la app Desktop..."
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
curl -fL "$RELEASE_URL" -o "$TMP/Editorial-Emulator-macOS.zip"
ditto -x -k "$TMP/Editorial-Emulator-macOS.zip" "$TMP/unpacked"
SOURCE_APP="$(find "$TMP/unpacked" -maxdepth 3 -type d -name 'Editorial Emulator.app' | head -1)"
[[ -n "$SOURCE_APP" && -d "$SOURCE_APP" ]] || fail "El ZIP no contiene Editorial Emulator.app."

if ditto "$SOURCE_APP" "/Applications/${APP_NAME}.app" 2>/dev/null; then
  APP_PATH="/Applications/${APP_NAME}.app"
else
  mkdir -p "$HOME/Applications"
  ditto "$SOURCE_APP" "$HOME/Applications/${APP_NAME}.app"
  APP_PATH="$HOME/Applications/${APP_NAME}.app"
fi
xattr -dr com.apple.quarantine "$APP_PATH" 2>/dev/null || true

step "6/8" "Instalando y configurando MCP..."
chmod +x "$PROJECT/mcp/install.sh" "$PROJECT/mcp/setup-mac.sh"
cd "$PROJECT/mcp"
./setup-mac.sh

step "7/8" "Validando instalación..."
[[ -d "$APP_PATH" ]] || fail "No encontré la app Desktop."
[[ -x "$HOME/.local/bin/editorial-emulator-mcp" ]] || fail "No encontré el launcher MCP."
node --check "$PROJECT/mcp/server.mjs"

step "8/8" "Abriendo Editorial Emulator..."
open "$APP_PATH"
open "https://lordjeferies.github.io/editorial-emulator/?v=32"

echo
echo "=============================================================="
echo " INSTALACIÓN COMPLETA"
echo "=============================================================="
echo "App Desktop: $APP_PATH"
echo "Repo:        $PROJECT"
echo "MCP:         $HOME/.local/bin/editorial-emulator-mcp"
echo "Web:         https://lordjeferies.github.io/editorial-emulator/?v=32"
echo "Instalador:  https://lordjeferies.github.io/editorial-emulator/install.html?v=32"
echo
echo "Supabase no fue borrado. La app web sigue funcionando independientemente de esta instalación."
