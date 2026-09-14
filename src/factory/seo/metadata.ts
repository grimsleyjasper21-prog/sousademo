import type { Metadata } from "next";
import { formatPhone, fullAddress, mapsLink } from "../contact";
import { hoursSchema } from "../hours";
import { localeTag, text } from "../locale";
import { absolute, demoHome } from "../routes";
import type { Lead, Locale, Vertical } from "../types";

const schemaType: Record<Vertical, string> = {
  hair: "HairSalon",
  massage: "HealthAndBeautyBusiness",
  beauty: "BeautySalon",
  wellness: "HealthAndBeautyBusiness",
  clinic: "MedicalBusiness",
  restaurant: "Restaurant",
  bar: "BarOrPub",
  retail: "Store",
  services: "LocalBusiness",
};

export function buildMetadata(
  lead: Lead,
  options: { path: string; title?: string; description?: string; image?: string } = { path: "" }
): Metadata {
  const lang = lead.defaultLocale;
  const base = text(lead.meta.title, lang, lang) || lead.business.name;
  const title = options.title ? `${options.title} · ${lead.business.name}` : base;
  const description = options.description ?? text(lead.meta.description, lang, lang);
  const url = absolute(options.path || demoHome(lead));
  const image = options.image ?? lead.images.hero?.url;

  return {
    metadataBase: new URL(absolute("/")),
    title,
    description,
    applicationName: lead.business.shortName ?? lead.business.name,
    alternates: { canonical: url },
    // Every demo is a speculative concept; it must never compete with the
    // business's real site in search results.
    robots: { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: localeTag[lang].replace("-", "_"),
      url,
      siteName: lead.business.name,
      title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

/**
 * LocalBusiness structured data built only from verified facts: no rating
 * without a public aggregate, no hours unless the lead marks them verified, no
 * price list unless the prices are the business's own.
 */
export function localBusinessSchema(lead: Lead, lang: Locale = lead.defaultLocale) {
  const { location, contact, reputation } = lead;
  const hours = hoursSchema(lead.hours);

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType[lead.vertical],
    name: lead.business.name,
    description: text(lead.meta.description, lang, lead.defaultLocale),
    url: absolute(demoHome(lead)),
    address: {
      "@type": "PostalAddress",
      streetAddress: location.addressLines.join(", "),
      addressLocality: location.locality,
      addressRegion: location.region,
      postalCode: location.postalCode,
      addressCountry: location.countryCode,
    },
    hasMap: mapsLink(lead),
  };

  if (lead.images.hero) schema.image = lead.images.hero.url;
  const phone = formatPhone(contact);
  if (phone) schema.telephone = phone;
  if (contact.email) schema.email = contact.email;

  const sameAs = [contact.instagram?.url, contact.facebookUrl, contact.website].filter(Boolean);
  if (sameAs.length) schema.sameAs = sameAs;

  if (location.coordinates) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: location.coordinates.lat,
      longitude: location.coordinates.lng,
    };
  }
  if (hours) schema.openingHoursSpecification = hours;

  if (reputation.rating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: reputation.rating.value,
      reviewCount: reputation.rating.count,
      bestRating: 5,
    };
  }

  if (lead.catalogue.pricing === "verified") {
    schema.hasOfferCatalog = {
      "@type": "OfferCatalog",
      name: text(lead.meta.title, lang, lead.defaultLocale) || lead.business.name,
      itemListElement: lead.catalogue.services
        .filter((s) => s.price && s.price.qualifier !== "consult")
        .map((s) => ({
          "@type": "Offer",
          name: text(s.name, lang, lead.defaultLocale),
          price: s.price?.amount,
          priceCurrency: s.price?.currency ?? "EUR",
        })),
    };
  }

  return schema;
}

export function addressSummary(lead: Lead): string {
  return fullAddress(lead);
}
