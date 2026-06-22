#!/bin/sh
set -e

# Build DATABASE_URL with URL-encoded password (openssl rand -base64 often includes + / =).
if [ -z "${DATABASE_URL:-}" ]; then
  if [ -z "${POSTGRES_PASSWORD:-}" ] || [ -z "${POSTGRES_USER:-}" ] || [ -z "${POSTGRES_DB:-}" ]; then
    echo "[entrypoint] Set DATABASE_URL or POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB."
    exit 1
  fi
  ENCODED_PASS=$(node -e 'console.log(encodeURIComponent(process.argv[1]))' "$POSTGRES_PASSWORD")
  export DATABASE_URL="postgresql://${POSTGRES_USER}:${ENCODED_PASS}@db:5432/${POSTGRES_DB}?schema=public"
fi

echo "[entrypoint] Applying database migrations..."
prisma migrate deploy

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "[entrypoint] Seeding database..."
  if node prisma/seed.bundle.cjs; then
    echo "[entrypoint] Seed completed."
  else
    echo "[entrypoint] Seed failed — continuing (set RUN_SEED=false after first deploy)."
  fi
fi

echo "[entrypoint] Starting application..."
exec "$@"
