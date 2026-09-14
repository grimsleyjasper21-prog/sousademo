"use client";
import { localeLabel } from "../locale";
import { useLead } from "../lead-context";

/** Two languages toggle, three or more become a compact segmented control. */
export default function LangSwitch({ className = "" }: { className?: string }) {
  const { lead, lang, setLang, ui } = useLead();
  if (lead.locales.length < 2) return null;

  if (lead.locales.length === 2) {
    const other = lead.locales.find((l) => l !== lang) ?? lead.locales[0];
    return (
      <button
        type="button"
        onClick={() => setLang(other)}
        className={`text-xs uppercase tracking-[0.14em] font-semibold px-3 py-2 border border-[var(--line-strong)] hover:border-[var(--text)] transition-colors ${className}`}
        style={{ borderRadius: "var(--radius-sm)" }}
        aria-label={`${ui.nav.language}: ${localeLabel[other]}`}
      >
        {localeLabel[other]}
      </button>
    );
  }

  return (
    <div
      className={`flex items-center gap-1 border border-[var(--line-strong)] p-0.5 ${className}`}
      style={{ borderRadius: "var(--radius-sm)" }}
      role="group"
      aria-label={ui.nav.language}
    >
      {lead.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={l === lang}
          className="text-xs uppercase tracking-[0.12em] font-semibold px-2.5 py-1.5 transition-colors"
          style={{
            background: l === lang ? "var(--accent)" : "transparent",
            color: l === lang ? "var(--accent-contrast)" : "var(--text-dim)",
            borderRadius: "calc(var(--radius-sm) - 1px)",
          }}
        >
          {localeLabel[l]}
        </button>
      ))}
    </div>
  );
}
