#!/bin/sh
set -e

# Wait for PostgreSQL to be ready (Aspire starts containers in parallel)
echo "[entrypoint] Waiting for database..."
MAX_ATTEMPTS=30
ATTEMPT=0
until npx drizzle-kit push 2>&1; do
  ATTEMPT=$((ATTEMPT + 1))
  if [ "$ATTEMPT" -ge "$MAX_ATTEMPTS" ]; then
    echo "[entrypoint] WARNING: db:push failed after ${MAX_ATTEMPTS} attempts, starting anyway"
    break
  fi
  echo "[entrypoint] Database not ready, retrying in 2s... (attempt $ATTEMPT/$MAX_ATTEMPTS)"
  sleep 2
done

echo "[entrypoint] Starting Next.js dev server..."
exec npm run dev
