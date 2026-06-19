#!/bin/sh
set -e

echo "[entrypoint] Applying database schema..."
npx prisma db push --skip-generate

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "[entrypoint] Seeding database..."
  if npx tsx prisma/seed.ts; then
    echo "[entrypoint] Seed completed."
  else
    echo "[entrypoint] Seed failed — continuing (set RUN_SEED=false after first deploy)."
  fi
fi

echo "[entrypoint] Starting application..."
exec "$@"
