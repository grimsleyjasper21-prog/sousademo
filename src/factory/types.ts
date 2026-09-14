// GRIMHART demo factory — the data model every lead is built from.
//
// Rule of the factory: engineering is shared, facts are per-lead, and a fact
// that is not verified must be *typed* as unverified so the UI can disclose it
// instead of quietly presenting it as truth.

export type Locale = "es" | "en" | "de" | "ca";

/** A string that may differ per language. Missing locales fall back to the lead's default. */
export type Localized<T = string> = Partial<Record<Locale, T>>;

export type ImageRef = {
  url: string;
  width: number;
  height: number;
  /** Alt text per language. Never describes the real premises unless the photo is the business's own. */
  alt: Localized;
  /** Where the picture came from. `business` = the business's own public imagery. */
  origin: "business" | "supplied" | "stock" | "generated";
  /** object-position for art-directed crops, e.g. "50% 30%". */
  focus?: string;
};

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export type Price = {
  amount: number;
  currency?: "EUR";
  /** `from` renders "desde €X", `consult` renders "Consultar" and ignores amount. */
  qualifier?: "exact" | "from" | "consult";
};

export type Service = {
  id: string;
  categoryId: string;
  name: Localized;
  /** One line, used on cards and in the booking summary. */
  short?: Localized;
  /** Body copy for the service's own page. */
  description?: Localized;
  /** "What it involves" bullets on the service page. */
  includes?: Localized<string[]>;
  /** Practical notes (preparation, aftercare, what to bring). Never medical claims. */
  practical?: Localized<string[]>;
  durationMin: number;
  price?: Price;
  image?: ImageRef;
  featured?: boolean;
  /** false = shown in the menu but not offered in the booking flow. */
  bookable?: boolean;
};

export type ServiceCategory = {
  id: string;
  name: Localized;
  blurb?: Localized;
  image?: ImageRef;
};

export type Catalogue = {
  /**
   * `verified`   — prices/durations come from the business's own public pricing.
   * `indicative` — realistic placeholders; the UI discloses this automatically.
   * `onRequest`  — no prices shown at all.
   */
  pricing: "verified" | "indicative" | "onRequest";
  categories: ServiceCategory[];
  services: Service[];
  /** Shown near the menu when pricing is `indicative`. Auto-filled if omitted. */
  pricingNote?: Localized;
};

/* ------------------------------------------------------------------ */
/* Reputation — never fabricated                                       */
/* ------------------------------------------------------------------ */

export type ReviewSource = "google" | "facebook" | "tripadvisor" | "instagram" | "treatwell";

/** A real, attributable customer review. There is no way to build one without a source. */
export type Review = {
  author: string;
  text: Localized;
  rating?: number;
  source: ReviewSource;
  /** Link to the public review or the review listing it came from. */
  url?: string;
  date?: string;
};

export type Reputation = {
  /** Only present when the aggregate is publicly visible and current. */
  rating?: { value: number; count: number; source: ReviewSource; url?: string };
  /** Empty is fine and common — better than invented quotes. */
  reviews: Review[];
};

/* ------------------------------------------------------------------ */
/* Location, contact, hours                                            */
/* ------------------------------------------------------------------ */

export type Location = {
  addressLines: string[];
  locality: string;
  region?: string;
  postalCode?: string;
  countryCode: string;
  coordinates?: { lat: number; lng: number };
  /** The exact Google Maps place URL when known — preserved verbatim. */
  mapsUrl?: string;
  /** Query used for the embedded map when there is no place URL. */
  mapsQuery?: string;
  /** Getting there / parking / landmarks. Only what is verifiable. */
  notes?: Localized<string[]>;
  image?: ImageRef;
};

export type Contact = {
  phoneE164?: string;
  phoneDisplay?: string;
  whatsappE164?: string;
  email?: string;
  instagram?: { handle: string; url: string };
  facebookUrl?: string;
  website?: string;
};

/** Supports split shifts, which most Spanish businesses run. `null` = closed. */
export type DayHours = { open: string; close: string }[] | null;

export type OpeningHours = {
  verified: boolean;
  timezone: string;
  /** 0 = Sunday. */
  week: Record<number, DayHours>;
  note?: Localized;
};

/* ------------------------------------------------------------------ */
/* Booking                                                             */
/* ------------------------------------------------------------------ */

export type BookingConfig = {
  enabled: boolean;
  /**
   * `demo`       — availability is generated from opening hours only. No calendar is read.
   * `apps-script`— availability and bookings go through the lead's Google Apps Script.
   */
  mode: "demo" | "apps-script";
  /** Suffix of the env vars holding this lead's endpoint + token, e.g. "SOUSA". */
  calendarRef: string;
  /** Prefix on every created calendar event so demo bookings are identifiable. */
  eventPrefix: string;
  slotStepMin: number;
  /** Gap kept after each appointment. */
  bufferMin: number;
  /** How far ahead of now the first bookable slot sits. */
  leadTimeMin: number;
  horizonDays: number;
  requireEmail: boolean;
  whatsappFallback: boolean;
};

/* ------------------------------------------------------------------ */
/* Design                                                              */
/* ------------------------------------------------------------------ */

export type Palette = {
  ink: string;
  paper: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textDim: string;
  textFaint: string;
  accent: string;
  accentBright: string;
  accentContrast: string;
  line: string;
  lineStrong: string;
  focus: string;
};

export type HeroVariant = "full-bleed-cinema" | "split-editorial" | "stacked-type" | "frame-portrait";
export type ServicesVariant = "editorial-index" | "image-grid" | "menu-columns" | "feature-rail";
export type ReviewsVariant = "quote-feature" | "review-rail" | "stacked-cards" | "rating-only";
export type NavVariant = "minimal-inline" | "centered-serif" | "rule-under";
export type FooterVariant = "editorial" | "compact" | "map-split";
export type LocationVariant = "map-split" | "map-full" | "detail-stack";
export type CtaVariant = "quiet-band" | "full-image" | "split-panel";

export type DesignProfile = {
  mode: "dark" | "light";
  palette: Palette;
  /** CSS font stacks, wired to the lead's own next/font declarations. */
  fonts: { display: string; body: string; displayWeight?: number };
  typeScale: "compact" | "editorial" | "grand";
  radius: "sharp" | "soft" | "round";
  buttons: "solid" | "outline" | "underline" | "pill";
  rhythm: "dense" | "balanced" | "airy";
  motion: "none" | "subtle" | "cinematic" | "lively";
  imageTreatment: "clean" | "full-bleed" | "framed" | "masked";
  eyebrowStyle: "tracked-caps" | "numbered" | "rule";
  variants: {
    nav: NavVariant;
    hero: HeroVariant;
    services: ServicesVariant;
    reviews: ReviewsVariant;
    location: LocationVariant;
    footer: FooterVariant;
    cta: CtaVariant;
  };
  /** Home page composition. Unknown keys are ignored, so a lead can drop sections. */
  sectionOrder: string[];
  /** Short internal label used by the ledger to keep consecutive demos distinct. */
  signature: string;
};

/* ------------------------------------------------------------------ */
/* Proposal                                                            */
/* ------------------------------------------------------------------ */

export type Proposal = {
  locale: Locale;
  /** Opening line under the business name. One or two sentences, in Jasper's voice. */
  intro: string;
  /** Honest, specific observations about their current online presence. */
  noticed: string[];
  /** What was built and why it was built that way. */
  idea: string;
  /** Plain-language list of what their customers can now do. */
  customerCan: string[];
  /** Feature blocks, customer-facing language only. */
  features: { title: string; body: string }[];
  /** Whether to present the €19 booking app upsell for this lead. */
  showAppUpsell: boolean;
  closing: string;
  ctaLabel: string;
  /** Pre-filled WhatsApp message to GRIMHART. */
  whatsappMessage: string;
};

/* ------------------------------------------------------------------ */
/* Lead                                                                */
/* ------------------------------------------------------------------ */

export type Vertical =
  | "hair"
  | "massage"
  | "beauty"
  | "wellness"
  | "clinic"
  | "restaurant"
  | "bar"
  | "retail"
  | "services";

/** Customer-facing URL segments. Localized per lead — see routes.ts. */
export type RouteMap = {
  services: string;
  booking: string;
  location: string;
  contact: string;
  reviews?: string;
  about?: string;
  app?: string;
};

export type Lead = {
  slug: string;
  vertical: Vertical;
  business: {
    name: string;
    /** Short form for nav/footer when the full name is long. */
    shortName?: string;
    /** One line describing what they do, per language. Used in hero + metadata. */
    tagline: Localized;
    /** Small line above the hero headline. Defaults to the locality. */
    kicker?: Localized;
    /** Longer positioning paragraph. */
    about?: Localized<string[]>;
    logo?: ImageRef;
  };
  locales: Locale[];
  defaultLocale: Locale;
  routes: RouteMap;
  contact: Contact;
  location: Location;
  hours: OpeningHours;
  catalogue: Catalogue;
  reputation: Reputation;
  booking: BookingConfig;
  design: DesignProfile;
  proposal: Proposal;
  /** Per-section copy the home page composes. Missing blocks drop the section. */
  copy: {
    /** A short editorial statement, used as the beat after the hero. */
    statement?: { eyebrow?: Localized; title: Localized; body?: Localized<string[]> };
    about?: { eyebrow?: Localized; title: Localized; body: Localized<string[]>; imageKey?: string };
    cta: { title: Localized; body?: Localized; imageKey?: string };
  };
  images: Record<string, ImageRef>;
  meta: {
    /** Overrides the auto-built <title>. */
    title?: Localized;
    description: Localized;
    /** Every demo is a concept until bought — this drives the disclosure line. */
    demoDisclosure: boolean;
  };
};
