#!/usr/bin/env bash
# Deploy Taklifnoma on a server that ALREADY runs nginx for another site (e.g. bunyodjonov.uz).
# Run on server as root from /opt/online-invitation after editing deploy/.env
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/online-invitation}"
DOMAIN="${DOMAIN:-online-invitation.uz}"
COMPOSE_FILE="deploy/docker-compose.multisite.yml"
ENV_FILE="deploy/.env"

cd "$APP_DIR"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE — copy from deploy/.env.production.example and edit."
  exit 1
fi

echo "==> Building and starting DB + app (port 127.0.0.1:3001)..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --build

echo "==> Installing nginx site config for $DOMAIN..."
NGINX_AVAIL="/etc/nginx/sites-available/online-invitation.uz"
NGINX_ENABLED="/etc/nginx/sites-enabled/online-invitation.uz"
cp deploy/nginx/host-online-invitation.uz.conf "$NGINX_AVAIL"
ln -sf "$NGINX_AVAIL" "$NGINX_ENABLED"

# Fix uploads path if volume name differs
UPLOAD_VOL=$(docker volume inspect taklifnoma_uploads -f '{{ .Mountpoint }}' 2>/dev/null || true)
if [ -n "$UPLOAD_VOL" ]; then
  sed -i "s|alias /var/lib/docker/volumes/taklifnoma_uploads/_data/;|alias ${UPLOAD_VOL}/;|" "$NGINX_AVAIL"
  echo "Uploads path: ${UPLOAD_VOL}/"
fi

echo "==> Testing nginx..."
nginx -t
systemctl reload nginx

echo ""
echo "Done! Check http://${DOMAIN}/ru"
echo "Admin: http://${DOMAIN}/admin"
echo ""
echo "SSL: sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
echo "     (Certbot only adds cert for this domain — bunyodjonov.uz is untouched)"
