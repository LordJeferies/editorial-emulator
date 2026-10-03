#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MCP="$ROOT/mcp"

echo
echo "Editorial Emulator MCP · instalación genérica"
echo

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js 20+ es obligatorio."
  echo "En macOS puedes usar el setup recomendado: ./setup-mac.sh"
  exit 1
fi

MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$MAJOR" -lt 20 ]; then
  echo "ERROR: se requiere Node.js 20+. Actual: $(node -v)"
  exit 1
fi

cd "$MCP"
npm install --no-audit --no-fund
npm run check

echo
echo "LISTO"
echo "Servidor: $MCP/server.mjs"
echo
echo "En macOS se recomienda ejecutar también:"
echo "  chmod +x setup-mac.sh"
echo "  ./setup-mac.sh"
echo
echo "El setup de Mac guarda las credenciales en Keychain y crea:"
echo "  ~/.local/bin/editorial-emulator-mcp"
echo
echo "Guía paso a paso:"
echo "  https://lordjeferies.github.io/editorial-emulator/mcp.html?v=32"
