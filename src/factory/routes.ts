import type { Lead, RouteMap } from "./types";

/**
 * Customer-facing URLs. Segments are per-lead and localized (a Spanish salon
 * gets /servicios, an English-facing business /services), which is why they
 * live in the lead's data rather than in the folder names of the factory.
 */
export function demoHome(lead: Lead): string {
  return `/${lead.slug}`;
}

export function sectionUrl(lead: Lead, key: keyof RouteMap): string {
  const segment = lead.routes[key];
  if (!segment) return demoHome(lead);
  return `/${lead.slug}/${segment}`;
}

export function serviceUrl(lead: Lead, serviceId: string): string {
  return `/${lead.slug}/${lead.routes.services}/${serviceId}`;
}

export function proposalUrl(lead: Lead): string {
  return `/${lead.slug}/propuesta`;
}

/** Absolute URL for metadata and for links Jasper pastes into WhatsApp. */
export function siteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_ORIGIN;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export function absolute(path: string): string {
  return `${siteOrigin()}${path.startsWith("/") ? path : `/${path}`}`;
}
