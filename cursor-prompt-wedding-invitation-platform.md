# Cursor AI Build Prompt — Wedding Invitation SaaS Platform

Copy everything below into Cursor (Composer / Agent mode) as your project brief. It is written so Cursor can execute it phase by phase.

---

## ROLE

You are a senior full-stack engineer. Build a production-grade **wedding invitation platform** where visitors browse ready-made invitation templates, request one via Telegram, and an admin customizes & publishes the final invitation page for them — all hosted for free on Vercel from a **single repository**.

---

## 0. ARCHITECTURE DECISION (read first)

To satisfy the "one folder, frontend + backend together" requirement, do **not** create a separate Express/Nest server. Instead:

- Use a **single Next.js 15 (App Router) project**.
- The "backend" = **Next.js Route Handlers** (`app/api/**/route.ts`), which run on the Node.js runtime — this is real Node.js, just colocated with the frontend.
- Database access happens only inside Route Handlers / Server Actions, never directly from client components.
- This gives one repo, one `vercel.json`, one free Vercel deployment, and zero DevOps overhead.

If a fully separate backend is ever needed later, the `lib/server/*` business-logic layer should already be framework-agnostic enough to move into its own service without rewriting logic — but do not build that now.

---

## 1. TECH STACK

| Layer | Choice |
|---|---|
| Framework | Next.js 15, App Router, TypeScript strict mode |
| Styling | Tailwind CSS (utility/layout) + MUI v6 (complex components: forms, dialogs, DataGrid, DatePicker, Snackbar) |
| Design tokens | Single source of truth shared by MUI theme **and** Tailwind config |
| Icons | Soft/duotone icon set — use **Solar Icons** (`@solar-icons/react` or `solar-icon-set`) for the public site; fall back to **Phosphor Icons (light/duotone weight)** where Solar lacks a glyph. Never mix sharp/outline icon sets with these. |
| Data fetching (client) | TanStack Query v5 — all client-side reads/writes to `/api/*` go through query/mutation hooks, never raw `fetch` in components |
| ORM / DB | Prisma + PostgreSQL (use **Neon** free tier — works natively with Vercel) |
| File storage | **Vercel Blob** (free tier) for template preview images, couple photos, audio files |
| Auth (admin only) | Auth.js (NextAuth) with Credentials provider, single `AdminUser` table, bcrypt hashing |
| i18n | `next-intl`, locales: `ru`, `en`, `uz` (Latin), `uz-Cyrl` (Cyrillic) |
| Telegram | `grammy` library, webhook-based bot, no polling |
| Validation | `zod` end-to-end (shared schemas between client forms and Route Handlers) |
| Forms | `react-hook-form` + `zodResolver` |
| Lint/format | ESLint + Prettier + `eslint-plugin-tailwindcss` |

---

## 2. SHARED DESIGN TOKEN SYSTEM (single place to control the whole UI)

Create `config/design-tokens.ts` exporting plain JS objects (colors, spacing scale, radii, font families, shadows). Then:

- `lib/mui-theme.ts` imports the tokens and builds `createTheme({...})`.
- `tailwind.config.ts` imports the **same** tokens object into `theme.extend`.
- Disable Tailwind's preflight (`corePlugins: { preflight: false }`) since MUI's `<CssBaseline />` already resets styles — this prevents the two systems fighting each other.
- Fonts via `next/font`: an elegant serif/script pairing for invitation headings (e.g. `Playfair Display` + a script font similar to the cursive "The most important gift" style) loaded once and exposed as CSS variables reused by both MUI typography variants and Tailwind `font-*` classes.
- Two theme presets must exist:
  1. **Platform theme** (landing page, admin panel) — clean, neutral, light.
  2. **Template theme** — each invitation template defines its *own* `{ background, accentColor, fontPair, mode: 'light'|'dark' }` stored in its schema (see §4), independent from the platform theme.

Result: changing the platform's look = edit one file. Changing a template's look = edit that template's own theme object, not global CSS.

---

## 3. DATA MODEL (Prisma schema)

```prisma
model Template {
  id            String   @id @default(cuid())
  slug          String   @unique
  name          String
  category      String        // e.g. "beach", "classic", "islamic", "floral"
  thumbnail     String        // Blob URL
  previewImages String[]      // gallery images shown on landing page card
  componentKey  String        // maps to a React component in templates/registry.ts
  fieldsSchema  Json          // zod-shaped JSON describing editable fields (see §4)
  themeDefaults Json          // { backgroundColor, accentColor, fontPair, mode }
  isPublished   Boolean  @default(false)
  createdAt     DateTime @default(now())
}

model Order {
  id            String   @id @default(cuid())
  templateId    String
  template      Template @relation(fields: [templateId], references: [id])
  telegramChatId String
  telegramUsername String?
  contactPhone  String?
  status        OrderStatus @default(NEW)
  invitation    Invitation?
  createdAt     DateTime @default(now())
}

enum OrderStatus {
  NEW
  IN_PROGRESS
  DONE
  CANCELLED
}

model Invitation {
  id            String   @id @default(cuid())
  slug          String   @unique          // public URL: /i/[slug]
  orderId       String   @unique
  order         Order    @relation(fields: [orderId], references: [id])
  templateId    String
  data          Json            // filled values matching template.fieldsSchema, per locale
  isPublished   Boolean  @default(false)
  views         Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model AdminUser {
  id           String @id @default(cuid())
  email        String @unique
  passwordHash String
  role         String @default("admin")
}
```

---

## 4. TEMPLATE ENGINE

Each template = a React component **plus** a JSON field schema, decoupled so admin can edit content without touching code.

- `templates/registry.ts` — maps `componentKey` → React component (e.g. `BeachRomanticTemplate`, `IslamicElegantTemplate`).
- Each template component receives a single `data` prop (validated against its zod schema) and renders all the sections seen in the reference screenshots:
  - Hero section with full-bleed photo, language switcher (RU/EN/UZ/UZ-Cyrl) top-left, background-music play toggle top-right, animated script-font headline, scroll-down heart icon.
  - "We are delighted to invite you" intro slide.
  - Couple names + date + Quranic/poetic verse slide (optional block, only for islamic-style templates).
  - Countdown timer (days/hours/minutes/seconds) + interactive calendar with the wedding date circled + "Start at HH:MM" line.
  - Schedule/timeline list with soft icons (cocktail glass, rings, dish cover, fireworks) — render icons from the Solar/Phosphor set, not emoji.
  - Venue section: embedded Google Map (iframe via lat/lng fields), name of venue, address, "Google Route" / "Yandex Route" buttons.
  - Photo gallery block.
  - Final lock-screen / "You have received an invitation" + "Unlock" button gate (optional toggle per invitation — some clients may want the page open directly, others want this gated intro).
- `fieldsSchema` (stored as JSON, validated with zod on read) defines exactly which of the above blocks exist and what fields they need, e.g.:

```ts
{
  groomName: { type: "text", required: true },
  brideName: { type: "text", required: true },
  weddingDate: { type: "date", required: true },
  startTime: { type: "time", required: true },
  verseArabic: { type: "text", required: false },
  verseTranslation: { type: "text", required: false },
  verseSource: { type: "text", required: false },
  venue: {
    type: "object",
    fields: {
      name: "text", address: "text", lat: "number", lng: "number"
    }
  },
  schedule: { type: "list", itemFields: { time: "time", label: "text", icon: "iconKey" } },
  gallery: { type: "image[]" },
  backgroundMusic: { type: "audio" },
  locales: { type: "localizedGroup", languages: ["ru","en","uz","uz-Cyrl"] }
}
```

Admin panel auto-generates the edit form from this schema (don't hardcode one form per template — build a generic schema-driven form renderer using `react-hook-form` + dynamic field components).

---

## 5. PUBLIC LANDING PAGE (`app/(public)/page.tsx`)

- Hero intro for the platform itself (not a wedding — this sells the service).
- Template gallery: grid of cards (thumbnail, name, category filter chips, "Preview" + "Order this template" buttons).
- **Preview**: opens `/templates/[slug]/preview` — renders the real template component with realistic placeholder data, full-screen, exactly like a real invitation, so the visitor sees the final quality.
- **Order this template** button → links to:
  `https://t.me/<BOT_USERNAME>?start=tpl_<templateSlug>`
  No form on the landing page itself — Telegram is the order channel.
- SEO: per-template `generateMetadata`, sitemap.xml including all published templates and published invitations, OpenGraph image generated dynamically with `@vercel/og` (couple names + date over a styled background) for every published `/i/[slug]` page, JSON-LD `Event` schema on invitation pages, `robots.txt` disallowing `/admin`.
- i18n routing for the landing page itself via `next-intl` middleware.

---

## 6. TELEGRAM ORDER FLOW

- Bot webhook: `app/api/telegram/webhook/route.ts` (force `runtime = "nodejs"`), verifies Telegram secret token header.
- `/start tpl_<slug>` payload → bot creates an `Order` row (status `NEW`), replies to the customer confirming receipt and asking for a phone number (optional) via a contact-request keyboard.
- Bot then posts a message into the **admin Telegram group/chat** (chat ID from env var) with the order details and an inline button "Open in Admin Panel" deep-linking to `/admin/orders/[id]`.
- Keep all Telegram logic in `lib/server/telegram.ts`; the route handler should be a thin wrapper.

---

## 7. ADMIN PANEL (`app/admin/**`, protected by Auth.js middleware)

- Login page (Credentials provider).
- **Templates** CRUD screen: upload thumbnail + preview images (to Vercel Blob), pick `componentKey` from the registry, edit `fieldsSchema` and `themeDefaults` via a JSON/structured editor, publish/unpublish toggle.
- **Orders** list (MUI `DataGrid`): filter by status, click into an order to create/edit its linked `Invitation` using the **schema-driven dynamic form** described in §4.
- Invitation editor: live preview pane (iframe rendering the actual template component with current form values) next to the form, so admin sees changes instantly before publishing.
- Publish button: sets `Invitation.isPublished = true`, generates the public slug if not set, and (optionally) triggers a Telegram message back to the customer with their final link.

---

## 8. API LAYER (Route Handlers = the "backend")

All under `app/api/`:

```
GET    /api/templates                 (public, isPublished only)
GET    /api/templates/[slug]
POST   /api/admin/templates           (auth required)
PUT    /api/admin/templates/[id]
DELETE /api/admin/templates/[id]

GET    /api/admin/orders              (auth required)
PUT    /api/admin/orders/[id]

POST   /api/admin/invitations         (auth required)
PUT    /api/admin/invitations/[id]
POST   /api/admin/invitations/[id]/publish

GET    /api/invitations/[slug]        (public — powers the live page)
POST   /api/telegram/webhook          (Telegram only, secret-verified)
```

- Every handler: parse input with `zod`, return typed JSON, proper HTTP status codes, centralized error handler (`lib/server/api-error.ts`).
- All client-side calls to these routes go through `lib/queries/*` — one file per resource exporting TanStack Query hooks (`useTemplates()`, `useOrder(id)`, `useUpdateInvitation()`, etc.), using a shared `axios` instance with base URL `/api`.

---

## 9. PUBLISHED INVITATION PAGE (`app/i/[slug]/page.tsx`)

- Server Component: fetch `Invitation` + its `Template` by slug directly via Prisma (no need to round-trip through the API route on the server — call the same `lib/server` functions the API route uses).
- Use `export const revalidate = ...` (ISR) so edits in the admin panel reflect within seconds without a full redeploy.
- 404 if not published.
- Increment `views` (fire-and-forget, don't block render).
- Render the matching template component from `templates/registry.ts` keyed by `template.componentKey`, passing `invitation.data`.

This single mechanism is what gives every customer "their own hosted invitation" without ever creating a new Vercel project — explain this clearly in code comments since it's the core trick that makes "free hosting per customer" actually free and simple.

> **Phase 2 (optional, do not build yet):** wildcard subdomains like `ulugbek-malika.yourdomain.com` via Next.js `middleware.ts` rewriting the host header to `/i/[slug]`, combined with a wildcard DNS record pointed at Vercel. Leave a `// TODO phase 2` comment where this would hook in, but ship path-based `/i/[slug]` first since it works on the free tier with zero extra config.

---

## 10. FOLDER STRUCTURE

```
/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                  # landing page / template gallery
│   │   └── templates/[slug]/preview/page.tsx
│   ├── i/[slug]/page.tsx             # live published invitation
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── templates/...
│   │   ├── orders/[id]/page.tsx
│   │   └── layout.tsx                # auth-guarded layout
│   └── api/
│       ├── templates/...
│       ├── admin/...
│       ├── invitations/[slug]/route.ts
│       └── telegram/webhook/route.ts
├── templates/
│   ├── registry.ts
│   ├── beach-romantic/index.tsx
│   ├── islamic-elegant/index.tsx
│   └── shared/ (CountdownTimer, ScheduleList, VenueMap, MusicToggle, LanguageSwitcher, UnlockGate)
├── lib/
│   ├── server/ (db.ts, telegram.ts, auth.ts, api-error.ts, invitations.ts, orders.ts, templates.ts)
│   ├── queries/ (useTemplates.ts, useOrders.ts, useInvitation.ts, ...)
│   └── validation/ (zod schemas shared client+server)
├── config/
│   └── design-tokens.ts
├── prisma/
│   └── schema.prisma
├── messages/ (ru.json, en.json, uz.json, uz-Cyrl.json)   # next-intl
├── middleware.ts
├── tailwind.config.ts
├── lib/mui-theme.ts
└── .env.example
```

---

## 11. ENVIRONMENT VARIABLES (`.env.example`)

```
DATABASE_URL=
AUTH_SECRET=
TELEGRAM_BOT_TOKEN=
TELEGRAM_WEBHOOK_SECRET=
TELEGRAM_ADMIN_CHAT_ID=
BLOB_READ_WRITE_TOKEN=
NEXT_PUBLIC_SITE_URL=
```

---

## 12. BUILD ORDER (do these phases in sequence, confirm each before moving on)

1. Scaffold Next.js + TS + Tailwind + MUI + design-token bridge; verify no style conflicts.
2. Prisma schema + Neon connection + migrations.
3. Build 1 real template component (`beach-romantic`) matching the reference screenshots (hero, countdown, schedule, venue map, unlock gate) using the shared building blocks in `templates/shared/`.
4. Landing page with template gallery + preview route, wired to `GET /api/templates`.
5. Telegram bot webhook + order creation flow.
6. Auth.js admin login + protected `/admin` layout.
7. Admin templates CRUD + Vercel Blob upload.
8. Schema-driven dynamic invitation form + live preview pane.
9. Public `/i/[slug]` page with ISR + SEO metadata + OG image generation.
10. i18n pass across landing page, admin, and template shared components.
11. Polish: loading states (TanStack Query `isPending`), error boundaries, empty states, mobile responsiveness (this is mobile-first — most guests open invitations on phones).

Confirm each phase compiles and runs (`npm run dev`, `npx prisma studio`) before continuing to the next.
