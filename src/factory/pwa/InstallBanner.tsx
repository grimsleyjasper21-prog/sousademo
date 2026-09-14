"use client";
import { useEffect, useState } from "react";
import { useLead } from "../lead-context";
import { usePwa } from "./PwaProvider";

/** Appears only when the browser has actually offered an install, and only once. */
export default function InstallBanner() {
  const { lead, ui } = useLead();
  const { canInstall, isStandalone, install } = usePwa();
  const [dismissed, setDismissed] = useState(true);
  const key = `grimhart-install-dismissed:${lead.slug}`;

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-only read of a browser API.
      setDismissed(localStorage.getItem(key) === "1");
    } catch {
      setDismissed(false);
    }
  }, [key]);

  if (!canInstall || isStandalone || dismissed) return null;

  const name = lead.business.shortName ?? lead.business.name;

  return (
    <div
      className="fixed inset-x-3 z-[60] p-4 flex items-center gap-4 md:left-auto md:right-6 md:w-[24rem]"
      style={{
        bottom: "calc(max(0.75rem, env(safe-area-inset-bottom)) + 4.5rem)",
        background: "var(--surface)",
        border: "1px solid var(--line-strong)",
        borderRadius: "var(--radius-lg)",
      }}
      role="dialog"
      aria-label={ui.pwa.title.replace("{name}", name)}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-sm" style={{ color: "var(--text)" }}>
          {ui.pwa.title.replace("{name}", name)}
        </p>
        <p className="text-xs muted">{ui.pwa.body}</p>
      </div>
      <div className="flex items-center gap-2 ml-auto shrink-0">
        <button
          type="button"
          className="text-xs muted underline underline-offset-4"
          onClick={() => {
            setDismissed(true);
            try {
              localStorage.setItem(key, "1");
            } catch {
              // Nothing to persist to — the banner just reappears next visit.
            }
          }}
        >
          {ui.pwa.dismiss}
        </button>
        <button type="button" className="btn btn-primary px-4 py-2 min-h-0 text-xs" onClick={install}>
          {ui.pwa.install}
        </button>
      </div>
    </div>
  );
}
