#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MCP="$ROOT/mcp"

echo
echo "Editorial Emulator MCP · instalación"
echo

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js 20+ es obligatorio."
  echo "Instálalo y vuelve a ejecutar este script."
  exit 1
fi

MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$MAJOR" -lt 20 ]; then
  echo "ERROR: se requiere Node.js 20+. Actual: $(node -v)"
  exit 1
fi

cd "$MCP"
npm install
npm run check

echo
echo "LISTO"
echo "Servidor: $MCP/server.mjs"
echo
echo "Antes de usarlo configura en tu cliente MCP:"
echo "  EDITORIAL_SUPABASE_EMAIL"
echo "  EDITORIAL_SUPABASE_PASSWORD"
echo
echo "La URL y la anon key se leen automáticamente desde:"
echo "  $ROOT/supabase-config.js"
echo
echo "Guía: https://lordjeferies.github.io/editorial-emulator/mcp.html?v=31"
