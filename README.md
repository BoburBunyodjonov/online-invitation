# Taklifnoma — Wedding Invitation Platform

A production-grade wedding invitation SaaS. Visitors browse ready-made
invitation templates, order one via Telegram, and an admin customizes &
publishes the final invitation page — all from a **single Next.js repo**,
deployable on Vercel or Docker (Hetzner VPS).

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
| ORM / DB | Prisma + **PostgreSQL** (local Docker, Neon, or Docker prod) |
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

At minimum set `AUTH_SECRET` (`openssl rand -base64 32`).

3. Start PostgreSQL and apply migrations:

```bash
npm run db:up          # Docker Postgres on localhost:5432
npm run db:migrate     # apply prisma/migrations
npm run db:seed        # 3 templates + admin user
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

## Database

**PostgreSQL everywhere** — same provider in dev, CI, Vercel (Neon), and Docker prod.

| Command | Purpose |
|---|---|
| `npm run db:up` | Start local Postgres (Docker) |
| `npm run db:down` | Stop local Postgres |
| `npm run db:migrate` | Create/apply migrations (dev) |
| `npm run db:migrate:deploy` | Apply migrations (prod/CI) |
| `npm run db:seed` | Seed demo data |

**Existing production DB** (previously on `db push`): after pulling, run once:

```bash
npx prisma migrate resolve --applied 20250621000000_init
npx prisma migrate deploy
```

## Tests & CI

```bash
npm run test       # unit tests (node:test + tsx)
npm run typecheck  # tsc --noEmit
npm run lint
```

GitHub Actions runs lint, typecheck, test, and build on every push/PR.

## Telegram order flow

When `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` is set, **Order** buttons open the bot
(`t.me/Bot?start=tpl_<slug>`) and create an order automatically. Without it, visitors
DM **@online_invitation_admin** with a pre-filled message (fallback).

1. Customer taps **Order** on a template → Telegram bot creates `Order` (status `NEW`).
2. Bot asks for phone (optional) and notifies admin.
3. Admin opens `/admin/orders/[id]`, fills the invitation form, publishes.
4. Customer receives `/i/[slug]` link via Telegram.

Set `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_ID`, and register the webhook.

## RSVP

Published invitations show an RSVP form at the bottom of `/i/[slug]`.
Guests can confirm attendance, decline, or mark "not sure".

- Admin sees responses on the order detail page (after publish).
- Export guest list as CSV from the admin panel.
- Disable per invitation via `rsvpEnabled: false` in invitation data.

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
5. Run `npm run db:migrate:deploy` against the production DB, then register the
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
prisma/         schema + migrations + seed
```
