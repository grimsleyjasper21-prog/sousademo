import type { Contact, Lead, Locale } from "./types";

/** Strips everything but digits — E.164 without the +, which is what wa.me expects. */
export function toWaDigits(e164: string): string {
  return e164.replace(/[^\d]/g, "");
}

export function telHref(contact: Contact): string | null {
  if (!contact.phoneE164) return null;
  const digits = toWaDigits(contact.phoneE164);
  return digits ? `tel:+${digits}` : null;
}

export function mailtoHref(contact: Contact): string | null {
  return contact.email ? `mailto:${contact.email}` : null;
}

/** Builds a wa.me link, or null when the lead has no WhatsApp number — never a placeholder. */
export function whatsappHref(e164: string | undefined, message: string): string | null {
  if (!e164) return null;
  const digits = toWaDigits(e164);
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function leadWhatsapp(lead: Lead, message: string): string | null {
  return whatsappHref(lead.contact.whatsappE164 ?? lead.contact.phoneE164, message);
}

/** "+34 611 160 256" style, used when the lead has not supplied its own display form. */
export function formatPhone(contact: Contact): string | null {
  if (contact.phoneDisplay) return contact.phoneDisplay;
  if (!contact.phoneE164) return null;
  const digits = toWaDigits(contact.phoneE164);
  if (digits.startsWith("34") && digits.length === 11) {
    const n = digits.slice(2);
    return `+34 ${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`;
  }
  return `+${digits}`;
}

/* ------------------------------------------------------------------ */
/* Maps                                                                */
/* ------------------------------------------------------------------ */

export function fullAddress(lead: Lead): string {
  const { location } = lead;
  return [
    ...location.addressLines,
    [location.postalCode, location.locality].filter(Boolean).join(" "),
    location.region,
  ]
    .filter(Boolean)
    .join(", ");
}

function mapsSearchTerm(lead: Lead): string {
  return lead.location.mapsQuery ?? `${lead.business.name}, ${fullAddress(lead)}`;
}

/** Opens the real place listing when we have its URL, otherwise a search for the address. */
export function mapsLink(lead: Lead): string {
  if (lead.location.mapsUrl) return lead.location.mapsUrl;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsSearchTerm(lead))}`;
}

export function directionsLink(lead: Lead): string {
  const c = lead.location.coordinates;
  const destination = c ? `${c.lat},${c.lng}` : mapsSearchTerm(lead);
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

/**
 * Keyless Google Maps embed. Works without an API key, so a demo never ships a
 * broken map while waiting on credentials; swap to the Embed API if a key is set.
 */
export function mapEmbedSrc(lead: Lead): string {
  const key = process.env.NEXT_PUBLIC_MAPS_EMBED_KEY;
  const q = mapsSearchTerm(lead);
  if (key) {
    return `https://www.google.com/maps/embed/v1/place?key=${key}&q=${encodeURIComponent(q)}&zoom=16`;
  }
  const c = lead.location.coordinates;
  const centre = c ? `${c.lat},${c.lng}` : q;
  return `https://maps.google.com/maps?q=${encodeURIComponent(centre)}&z=16&output=embed`;
}

export const mapsHosts = ["https://maps.google.com", "https://www.google.com"];

export function contactLocale(lead: Lead, lang: Locale): Locale {
  return lead.locales.includes(lang) ? lang : lead.defaultLocale;
}
