"use client";
import { directionsLink, formatPhone, fullAddress, mapEmbedSrc, mapsLink, telHref } from "../contact";
import { groupedWeek, isOpenNow } from "../hours";
import { useLead } from "../lead-context";
import Action from "../components/Action";
import Img from "../components/Img";
import Reveal from "../components/Reveal";
import SectionHead from "../components/SectionHead";

function MapFrame({ title, className = "", ratio }: { title: string; className?: string; ratio?: string }) {
  const { lead } = useLead();
  return (
    <div
      className={`media ${className}`}
      style={{ aspectRatio: ratio, borderRadius: "var(--radius-image)" }}
    >
      <iframe
        src={mapEmbedSrc(lead)}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ width: "100%", height: "100%", border: 0, filter: lead.design.mode === "dark" ? "invert(0.92) hue-rotate(180deg) saturate(0.6)" : "none" }}
      />
    </div>
  );
}

/** Address, hours and a working map — the three things a local customer looks for. */
export default function LocationSection({ index, full = false }: { index?: number; full?: boolean }) {
  const { lead, lang, ui, tl } = useLead();
  const variant = lead.design.variants.location;
  const week = groupedWeek(lead.hours, lang);
  const open = isOpenNow(lead.hours);
  const phone = formatPhone(lead.contact);
  const tel = telHref(lead.contact);
  const notes = tl(lead.location.notes);

  const details = (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="eyebrow">{ui.common.address}</p>
        <p style={{ color: "var(--text)" }}>{fullAddress(lead)}</p>
        {phone && tel ? (
          <a href={tel} className="tabular underline underline-offset-4 decoration-[var(--line-strong)] hover:decoration-[var(--text)] w-fit">
            {phone}
          </a>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <p className="eyebrow">{ui.common.hours}</p>
          <span
            className="text-[0.72rem] uppercase tracking-[0.12em] px-2.5 py-1"
            style={{
              border: "1px solid var(--line-strong)",
              borderRadius: "var(--radius-pill)",
              color: open ? "var(--text)" : "var(--text-faint)",
            }}
          >
            {open ? ui.common.openNow : ui.common.closedNow}
          </span>
        </div>
        <dl className="flex flex-col gap-1.5 text-sm max-w-[24rem]">
          {week.map((row) => (
            <div key={row.days} className="flex justify-between gap-6">
              <dt className="text-[var(--text-dim)]">{row.days}</dt>
              <dd className="tabular" style={{ color: "var(--text)" }}>{row.hours}</dd>
            </div>
          ))}
        </dl>
      </div>

      {notes.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="eyebrow">{ui.location.howToFind}</p>
          <ul className="flex flex-col gap-1.5 text-sm">
            {notes.map((note) => (
              <li key={note} className="text-[var(--text-dim)]">{note}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Action href={directionsLink(lead)} external>{ui.common.directions}</Action>
        <Action href={mapsLink(lead)} external variant="secondary">{ui.common.openInMaps}</Action>
      </div>
    </div>
  );

  return (
    <section
      id="location"
      className={full ? "pb-16 md:pb-24" : "section-y"}
      style={{ background: "var(--ink)" }}
    >
      <div className="wrap flex flex-col gap-10 md:gap-14">
        {/* The location page's own header already says this. */}
        {full ? null : (
          <SectionHead eyebrow={ui.nav.location} title={ui.location.title} index={index} />
        )}

        {variant === "map-full" ? (
          <div className="flex flex-col gap-10">
            <Reveal>
              <MapFrame title={`${lead.business.name} — ${ui.location.title}`} ratio="21 / 9" />
            </Reveal>
            <Reveal delay={1}>
              <div className="grid gap-10 md:grid-cols-2">{details}</div>
            </Reveal>
          </div>
        ) : variant === "detail-stack" ? (
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <Reveal>{details}</Reveal>
            <Reveal delay={1} className="flex flex-col gap-6">
              {lead.location.image ? (
                <Img
                  image={lead.location.image}
                  lang={lang}
                  fallbackLang={lead.defaultLocale}
                  ratio="4 / 3"
                  sizes="(max-width: 1024px) 92vw, 560px"
                />
              ) : null}
              <MapFrame title={`${lead.business.name} — ${ui.location.title}`} ratio="4 / 3" />
            </Reveal>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:items-start">
            <Reveal>{details}</Reveal>
            <Reveal delay={1}>
              <MapFrame title={`${lead.business.name} — ${ui.location.title}`} ratio={full ? "4 / 3" : "3 / 2"} />
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
