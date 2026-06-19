# Taklifnoma — Wedding Invitation Platform

A production-grade wedding invitation SaaS. Visitors browse ready-made
invitation templates, order one via Telegram, and an admin customizes &
publishes the final invitation page — all from a **single Next.js repo**,
deployable for free on Vercel.

## Architecture

One **Next.js (App Router)** project. The "backend" is **Next.js Route
Handlers** (`app/api/**/route.ts`) running on the Node.js runtime — real
backend code colocated with the frontend. Database access happens only in
`lib/server/*` (called from Route Handlers and Server Components). One repo,
one deployment, zero DevOps.

The core trick: every customer's invitation is just a row in the DB served at
`/i/[slug]` via ISR. No new Vercel project per customer → genuinely free hosting.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router), TypeScript strict |
| Styling | Tailwind v4 (layout) + MUI v9 (components) sharing one token file |
| Design tokens | `config/design-tokens.ts` → feeds `lib/mui-theme.ts` + `app/globals.css` |
| Icons | Phosphor (duotone) |
| Client data | TanStack Query v5 (`lib/queries/*`) over a shared axios instance |
| ORM / DB | Prisma + PostgreSQL (Neon free tier) |
| File storage | Vercel Blob |
| Auth (admin) | Auth.js (NextAuth v5), Credentials + bcrypt |
| i18n | next-intl — `ru`, `en`, `uz`, `uz-Cyrl` (cookie-based) |
| Telegram | grammy (webhook, no polling) |
| Validation | zod (shared client + server) |
| Forms | react-hook-form + zodResolver + a schema-driven dynamic form |

## Getting started

1. Install deps:

```bash
npm install
```

2. Configure env — copy `.env.development` to `.env` and fill in values:

```bash
cp .env.development .env
```

At minimum set `DATABASE_URL` (Neon) and `AUTH_SECRET` (`openssl rand -base64 32`).

3. Create the schema and seed demo data (2 templates + an admin user):

```bash
npm run db:push
npm run db:seed
```

Default admin: `admin@example.com` / `admin123` (override with
`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`).

4. Run dev:

```bash
npm run dev
```

- Landing / gallery: http://localhost:3000
- Template preview: http://localhost:3000/templates/beach-romantic/preview
- Admin: http://localhost:3000/admin (login → orders / templates)

## Telegram order flow

Visitors tap **Order** on a template — this opens a DM to **@online_invitation_admin**
(not a bot) with a pre-filled message naming the template.

1. Customer messages `@online_invitation_admin` on Telegram.
2. Admin creates the order in the panel: **Orders → Create order** (or from the template card).
3. Admin fills the invitation form and publishes — customer gets their `/i/[slug]` link.

Optional later: set up a Telegram **bot** via @BotFather (`TELEGRAM_BOT_TOKEN`, webhook)
for fully automated order creation.

## Order flow

1. Visitor previews a template, taps **Order** → Telegram bot.
2. Bot creates an `Order` (status `NEW`) and pings the admin chat.
3. Admin opens `/admin/orders/[id]`, fills the **schema-driven form** (auto-built
   from the template's `fieldsSchema`) with a **live preview pane**, then publishes.
4. Publishing sets the public slug and (optionally) DMs the customer their
   `/i/[slug]` link.

## Adding a template

1. Create a component under `templates/<key>/index.tsx` using the shared blocks
   in `templates/shared/`.
2. Register it in `templates/registry.ts`.
3. In the admin Templates screen, create a DB template pointing at that
   `componentKey`, with a `fieldsSchema` and `themeDefaults`.

## Deploy (Vercel)

1. Push to GitHub, import into Vercel.
2. Add all env vars from `.env.development`.
3. Add a Neon Postgres + Vercel Blob store (both free tier).
4. Build command is `prisma generate && next build` (already configured).
5. Run `npx prisma db push` against the production DB, then register the
   Telegram webhook.

## Deploy (Hetzner VPS)

Docker (PostgreSQL + app) on the server; **Caddy** proxies HTTPS → `127.0.0.1:3010`.

**Server (one time):**

```bash
git clone https://github.com/BoburBunyodjonov/online-invitation.git /opt/online-invitation
cd /opt/online-invitation
cp deploy/.env.production deploy/.env
nano deploy/.env
RUN_SEED=true docker compose -f deploy/docker-compose.multisite.yml --env-file deploy/.env up -d --build
```

After seed: `RUN_SEED=false` in `deploy/.env`.

**From laptop:**

```bash
npm run deploy          # pull + rebuild
npm run deploy:quick    # restart without rebuild
npm run deploy:push     # git push + deploy
npm run deploy:logs
npm run deploy:status
```

Optional `deploy/deploy.local.env` for SSH key overrides.

## Project layout

```
app/            routes: (public) landing, i/[slug] live page, admin, api
templates/      template components + shared blocks + registry
lib/server/     business logic (db, auth, telegram, templates, orders, invitations)
lib/queries/    TanStack Query hooks (axios)
lib/validation/ zod schemas shared client + server
config/         design tokens + locales
messages/       next-intl translations
prisma/         schema + seed
```
