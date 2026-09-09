# Salón Vera — Bilingual Hair Salon PWA (Demo)

A responsive, bilingual (Español / English) demo website for a hair salon in
Palma de Mallorca, with an online booking wizard and installable PWA support.

This is a static, front-end-only demo: no build step, no backend. Bookings
are stored in the browser's `localStorage` only and are never sent anywhere.

## Features

- **Bilingual UI** (ES/EN) with a language toggle, persisted in `localStorage`
  and defaulted from the browser's language.
- **Responsive layout**: mobile-first, with a collapsible nav on small screens.
- **4-step booking wizard**: service → date & time → your details → confirm,
  with validation, a generated booking reference, and a "manage my bookings"
  view to cancel a booking.
- **PWA**: web app manifest, installable on desktop/mobile, custom install
  banner (with an iOS "Add to Home Screen" hint), and a service worker that
  precaches the app shell so the whole site keeps working offline.

## Running locally

No build tools required — any static file server works, e.g.:

```bash
python3 -m http.server 8080
# then open http://localhost:8080/
```

Note: the service worker only registers on `localhost`/`127.0.0.1` or over
HTTPS (browser requirement), so plain `file://` won't enable offline mode or
install prompts — serve it over HTTP(S) as above.

## Project structure

```
index.html          Single-page site (all sections)
offline.html         Fallback page for uncached routes when offline
manifest.json         PWA manifest
sw.js                 Service worker (app-shell precache)
css/styles.css        Responsive styles, light/dark aware
js/i18n.js            ES/EN translation dictionary
js/app.js             i18n engine, nav, language toggle, install prompt, SW registration
js/booking.js         Booking wizard logic + localStorage persistence
icons/                Generated PWA icons (maskable + regular)
```

## Customizing

- Edit `js/i18n.js` to change any copy in either language.
- Edit the `SERVICES`/`STYLISTS` list in `js/booking.js` and the matching
  `services.list` / `about.team` entries in `js/i18n.js` to change services,
  prices, or staff.
- Salon hours/closed day live in `js/booking.js` (`generateTimeSlots`,
  `isSunday`).
