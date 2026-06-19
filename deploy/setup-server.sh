#!/usr/bin/env bash
# First-time Hetzner VPS setup. Run as root on a fresh Ubuntu 22.04/24.04 server.
set -euo pipefail

echo "==> Installing Docker..."
if ! command -v docker >/dev/null 2>&1; then
  apt-get update
  apt-get install -y ca-certificates curl git
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
fi

APP_DIR="${APP_DIR:-/opt/online-invitation}"
DOMAIN="${1:-}"

if [ ! -d "$APP_DIR/.git" ]; then
  echo "==> Cloning repository to $APP_DIR..."
  git clone https://github.com/BoburBunyodjonov/online-invitation.git "$APP_DIR"
fi

cd "$APP_DIR"

if [ ! -f deploy/.env ]; then
  cp deploy/.env.production.example deploy/.env
  AUTH=$(openssl rand -base64 32)
  sed -i "s|^AUTH_SECRET=.*|AUTH_SECRET=$AUTH|" deploy/.env
  echo ""
  echo "Created deploy/.env — edit it before continuing:"
  echo "  nano $APP_DIR/deploy/.env"
  echo ""
fi

if [ -n "$DOMAIN" ]; then
  sed -i "s|YOUR_DOMAIN|$DOMAIN|g" deploy/nginx/conf.d/default.conf
  sed -i "s|https://YOUR_DOMAIN|https://$DOMAIN|g" deploy/.env
  sed -i "s|YOUR_DOMAIN|$DOMAIN|g" deploy/.env
fi

echo ""
echo "Next steps:"
echo "  1. Edit deploy/.env (domain, passwords)"
echo "  2. First deploy with seed:"
echo "     cd $APP_DIR && RUN_SEED=true docker compose -f deploy/docker-compose.yml --env-file deploy/.env up -d --build"
echo "  3. Open https://YOUR_DOMAIN/admin (after DNS + optional SSL)"
echo ""
echo "See deploy/HETZNER.md for SSL and updates."
