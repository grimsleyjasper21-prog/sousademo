import Papa from "papaparse";
import { normalizePhone } from "./phone";

// ---------------------------------------------------------------------------
// Header normalization + tolerant alias matching
// ---------------------------------------------------------------------------

export type ImportField =
  | "business_name"
  | "phone"
  | "website"
  | "category"
  | "city"
  | "full_address"
  | "rating"
  | "review_count"
  | "booking_url"
  | "social_url"
  | "whatsapp_url"
  | "google_maps_url"
  | "business_status"
  | "closed_flag"
  | "address_street"
  | "address_state"
  | "address_country"
  | "address_postal";

function normalizeHeaderKey(header: string): string {
  return header
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

// Alias lists are ordered by preference — the first matching, non-empty
// column for a row wins. Keep aliases in normalized (snake_case) form.
const ALIASES: Record<ImportField, string[]> = {
  business_name: [
    "business_name",
    "name",
    "name_for_emails",
    "title",
    "company_name",
    "company",
  ],
  phone: [
    "phone",
    "phone_number",
    "contact_phone",
    "phone_1",
    "telephone",
    "tel",
    "mobile",
  ],
  website: ["website", "site", "url", "domain", "web"],
  category: [
    "category",
    "type",
    "subtypes",
    "subtype",
    "business_category",
    "categories",
    "main_category",
  ],
  city: ["city", "town"],
  full_address: ["full_address", "address", "street_address", "formatted_address"],
  address_street: ["street"],
  address_state: ["state", "us_state", "region", "province"],
  address_country: ["country", "country_code"],
  address_postal: ["postal_code", "zip", "zip_code", "postcode"],
  rating: ["rating", "stars", "average_rating"],
  review_count: ["reviews", "review_count", "reviews_count", "num_reviews", "user_ratings_total"],
  booking_url: [
    "booking",
    "booking_url",
    "booking_appointment_link",
    "appointment",
    "appointment_link",
    "reservation_link",
    "reservation_links",
    "order_links",
    "menu_link",
  ],
  social_url: ["social", "social_url", "instagram", "facebook", "twitter", "linkedin", "tiktok"],
  whatsapp_url: ["whatsapp", "whatsapp_url", "whatsapp_link"],
  google_maps_url: [
    "google_maps_url",
    "maps_url",
    "place_url",
    "location_link",
    "google_maps_link",
    "link",
  ],
  business_status: ["business_status", "status"],
  closed_flag: ["permanently_closed", "closed", "is_closed", "temporarily_closed"],
};

// Fallback substring matching for fields that don't hit an exact alias —
// covers Outscraper export variants we haven't explicitly enumerated.
const SUBSTRING_FALLBACKS: Partial<Record<ImportField, string[]>> = {
  business_name: ["name"],
  phone: ["phone", "tel"],
  website: ["website", "url", "site"],
  category: ["categ", "type"],
  city: ["city"],
  full_address: ["address"],
  rating: ["rating", "star"],
  review_count: ["review"],
};

const NEVER_FALLBACK_FOR = new Set([
  // Columns that legitimately contain "url"/"link" but aren't the business website.
  "social_url",
  "google_maps_url",
  "booking_url",
  "whatsapp_url",
]);

export type ColumnMap = Partial<Record<ImportField, string[]>>;

export function buildColumnMap(headers: string[]): ColumnMap {
  const normalizedToOriginal = new Map<string, string>();
  for (const h of headers) {
    const norm = normalizeHeaderKey(h);
    if (norm && !normalizedToOriginal.has(norm)) normalizedToOriginal.set(norm, h);
  }

  const usedForOtherFields = new Set<string>();
  const map: ColumnMap = {};

  const fields = Object.keys(ALIASES) as ImportField[];

  // Pass 1: exact alias matches.
  for (const field of fields) {
    const candidates: string[] = [];
    for (const alias of ALIASES[field]) {
      const original = normalizedToOriginal.get(alias);
      if (original && !candidates.includes(original)) candidates.push(original);
    }
    if (candidates.length) {
      map[field] = candidates;
      candidates.forEach((c) => usedForOtherFields.add(c));
    }
  }

  // Pass 2: substring fallback for fields still unmatched, skipping columns
  // already claimed by a more specific field.
  for (const field of fields) {
    if (map[field]?.length) continue;
    const fallbackTerms = SUBSTRING_FALLBACKS[field];
    if (!fallbackTerms) continue;
    const candidates: string[] = [];
    for (const [norm, original] of normalizedToOriginal) {
      if (NEVER_FALLBACK_FOR.has(field) && usedForOtherFields.has(original)) continue;
      if (fallbackTerms.some((term) => norm.includes(term))) {
        candidates.push(original);
      }
    }
    if (candidates.length) map[field] = candidates;
  }

  return map;
}

function firstNonEmpty(row: Record<string, string>, columns: string[] | undefined): string {
  if (!columns) return "";
  for (const col of columns) {
    const value = row[col];
    if (value && value.trim()) return value.trim();
  }
  return "";
}

// ---------------------------------------------------------------------------
// CSV parsing
// ---------------------------------------------------------------------------

export interface ParsedCsv {
  headers: string[];
  rows: Record<string, string>[];
  parseErrorCount: number;
}

export function parseOutscraperCsv(fileText: string): ParsedCsv {
  // Papa Parse handles BOM stripping, quoted fields, embedded commas/newlines,
  // and unicode (accents, Thai, etc.) out of the box.
  const result = Papa.parse<Record<string, string>>(fileText, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (h) => h.trim(),
  });

  const headers = result.meta.fields ?? [];
  const rows = (result.data ?? []).filter((r) => r && typeof r === "object");

  // Papa reports row-level issues (e.g. too many/few fields) without aborting
  // the whole parse — count them so the import summary can report them.
  const parseErrorCount = result.errors?.length ?? 0;

  return { headers, rows, parseErrorCount };
}

// ---------------------------------------------------------------------------
// Row extraction + validation
// ---------------------------------------------------------------------------

export interface ExtractedLead {
  business_name: string;
  phone: string; // original, as typed in the source
  normalized_phone: string; // E.164
  website: string | null;
  category: string | null;
  city: string | null;
  full_address: string | null;
  rating: number | null;
  review_count: number | null;
  booking_url: string | null;
  social_url: string | null;
  whatsapp_url: string | null;
  google_maps_url: string | null;
  business_status: string | null;
  raw_data: Record<string, string>;
}

export type SkipReason =
  | "missing_business_name"
  | "missing_phone"
  | "permanently_closed"
  | "duplicate";

export type RowOutcome =
  | { kept: true; lead: ExtractedLead }
  | { kept: false; reason: SkipReason };

// Covers free-text ("permanently closed") as well as the Google Places /
// Outscraper business_status enum value ("CLOSED_PERMANENTLY").
const CLOSED_PATTERN = /(permanently[\s_]*closed|closed[\s_]*permanently|cerrado[\s_]*permanentemente)/i;

function parseNumeric(raw: string): number | null {
  const cleaned = raw.replace(/[^\d.,-]/g, "").replace(/,(?=\d{3}\b)/g, "");
  const normalized = cleaned.replace(",", ".");
  const value = parseFloat(normalized);
  return Number.isFinite(value) ? value : null;
}

function parseIntSafe(raw: string): number | null {
  const cleaned = raw.replace(/[^\d]/g, "");
  if (!cleaned) return null;
  const value = parseInt(cleaned, 10);
  return Number.isFinite(value) ? value : null;
}

function nullableText(value: string): string | null {
  return value.trim() ? value.trim() : null;
}

function buildFallbackAddress(row: Record<string, string>, map: ColumnMap): string | null {
  const parts = [
    firstNonEmpty(row, map.address_street),
    firstNonEmpty(row, map.city),
    firstNonEmpty(row, map.address_state),
    firstNonEmpty(row, map.address_postal),
    firstNonEmpty(row, map.address_country),
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

/**
 * Extracts and validates a single CSV row. Does not perform dedup —
 * callers combine this with phone/name+city dedup across the whole import
 * plus existing DB records.
 */
export function extractRow(row: Record<string, string>, map: ColumnMap): RowOutcome {
  const businessName = firstNonEmpty(row, map.business_name);
  if (!businessName) return { kept: false, reason: "missing_business_name" };

  const rawPhone = firstNonEmpty(row, map.phone);
  const normalized = normalizePhone(rawPhone);
  if (!normalized) return { kept: false, reason: "missing_phone" };

  const statusText = firstNonEmpty(row, map.business_status);
  const closedFlagText = firstNonEmpty(row, map.closed_flag).toLowerCase();
  const closedFlag = closedFlagText === "true" || closedFlagText === "1" || closedFlagText === "yes";
  if (CLOSED_PATTERN.test(statusText) || closedFlag) {
    return { kept: false, reason: "permanently_closed" };
  }

  const ratingRaw = firstNonEmpty(row, map.rating);
  const reviewsRaw = firstNonEmpty(row, map.review_count);
  const fullAddress = nullableText(firstNonEmpty(row, map.full_address)) ?? buildFallbackAddress(row, map);

  const lead: ExtractedLead = {
    business_name: businessName,
    phone: normalized.original,
    normalized_phone: normalized.e164,
    website: nullableText(firstNonEmpty(row, map.website)),
    category: nullableText(firstNonEmpty(row, map.category)),
    city: nullableText(firstNonEmpty(row, map.city)),
    full_address: fullAddress,
    rating: ratingRaw ? parseNumeric(ratingRaw) : null,
    review_count: reviewsRaw ? parseIntSafe(reviewsRaw) : null,
    booking_url: nullableText(firstNonEmpty(row, map.booking_url)),
    social_url: nullableText(firstNonEmpty(row, map.social_url)),
    whatsapp_url: nullableText(firstNonEmpty(row, map.whatsapp_url)),
    google_maps_url: nullableText(firstNonEmpty(row, map.google_maps_url)),
    business_status: nullableText(statusText),
    raw_data: row,
  };

  return { kept: true, lead };
}

/** Normalizes a business name + city into a fallback dedup key. */
export function nameCityKey(name: string, city: string | null): string {
  const norm = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  return `${norm(name)}|${norm(city ?? "")}`;
}
