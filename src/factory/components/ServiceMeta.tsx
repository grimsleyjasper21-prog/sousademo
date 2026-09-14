"use client";
import { formatDuration, formatPrice } from "../format";
import { useLead } from "../lead-context";
import type { Service } from "../types";

/** Duration + price, rendered only from what the lead actually publishes. */
export function ServiceMeta({ service, className = "" }: { service: Service; className?: string }) {
  const { lang, ui } = useLead();
  const price = formatPrice(service.price, lang, ui);
  return (
    <span className={`inline-flex items-center gap-3 tabular text-sm ${className}`}>
      <span className="muted">{formatDuration(service.durationMin, lang, ui)}</span>
      {price ? (
        <>
          <span aria-hidden="true" className="muted">·</span>
          <span style={{ color: "var(--text)" }}>{price}</span>
        </>
      ) : null}
    </span>
  );
}

/** The disclosure that appears wherever indicative prices are shown. */
export function PricingNote({ className = "" }: { className?: string }) {
  const { lead, ui, t } = useLead();
  if (lead.catalogue.pricing !== "indicative") return null;
  const note = t(lead.catalogue.pricingNote) || ui.services.indicativeNote;
  return <p className={`text-xs muted max-w-[60ch] ${className}`}>{note}</p>;
}
