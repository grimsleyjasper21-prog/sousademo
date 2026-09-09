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
src/app/            Root layout, home page, /app (install) route
src/components/      Section components (Hero, TheStrand, Booking, ...)
src/lib/             i18n, services/pricing data, availability, calendar
public/              manifest.json, sw.js, icons/
```
