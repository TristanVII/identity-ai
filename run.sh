#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC_DIR="$ROOT_DIR/src"
APPHOST_DIR="$ROOT_DIR/AspireAppHost"

# ── Pre-flight checks ────────────────────────────────────────────
check_cmd() {
  if ! command -v "$1" &>/dev/null; then
    echo "❌  $1 is required but not installed."
    echo "   $2"
    exit 1
  fi
}

check_cmd node    "Install Node.js 18+: https://nodejs.org"
check_cmd npm     "Comes with Node.js"
check_cmd dotnet  "Install .NET 10 SDK: https://dotnet.microsoft.com/download"
check_cmd docker  "Install Docker Desktop: https://docker.com/products/docker-desktop"

NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "❌  Node.js 18+ required (found $(node -v))"
  exit 1
fi

if ! docker info &>/dev/null; then
  echo "❌  Docker daemon is not running. Start Docker Desktop first."
  exit 1
fi

# ── Trust .NET dev certs if needed ────────────────────────────────
if ! dotnet dev-certs https --check --trust &>/dev/null; then
  echo "🔒  Trusting .NET dev HTTPS certificate…"
  dotnet dev-certs https --trust
fi

# ── Install npm dependencies ─────────────────────────────────────
echo "📦  Installing npm dependencies…"
cd "$SRC_DIR"
npm install --silent

# ── Env file (for standalone use only — Aspire injects at runtime) ──
if [ ! -f "$SRC_DIR/.env.local" ]; then
  echo "⚠️   Creating .env.local from template."
  echo "    Add your GOOGLE_AI_API_KEY and KLING_API_KEY to src/.env.local"
  cp "$SRC_DIR/.env.local.example" "$SRC_DIR/.env.local" 2>/dev/null || true
fi

# ── Start Aspire AppHost ─────────────────────────────────────────
echo ""
echo "🚀  Starting Aspire AppHost…"
echo "    This will spin up:"
echo "      • PostgreSQL (Docker container)"
echo "      • Azurite Blob Storage emulator (Docker container)"
echo "      • Next.js dev server (http://localhost:3000)"
echo "    Aspire Dashboard will open in your browser."
echo ""
cd "$APPHOST_DIR"
exec dotnet run
