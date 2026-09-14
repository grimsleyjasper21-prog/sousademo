# GRIMHART demo factory

Personalised demo websites and paired sales proposals for local businesses,
built fast without looking built fast.

One Next.js app holds every demo. Each lead gets its own routes, its own art
direction and its own data; the booking engine, calendar integration, language
system, maps, proposal and deployment are shared and invisible.

```
grimhartdemo.com/sousa              the demo
grimhartdemo.com/sousa/propuesta    the proposal
```

## Running it

```bash
npm install
npm run dev            # http://localhost:3000/sousa
npm run build && npm run start
```

| Command | What it does |
| --- | --- |
| `npm run new-lead` | Scaffolds a lead: data files, routes, ledger entry, wiring |
| `npm run check` | Factual-integrity gate — placeholders, unsourced reviews, missing routes, repeated design signatures |
| `npm run leads` | Prints the internal lead ledger with the links to send |
| `npm run qa` | Crawls every page at phone + desktop width, drives the booking flow, screenshots everything |
| `npm run shots` | Generates the proposal's demo screenshots |
| `npm run icons` | Generates a lead's PWA icons from a monogram |
| `npm run lint` | ESLint, zero warnings allowed |

## Adding a lead

```bash
npm run new-lead -- --slug natalia --name "Natalia Masajes" --short Natalia \
  --vertical massage --preset bone-editorial \
  --locality "Palma de Mallorca" --address "Carrer Example, 1" --phone "+34600000000"
```

That writes `src/leads/natalia/` and `src/app/natalia/`. What's left is the part
that actually sells:

1. **Research** — fill `lead.ts`: hours, address, contact, Instagram, verified rating.
2. **Menu** — fill `services.ts`, then set `catalogue.pricing` to `verified`,
   `indicative` (the UI discloses it) or `onRequest`.
3. **Imagery** — add to `images.ts` under the keys the sections look for:
   `hero`, `heroAlt`, `about`, `cta`, `location`. Set `origin` honestly.
4. **Art direction** — change `design.ts`. The preset is a starting point; two
   demos that share a signature look like recolours of each other.
5. **Copy** — `copy.statement`, `copy.about`, `copy.cta`, and the `proposal` block.
6. `npm run icons -- --lead natalia --text N --bg "#..." --fg "#..."`
7. `npm run check && npm run build && npm run lint`
8. `npm run start`, then `npm run shots -- --lead natalia` and `npm run qa`.

Presets live in `src/factory/design/presets.json` — six starting points across
dark cinema, light editorial, warm terracotta, coastal, botanic and paper-modern.

## How it's put together

```
src/factory/          The engine. Shared by every lead, visible in none of them.
  types.ts            The data model — facts carry their own provenance
  design/tokens.ts    Design profile → CSS custom properties
  design/presets.json Starting points for a new art direction
  booking/            Slot engine, Google Calendar adapter, the booking UI
  sections/           Hero ×4, Services ×4, Reviews ×4, Location ×3, CTA ×3 …
  components/         Nav, footer, reveals, images, buttons, maps
  pages/              Page builders every lead's routes call
  proposal/           The GRIMHART-branded proposal (its own identity)
  pwa/                Per-lead installable app
  i18n/strings.ts     Interface copy in ES / EN / DE / CA

src/leads/<slug>/     One lead: data, design profile, fonts, bespoke sections
src/leads/ledger.json Internal record. Never rendered publicly.
src/app/<slug>/       That lead's routes (thin — they call the page builders)
```

**Shared, so it's never rebuilt:** booking, calendar, availability, validation,
WhatsApp links, maps, translations, SEO, proposal, scripts.

**Per lead, so it never looks shared:** palette, type, hero, layout, section
order, copy, imagery, motion, review presentation, service presentation.

A lead that deserves one signature moment gets a bespoke component in its own
folder — see `src/leads/sousa/sections/TheStrand.tsx`, a pinned scroll sequence
no other demo has — and names it in `design.sectionOrder`.

## Booking

```
browser → /api/availability → calendar adapter → Apps Script → Google Calendar
browser → /api/book         → calendar adapter → Apps Script → Google Calendar
```

Endpoints and tokens are server-side only; nothing reaches the browser. Two modes:

- `mode: "demo"` — availability generated from the opening hours; bookings land
  on the GRIMHART demo calendar, tagged with the lead slug and `eventPrefix`.
- `mode: "apps-script"` — availability read from the client's own calendar, and
  bookings written to it.

Moving a demo onto a client's calendar is two environment variables, not a
rebuild — see `google-apps-script/README.md`.

## Factual integrity

The rules from the brief are enforced by the type system and `npm run check`:

- Reviews cannot exist without an author and a source. No verified quotes means
  the section shows the verified aggregate, or nothing.
- Unverified prices must be typed as `indicative`, which forces the disclosure
  on every surface and drops the offer catalogue from the structured data.
- Opening hours that aren't marked verified never reach structured data.
- Stock and generated imagery is tagged `origin`, so nothing claims to show
  premises it doesn't.
- Every demo ships `noindex` and carries a quiet disclosure line.

## Environment

See `.env.local.example`. Nothing is required to run a demo locally; all of it
is optional configuration for a specific client or deployment.

## Deploying

Vercel, one project, all demos. `NEXT_PUBLIC_SITE_ORIGIN` should be the public
origin so the proposals' links and metadata are absolute. After deploying, run
`npm run shots -- --lead <slug> --base https://<your-origin>` to capture the
proposal's screenshots, and commit them.
