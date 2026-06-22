#!/usr/bin/env bash
# Reset admin password from deploy/.env (run on server).
# Usage: cd /opt/online-invitation && bash deploy/reset-admin.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/online-invitation}"
ENV_FILE="$APP_DIR/deploy/.env"
COMPOSE="docker compose -f deploy/docker-compose.multisite.yml --env-file deploy/.env"

cd "$APP_DIR"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE" >&2
  exit 1
fi

# Load only KEY=value lines (avoids bash interpreting # in passwords).
while IFS= read -r line || [ -n "$line" ]; do
  case "$line" in
    ''|\#*) continue ;;
    *=*) export "$line" ;;
  esac
done < "$ENV_FILE"

if [ -z "${SEED_ADMIN_EMAIL:-}" ] || [ -z "${SEED_ADMIN_PASSWORD:-}" ]; then
  echo "Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in deploy/.env" >&2
  exit 1
fi

echo "==> Current admin users in DB:"
docker exec taklifnoma-db psql -U "${POSTGRES_USER:-invitation}" -d "${POSTGRES_DB:-invitation_db}" -c \
  'SELECT email, role FROM "AdminUser";' 2>/dev/null || echo "(could not query DB)"

echo ""
echo "==> Resetting password for: $SEED_ADMIN_EMAIL"
docker exec \
  -e SEED_ADMIN_EMAIL \
  -e SEED_ADMIN_PASSWORD \
  taklifnoma-app sh -c '
    ENCODED_PASS=$(node -e "console.log(encodeURIComponent(process.argv[1]))" "$POSTGRES_PASSWORD")
    export DATABASE_URL="postgresql://${POSTGRES_USER}:${ENCODED_PASS}@db:5432/${POSTGRES_DB}?schema=public"
    node prisma/seed.bundle.cjs
  ' 2>&1 | grep -E 'Admin user|Error|error|Authentication' || true

echo ""
echo "Done. Login at /admin with:"
echo "  Email:    $SEED_ADMIN_EMAIL"
echo "  Password: (value of SEED_ADMIN_PASSWORD in deploy/.env)"
