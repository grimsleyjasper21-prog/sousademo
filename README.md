# SOUSA — The Hair Expert

A cinematic prospect-demo website for **SOUSA — The Hair Expert**, a boutique hair
salon in Palma de Mallorca. Built by GRIMHART to demonstrate what a premium
website + booking product + installable app looks like for a local business.

Next.js (App Router, TypeScript, Tailwind v4) + GSAP/ScrollTrigger for the
cinematic scroll sequence. Deployable to Vercel with no extra configuration.

## Highlights

- **Cinematic editorial identity** — near-black/bone/copper palette, Bodoni
  Moda display type paired with Archivo, full-bleed campaign photography
  generated for this demo.
- **THE STRAND** (`src/components/TheStrand.tsx`) — a pinned, scroll-scrubbed
  GSAP sequence (precision → cut → transformation → colour → resolve) with a
  static, non-pinned fallback under `prefers-reduced-motion`.
- **Complete booking product** (`src/components/Booking.tsx`) — category →
  service → date → time → details → review → confirmation, with a 90-day,
  duration-aware, opening-hours-aware demo calendar
  (`src/lib/availability.ts`).
- **Real Google Calendar submission** (`src/lib/calendar.ts`) — POSTs to a
  Google Apps Script endpoint on confirmation; shows loading / success /
  error (with retry + WhatsApp fallback) and never claims success unless the
  request actually succeeded. Defaults to the shared GRIMHART demo endpoint;
  **for a real client, deploy your own copy so bookings land on their
  calendar, not GRIMHART's** — see `google-apps-script/README.md`.
- **Installable PWA** — manifest + icons + service worker
  (`public/manifest.json`, `public/sw.js`), an install banner, a dedicated
  `/app` route for an NFC card in the salon, and iOS "Add to Home Screen"
  instructions.
- **Bilingual (ES default / EN)** — `src/lib/i18n-dict.ts` +
  `src/lib/i18n.tsx`.
- **Demo services & prices** (`src/lib/services-data.ts`) are fictional —
  see the disclaimer on the Services and Booking sections.
- The site sets `robots: noindex, nofollow` and ships a `Disallow: /`
  `robots.txt` — this is a prospect demo, not the production SOUSA site.

## Running locally

```bash
npm install
npm run dev
```

`npm run build && npm run start` for a production build.

## Structure

```
src/app/(site)/      SOUSA site — root layout, home page, /app (install) route
src/components/      Section components (Hero, TheStrand, Booking, ...)
src/lib/             i18n, services/pricing data, availability, calendar
public/              manifest.json, sw.js, icons/
```

---

## GRIMHART Outreach Engine

An internal-only tool (separate root layout under `src/app/(outreach)/`, served
at `/outreach`) for GRIMHART's own outbound sales workflow: import an
Outscraper CSV export once a month, then work through a daily queue of
AI-drafted WhatsApp outreach messages — copy number, copy message, send
manually, mark sent, next.

### Setup

1. Install dependencies: `npm install`
2. Create a Supabase project.
3. Run `supabase/migrations/0001_init.sql` in the Supabase SQL editor (creates
   `batches`, `leads`, `settings` and all indexes).
4. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (Supabase Settings → API)
   - `ANTHROPIC_API_KEY` for real message generation. Without it, the app
     automatically falls back to a mock generator (`AI_MOCK_MODE`) so the UI
     and workflow can still be tested end-to-end.
5. `npm run dev` and open `/outreach`.
6. Go to **Import**, drag in your Outscraper CSV export, and open **Today**.

### How it works

- **Import**: tolerant column matching (handles Outscraper's varying export
  columns without any manual mapping), `libphonenumber-js` normalization
  (default region `ES`), permanently-closed filtering, and two-layer
  duplicate detection (normalized phone, then business name + city). The
  full original row is kept in `leads.raw_data`. Every import creates a new
  `batches` row; only one batch is active at a time.
- **Today**: the queue is derived, not stored — the first N (`daily_target`,
  default 30) uncontacted leads in the active batch, ordered by import
  order. Messages are generated automatically in small batches via the
  Anthropic API (tool-use forces valid structured JSON, validated again with
  Zod before saving) so a partial failure never loses already-generated
  messages. "Sent Today" resets naturally each day based on `contacted_at`
  in `Europe/Madrid`.
- **Leads / History**: a plain searchable/filterable table over the same
  `leads` table — no separate pipeline state to keep in sync.
- **Settings**: daily target, default language behaviour, and the two AI
  prompt fields (GRIMHART context + base outreach instructions) editable
  without a redeploy.

All state lives in Postgres — refreshing the browser never loses leads,
messages, or sent status.
