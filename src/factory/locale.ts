import type { Lead, Locale, Localized } from "./types";

/** Reads a localized value, falling back to the lead's default language, then to any value present. */
export function pick<T>(value: Localized<T> | undefined, lang: Locale, fallback: Locale): T | undefined {
  if (!value) return undefined;
  return value[lang] ?? value[fallback] ?? Object.values(value)[0];
}

/** Same as `pick` but guaranteed to return a string — empty rather than a key name. */
export function text(value: Localized | undefined, lang: Locale, fallback: Locale): string {
  return pick(value, lang, fallback) ?? "";
}

export function leadText(lead: Lead, value: Localized | undefined, lang: Locale): string {
  return text(value, lang, lead.defaultLocale);
}

export function leadList(lead: Lead, value: Localized<string[]> | undefined, lang: Locale): string[] {
  return pick(value, lang, lead.defaultLocale) ?? [];
}

export const localeTag: Record<Locale, string> = {
  es: "es-ES",
  en: "en-GB",
  de: "de-DE",
  ca: "ca-ES",
};

export const localeLabel: Record<Locale, string> = {
  es: "ES",
  en: "EN",
  de: "DE",
  ca: "CA",
};
