import type { DesignProfile } from "@/factory/types";
import { sousaFontStacks } from "./fonts";

/**
 * SOUSA — near-black, bone and copper. Cinematic, high-contrast, editorial:
 * the salon's own register ("belleza, cuidado personal y buena música") pushed
 * towards fashion photography rather than the soft beige most salon sites default to.
 */
export const sousaDesign: DesignProfile = {
  mode: "dark",
  palette: {
    ink: "#0a0908",
    paper: "#f3ecdf",
    surface: "#16130f",
    surfaceAlt: "#1e1a15",
    text: "#f3ecdf",
    textDim: "#c7bcac",
    textFaint: "#8f8577",
    accent: "#b5652f",
    accentBright: "#d98a4e",
    accentContrast: "#0a0908",
    line: "rgba(243, 236, 223, 0.14)",
    lineStrong: "rgba(243, 236, 223, 0.30)",
    focus: "#d9b76b",
  },
  fonts: { display: sousaFontStacks.display, body: sousaFontStacks.body, displayWeight: 500 },
  typeScale: "grand",
  radius: "sharp",
  buttons: "solid",
  rhythm: "airy",
  motion: "cinematic",
  imageTreatment: "full-bleed",
  eyebrowStyle: "tracked-caps",
  variants: {
    nav: "minimal-inline",
    hero: "full-bleed-cinema",
    services: "editorial-index",
    // No verified review text exists for SOUSA, so the section shows the
    // verified Google aggregate and nothing else.
    reviews: "rating-only",
    location: "map-split",
    footer: "editorial",
    cta: "full-image",
  },
  sectionOrder: [
    "hero",
    "statement",
    "strand",
    "services",
    "about",
    "campaign",
    "booking",
    "reviews",
    "location",
    "cta",
  ],
  signature: "dark-cinema · bodoni/archivo · copper · editorial-index · full-bleed-cta",
};
