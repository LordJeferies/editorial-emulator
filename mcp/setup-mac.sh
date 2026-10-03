#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MCP="$ROOT/mcp"
BIN_DIR="$HOME/.local/bin"
LAUNCHER="$BIN_DIR/editorial-emulator-mcp"
EMAIL_SERVICE="Editorial Emulator MCP Supabase Email"
PASSWORD_SERVICE="Editorial Emulator MCP Supabase Password"
WORKSPACE="editorial-os"

echo
echo "=============================================================="
echo " Editorial Emulator MCP · Setup macOS"
echo "=============================================================="
echo

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "ERROR: este setup está diseñado para macOS."
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  if command -v brew >/dev/null 2>&1; then
    echo "Node.js no está instalado. Instalando Node 20 con Homebrew..."
    brew install node@20
    export PATH="$(brew --prefix node@20)/bin:$PATH"
  else
    echo "ERROR: falta Node.js 20+ y Homebrew no está disponible."
    echo "Instala Node.js 20+ y vuelve a ejecutar este script."
    exit 1
  fi
fi

MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [[ "$MAJOR" -lt 20 ]]; then
  if command -v brew >/dev/null 2>&1; then
    echo "Node actual: $(node -v). Instalando Node 20..."
    brew install node@20 || true
    export PATH="$(brew --prefix node@20)/bin:$PATH"
  fi
fi

MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [[ "$MAJOR" -lt 20 ]]; then
  echo "ERROR: se requiere Node.js 20+. Actual: $(node -v)"
  exit 1
fi

echo "[1/5] Instalando dependencias MCP..."
cd "$MCP"
npm install --no-audit --no-fund

echo "[2/5] Validando servidor..."
npm run check

echo "[3/5] Guardando credenciales en Keychain..."
read -r -p "Email de Supabase: " EMAIL
if [[ -z "$EMAIL" ]]; then
  echo "ERROR: el email no puede estar vacío."
  exit 1
fi

read -r -s -p "Contraseña de Supabase: " PASSWORD
echo
if [[ -z "$PASSWORD" ]]; then
  echo "ERROR: la contraseña no puede estar vacía."
  exit 1
fi

security add-generic-password -U -a "$USER" -s "$EMAIL_SERVICE" -w "$EMAIL" >/dev/null
security add-generic-password -U -a "$USER" -s "$PASSWORD_SERVICE" -w "$PASSWORD" >/dev/null
unset PASSWORD

echo "[4/5] Creando launcher seguro..."
mkdir -p "$BIN_DIR"
cat > "$LAUNCHER" <<EOF
#!/bin/bash
set -euo pipefail
ROOT="$ROOT"
EMAIL="\$(security find-generic-password -a "\$USER" -s "$EMAIL_SERVICE" -w)"
PASSWORD="\$(security find-generic-password -a "\$USER" -s "$PASSWORD_SERVICE" -w)"
export EDITORIAL_SUPABASE_EMAIL="\$EMAIL"
export EDITORIAL_SUPABASE_PASSWORD="\$PASSWORD"
export EDITORIAL_WORKSPACE="$WORKSPACE"
exec "\$(command -v node)" "\$ROOT/mcp/server.mjs"
EOF
chmod 700 "$LAUNCHER"

echo "[5/5] Verificando archivos..."
test -f "$MCP/server.mjs"
test -x "$LAUNCHER"

echo
echo "=============================================================="
echo " LISTO"
echo "=============================================================="
echo
echo "Launcher MCP:"
echo "  $LAUNCHER"
echo
echo "Tus credenciales quedaron en Keychain; no están en el repo."
echo
echo "Configura tu cliente MCP con:"
echo
cat <<EOF
{
  "mcpServers": {
    "editorial-emulator": {
      "command": "$LAUNCHER"
    }
  }
}
EOF

echo
echo "Primera prueba recomendada:"
echo "  Comprueba que Editorial Emulator MCP esté conectado y dime qué workspace usa."
echo
echo "Guía pública:"
echo "  https://lordjeferies.github.io/editorial-emulator/mcp.html?v=32"
echo