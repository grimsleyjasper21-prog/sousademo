"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { dict, type Lang } from "./i18n-dict";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (path: string) => string };
const I18nContext = createContext<Ctx | null>(null);

function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as object)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

const STORAGE_KEY = "sousa-lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-only read of a browser API to avoid an SSR/client hydration mismatch.
      if (stored === "es" || stored === "en") setLangState(stored);
    } catch {
      // localStorage unavailable — default to Spanish.
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  };

  const t = useMemo(() => {
    return (path: string): string => {
      const val = getByPath(dict[lang], path) ?? getByPath(dict.es, path);
      return typeof val === "string" ? val : path;
    };
  }, [lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
