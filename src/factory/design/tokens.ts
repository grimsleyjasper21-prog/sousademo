import type { DesignProfile } from "../types";

/**
 * Turns a lead's design profile into CSS custom properties.
 *
 * Every visual decision a component makes reads from these tokens, which is why
 * two leads can share a component and still not look related: the component is
 * shape, the profile is character.
 */

const typeScales = {
  compact: {
    display1: "clamp(2.4rem, 7vw, 4.4rem)",
    display2: "clamp(1.9rem, 4.6vw, 3rem)",
    display3: "clamp(1.4rem, 3vw, 1.9rem)",
    lead: "clamp(1rem, 1.6vw, 1.12rem)",
    body: "1rem",
    displayLeading: "1.08",
  },
  editorial: {
    display1: "clamp(3rem, 10vw, 6.6rem)",
    display2: "clamp(2.1rem, 5.6vw, 3.9rem)",
    display3: "clamp(1.5rem, 3.4vw, 2.2rem)",
    lead: "clamp(1.05rem, 1.9vw, 1.3rem)",
    body: "1.02rem",
    displayLeading: "1.02",
  },
  grand: {
    display1: "clamp(3.4rem, 13vw, 9rem)",
    display2: "clamp(2.3rem, 7vw, 4.8rem)",
    display3: "clamp(1.6rem, 4vw, 2.6rem)",
    lead: "clamp(1.1rem, 2.1vw, 1.45rem)",
    body: "1.05rem",
    displayLeading: "0.95",
  },
} as const;

const radii = {
  sharp: { sm: "0px", md: "2px", lg: "3px", pill: "3px", image: "0px" },
  soft: { sm: "4px", md: "8px", lg: "14px", pill: "999px", image: "10px" },
  round: { sm: "10px", md: "18px", lg: "28px", pill: "999px", image: "22px" },
} as const;

const rhythms = {
  dense: { section: "clamp(3.5rem, 7vw, 5.5rem)", gap: "clamp(1.5rem, 3vw, 2.25rem)" },
  balanced: { section: "clamp(4.5rem, 9vw, 7.5rem)", gap: "clamp(2rem, 4vw, 3rem)" },
  airy: { section: "clamp(5.5rem, 12vw, 11rem)", gap: "clamp(2.5rem, 5vw, 4rem)" },
} as const;

export function designTokens(design: DesignProfile): Record<string, string> {
  const scale = typeScales[design.typeScale];
  const radius = radii[design.radius];
  const rhythm = rhythms[design.rhythm];
  const p = design.palette;

  return {
    "--ink": p.ink,
    "--paper": p.paper,
    "--surface": p.surface,
    "--surface-alt": p.surfaceAlt,
    "--text": p.text,
    "--text-dim": p.textDim,
    "--text-faint": p.textFaint,
    "--accent": p.accent,
    "--accent-bright": p.accentBright,
    "--accent-contrast": p.accentContrast,
    "--line": p.line,
    "--line-strong": p.lineStrong,
    "--focus": p.focus,

    "--font-display": design.fonts.display,
    "--font-body": design.fonts.body,
    "--display-weight": String(design.fonts.displayWeight ?? 500),

    "--step-display-1": scale.display1,
    "--step-display-2": scale.display2,
    "--step-display-3": scale.display3,
    "--step-lead": scale.lead,
    "--step-body": scale.body,
    "--display-leading": scale.displayLeading,

    "--radius-sm": radius.sm,
    "--radius-md": radius.md,
    "--radius-lg": radius.lg,
    "--radius-pill": radius.pill,
    "--radius-image": radius.image,

    "--section-y": rhythm.section,
    "--gap": rhythm.gap,
    "--container": "1240px",
  };
}

export function tokensToCss(design: DesignProfile): string {
  const tokens = designTokens(design);
  const body = Object.entries(tokens)
    .map(([k, v]) => `${k}:${v};`)
    .join("");
  // color-scheme keeps form controls, scrollbars and autofill in the right register.
  return `:root{color-scheme:${design.mode};${body}}`;
}

/** Motion budget per profile, consumed by the reveal helpers. */
export const motionSettings = {
  none: { distance: 0, duration: 0, stagger: 0 },
  subtle: { distance: 14, duration: 520, stagger: 60 },
  cinematic: { distance: 34, duration: 900, stagger: 110 },
  lively: { distance: 22, duration: 420, stagger: 45 },
} as const;
