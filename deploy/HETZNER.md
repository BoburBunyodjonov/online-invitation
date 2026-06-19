# Hetzner VPS deploy guide

Stack: **Docker Compose** → PostgreSQL + Next.js (standalone) + Nginx.

## Requirements

- Hetzner VPS (Ubuntu 22.04/24.04 recommended), min **2 GB RAM**
- Domain pointed to server IP (A record → `YOUR_SERVER_IP`)
- Ports **80** and **443** open in Hetzner Cloud Firewall

## 1. Server setup (one time)

SSH into the server:

```bash
ssh root@YOUR_SERVER_IP
```

Run the setup script:

```bash
curl -fsSL https://raw.githubusercontent.com/BoburBunyodjonov/online-invitation/main/deploy/setup-server.sh | bash -s YOUR_DOMAIN.com
```

Or manually:

```bash
git clone https://github.com/BoburBunyodjonov/online-invitation.git /opt/online-invitation
cd /opt/online-invitation
cp deploy/.env.production.example deploy/.env
nano deploy/.env
```

### `deploy/.env` — required values

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | `https://taklifnoma.uz` |
| `POSTGRES_PASSWORD` | strong random password |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `SEED_ADMIN_PASSWORD` | your admin password |

Replace `YOUR_DOMAIN` in `deploy/nginx/conf.d/default.conf`:

```bash
sed -i 's/YOUR_DOMAIN/taklifnoma.uz/g' deploy/nginx/conf.d/default.conf
```

## 2. First deploy

```bash
cd /opt/online-invitation
RUN_SEED=true docker compose -f deploy/docker-compose.yml --env-file deploy/.env up -d --build
```

This will:

- Build the Next.js app
- Start PostgreSQL
- Apply DB schema + seed templates + admin user
- Start Nginx on port 80

Open: `http://YOUR_DOMAIN/ru`  
Admin: `http://YOUR_DOMAIN/admin`

Default admin (change in `.env` before seed):

- Email: `admin@example.com`
- Password: value of `SEED_ADMIN_PASSWORD`

## 3. HTTPS (Let's Encrypt)

After HTTP works and DNS is propagated:

```bash
cd /opt/online-invitation

docker compose -f deploy/docker-compose.yml --env-file deploy/.env run --rm certbot \
  certonly --webroot -w /var/www/certbot \
  -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com \
  --email you@example.com --agree-tos --no-eff-email
```

Enable SSL nginx config:

```bash
cp deploy/nginx/conf.d/app-ssl.conf.example deploy/nginx/conf.d/app-ssl.conf
sed -i 's/YOUR_DOMAIN/taklifnoma.uz/g' deploy/nginx/conf.d/app-ssl.conf
mv deploy/nginx/conf.d/default.conf deploy/nginx/conf.d/default.conf.bak
docker compose -f deploy/docker-compose.yml --env-file deploy/.env restart nginx
```

Update `NEXT_PUBLIC_SITE_URL` to `https://...` and rebuild app if you started with http:

```bash
docker compose -f deploy/docker-compose.yml --env-file deploy/.env up -d --build app
```

### Auto-renew certificate (cron)

```bash
crontab -e
```

Add:

```
0 3 * * * cd /opt/online-invitation && docker compose -f deploy/docker-compose.yml --env-file deploy/.env run --rm certbot renew && docker compose -f deploy/docker-compose.yml --env-file deploy/.env exec nginx nginx -s reload
```

## 4. Updates (after git push)

```bash
cd /opt/online-invitation
git pull
docker compose -f deploy/docker-compose.yml --env-file deploy/.env up -d --build
```

## 5. Useful commands

```bash
# Logs
docker compose -f deploy/docker-compose.yml --env-file deploy/.env logs -f app

# Restart
docker compose -f deploy/docker-compose.yml --env-file deploy/.env restart app

# DB shell
docker compose -f deploy/docker-compose.yml --env-file deploy/.env exec db psql -U taklifnoma -d taklifnoma

# Stop everything
docker compose -f deploy/docker-compose.yml --env-file deploy/.env down
```

## Uploads

- **Without** `BLOB_READ_WRITE_TOKEN`: files saved to server disk, served at `/uploads/...`
- **With** Vercel Blob token: uses cloud storage (same as local dev)

## Telegram bot (optional)

If using a bot webhook, set in `deploy/.env`:

```
TELEGRAM_BOT_TOKEN=...
TELEGRAM_WEBHOOK_SECRET=random-secret
TELEGRAM_ADMIN_CHAT_ID=...
```

Register webhook after deploy:

```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://YOUR_DOMAIN/api/telegram/webhook&secret_token=<WEBHOOK_SECRET>"
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| 502 Bad Gateway | `docker compose ... logs app` — wait for DB healthcheck |
| Admin login fails | Re-seed: `RUN_SEED=true docker compose ... up -d --build app` |
| Wrong locale URL | Set `NEXT_PUBLIC_SITE_URL` with correct `https://` domain |
| Upload fails | Check `UPLOAD_DIR` volume; nginx `/uploads/` alias |

## Architecture

```
Internet → Nginx (:80/:443) → Next.js app (:3000) → PostgreSQL
                              ↘ /uploads/ → disk volume
```

Local development stays on SQLite — production Docker uses PostgreSQL automatically.
