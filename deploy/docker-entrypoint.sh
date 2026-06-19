#!/bin/sh
set -e

echo "[entrypoint] Applying database schema..."
npx prisma db push --skip-generate

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "[entrypoint] Seeding database..."
  npx tsx prisma/seed.ts
fi

echo "[entrypoint] Starting application..."
exec "$@"
