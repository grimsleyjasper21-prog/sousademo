"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ui, type UiStrings } from "./i18n/strings";
import { leadList, leadText, localeTag } from "./locale";
import type { Lead, Locale, Localized } from "./types";

type Ctx = {
  lead: Lead;
  lang: Locale;
  setLang: (l: Locale) => void;
  /** Interface copy. */
  ui: UiStrings;
  /** Business copy in the active language, with the lead's default as fallback. */
  t: (value: Localized | undefined) => string;
  tl: (value: Localized<string[]> | undefined) => string[];
};

const LeadContext = createContext<Ctx | null>(null);

export function LeadProvider({ lead, children }: { lead: Lead; children: ReactNode }) {
  const [lang, setLangState] = useState<Locale>(lead.defaultLocale);
  const storageKey = `grimhart-lang:${lead.slug}`;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey) as Locale | null;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-only read of a browser API; reading it during render would break hydration.
      if (stored && lead.locales.includes(stored)) setLangState(stored);
    } catch {
      // Storage blocked (private mode) — the default language is already correct.
    }
  }, [storageKey, lead.locales]);

  useEffect(() => {
    document.documentElement.lang = localeTag[lang];
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lead,
      lang,
      setLang: (l: Locale) => {
        setLangState(l);
        try {
          localStorage.setItem(storageKey, l);
        } catch {
          // Non-fatal: the choice just won't survive a reload.
        }
      },
      ui: ui[lang],
      t: (value) => leadText(lead, value, lang),
      tl: (value) => leadList(lead, value, lang),
    }),
    [lead, lang, storageKey]
  );

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
}

export function useLead(): Ctx {
  const ctx = useContext(LeadContext);
  if (!ctx) throw new Error("useLead must be used inside <LeadProvider>");
  return ctx;
}
