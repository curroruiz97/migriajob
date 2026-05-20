#!/usr/bin/env bash
# Migria SaaS - arranque rapido (macOS / Linux)
set -e

cd "$(dirname "$0")"

echo ""
echo "========================================"
echo "  Migria SaaS - Arranque local"
echo "========================================"
echo ""

# Si node_modules existe pero le falta `next`, está a medias.
if [ -d node_modules ] && [ ! -x node_modules/.bin/next ]; then
  echo "Limpiando node_modules incompleto..."
  rm -rf node_modules package-lock.json
fi

if [ ! -d node_modules ]; then
  echo "Instalando dependencias por primera vez (1-3 min)..."
  npm install --no-audit --no-fund --legacy-peer-deps
fi

echo ""
echo "========================================"
echo "  Servidor en http://localhost:3000"
echo "  Pulsa Ctrl+C para detener."
echo "========================================"
echo ""

npm run dev
