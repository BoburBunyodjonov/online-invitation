#!/usr/bin/env bash
# Deploy from your laptop: push to GitHub is separate; this pulls on the server and rebuilds.
#
# Setup (once): optional deploy/deploy.local.env (SSH key, host overrides)
#
# Usage:
#   npm run deploy          # git pull + docker build on server
#   npm run deploy:quick    # restart without rebuild
#   npm run deploy:logs
#   npm run deploy:status
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG_FILE="$ROOT_DIR/deploy/deploy.local.env"

DEPLOY_HOST="${DEPLOY_HOST:-46.225.113.117}"
DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_APP_DIR="${DEPLOY_APP_DIR:-/opt/online-invitation}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
DEPLOY_SSH_KEY="${DEPLOY_SSH_KEY:-}"
DEPLOY_URL="${DEPLOY_URL:-https://online-invitation.uz/uz}"

ACTION=deploy
PUSH_FIRST=false
NO_BUILD=false

if [ -f "$CONFIG_FILE" ]; then
  # shellcheck disable=SC1090
  source "$CONFIG_FILE"
fi

usage() {
  cat <<EOF
Usage: $(basename "$0") [options]

Options:
  --push        git push origin $DEPLOY_BRANCH before remote deploy
  --no-build    Skip docker image rebuild (faster)
  --logs        Show app logs on server
  --status      Show container status on server
  -h, --help    Show help

Config: deploy/deploy.local.env (optional — defaults work for 46.225.113.117)
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --push) PUSH_FIRST=true; shift ;;
    --no-build) NO_BUILD=true; shift ;;
    --logs) ACTION=logs; shift ;;
    --status) ACTION=status; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage; exit 1 ;;
  esac
done

SSH_OPTS=(-o BatchMode=yes -o StrictHostKeyChecking=accept-new)
if [ -n "$DEPLOY_SSH_KEY" ]; then
  SSH_OPTS+=(-i "$DEPLOY_SSH_KEY")
fi

REMOTE="${DEPLOY_USER}@${DEPLOY_HOST}"

ssh_cmd() {
  ssh "${SSH_OPTS[@]}" "$REMOTE" "$@"
}

if [ "$PUSH_FIRST" = true ]; then
  echo "==> Pushing to origin/$DEPLOY_BRANCH..."
  git -C "$ROOT_DIR" push origin "$DEPLOY_BRANCH"
fi

if [ "$ACTION" = deploy ] && [ "$PUSH_FIRST" = false ]; then
  if git -C "$ROOT_DIR" rev-parse @{u} >/dev/null 2>&1; then
    LOCAL_SHA="$(git -C "$ROOT_DIR" rev-parse @)"
    REMOTE_SHA="$(git -C "$ROOT_DIR" rev-parse @{u})"
    if [ "$LOCAL_SHA" != "$REMOTE_SHA" ]; then
      echo "⚠️  Local branch has unpushed commits. Run: git push && npm run deploy"
      echo "   Or: npm run deploy -- --push"
      echo ""
    fi
  fi
fi

case "$ACTION" in
  deploy)
    REMOTE_FLAGS=""
    [ "$NO_BUILD" = true ] && REMOTE_FLAGS="--no-build"

    echo "==> Deploying to $REMOTE ($DEPLOY_APP_DIR)..."
    ssh "${SSH_OPTS[@]}" "$REMOTE" \
      "APP_DIR='$DEPLOY_APP_DIR' DEPLOY_BRANCH='$DEPLOY_BRANCH' bash -s -- $REMOTE_FLAGS" \
      < "$ROOT_DIR/deploy/server-deploy.sh"

    if [ -n "$DEPLOY_URL" ]; then
      echo ""
      echo "==> Health check: $DEPLOY_URL"
      if curl -fsI --max-time 15 "$DEPLOY_URL" | head -1; then
        echo "✓ Site is up"
      else
        echo "⚠️  HTTP check failed (DNS or app may still be starting)"
      fi
    fi
    ;;

  logs)
    ssh_cmd "docker logs taklifnoma-app --tail 80"
    ;;

  status)
    ssh_cmd "docker ps --filter name=taklifnoma --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"
    ;;
esac
