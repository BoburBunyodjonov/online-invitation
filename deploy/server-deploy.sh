#!/usr/bin/env bash
# Run ON the server (or via SSH from remote-deploy.sh).
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/online-invitation}"
BRANCH="${DEPLOY_BRANCH:-main}"
COMPOSE_FILE="deploy/docker-compose.multisite.yml"
ENV_FILE="deploy/.env"
NO_BUILD=false

usage() {
  cat <<'EOF'
Usage: server-deploy.sh [options]

Options:
  --no-build   Restart containers without rebuilding the image
  -h, --help   Show help
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --no-build) NO_BUILD=true; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage; exit 1 ;;
  esac
done

cd "$APP_DIR"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE — copy from deploy/.env.production" >&2
  exit 1
fi

echo "==> Pulling $BRANCH..."
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"

echo "==> Starting stack..."
export DOCKER_BUILDKIT=1
if [ "$NO_BUILD" = true ]; then
  docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d
else
  docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --build
fi

echo ""
echo "==> Status"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps

echo ""
echo "==> Recent app logs"
docker logs taklifnoma-app --tail 15 2>/dev/null || true
