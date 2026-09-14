import { text } from "../locale";
import { demoHome } from "../routes";
import { localeTag } from "../locale";
import type { Lead } from "../types";

/**
 * A web app manifest per lead. This is what makes the €19 booking app real
 * in the demo: the prospect installs their own business to their home screen.
 */
export function buildManifest(lead: Lead) {
  const home = demoHome(lead);
  const icons = `/leads/${lead.slug}/icons`;
  const lang = lead.defaultLocale;

  return {
    id: `${home}/`,
    name: lead.business.name,
    short_name: lead.business.shortName ?? lead.business.name,
    description: text(lead.meta.description, lang, lang),
    start_url: `${home}?source=pwa`,
    scope: `${home}/`,
    display: "standalone",
    orientation: "portrait-primary",
    background_color: lead.design.palette.ink,
    theme_color: lead.design.palette.ink,
    lang: localeTag[lang],
    dir: "ltr",
    categories: ["business", "lifestyle"],
    icons: [
      { src: `${icons}/favicon-32.png`, sizes: "32x32", type: "image/png" },
      { src: `${icons}/icon-192.png`, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: `${icons}/icon-512.png`, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: `${icons}/icon-maskable-192.png`, sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: `${icons}/icon-maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: lead.booking.enabled
      ? [
          {
            name: text({ es: "Reservar cita", en: "Book an appointment" }, lang, "es"),
            short_name: text({ es: "Reservar", en: "Book" }, lang, "es"),
            url: `${home}/${lead.routes.booking}?source=shortcut`,
            icons: [{ src: `${icons}/icon-192.png`, sizes: "192x192" }],
          },
        ]
      : undefined,
  };
}
