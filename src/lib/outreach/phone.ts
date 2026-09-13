import { parsePhoneNumberFromString } from "libphonenumber-js";

const DEFAULT_REGION = "ES";

export interface NormalizedPhone {
  original: string;
  e164: string;
}

/**
 * Normalizes a raw phone string from an Outscraper export into E.164.
 * Returns null when the value cannot be parsed into a usable number —
 * callers should treat that lead as invalid (no usable phone number).
 */
export function normalizePhone(raw: string | null | undefined): NormalizedPhone | null {
  if (!raw) return null;
  const original = raw.trim();
  if (!original) return null;

  // Outscraper sometimes lists multiple numbers separated by , / ; — take the first.
  const first = original.split(/[,/;]/)[0].trim();
  if (!first) return null;

  const parsed =
    parsePhoneNumberFromString(first, DEFAULT_REGION) ??
    parsePhoneNumberFromString(first.replace(/[^\d+]/g, ""), DEFAULT_REGION);

  if (!parsed || !parsed.isValid()) return null;

  return { original, e164: parsed.number };
}

/** WhatsApp deep link from an already-normalized E.164 number. */
export function whatsappLinkFor(e164: string, message?: string): string {
  const digits = e164.replace(/^\+/, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
