"use client";
import Action from "../components/Action";
import Img from "../components/Img";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import {
  directionsLink,
  formatPhone,
  fullAddress,
  leadWhatsapp,
  mailtoHref,
  mapEmbedSrc,
  mapsLink,
  telHref,
} from "../contact";
import { groupedWeek, isOpenNow } from "../hours";
import { useLead } from "../lead-context";
import { sectionUrl } from "../routes";

/** How this business actually wants to be contacted, in the order it prefers. */
export default function ContactPage() {
  const { lead, lang, ui } = useLead();
  const phone = formatPhone(lead.contact);
  const tel = telHref(lead.contact);
  const mail = mailtoHref(lead.contact);
  const wa = leadWhatsapp(lead, `${ui.booking.whatsappMessage} — ${lead.business.name}`);
  const week = groupedWeek(lead.hours, lang);
  const open = isOpenNow(lead.hours);

  const channels = [
    wa ? { label: "WhatsApp", value: ui.contact.preferWhatsapp, href: wa, external: true, primary: true } : null,
    phone && tel ? { label: ui.common.phone, value: phone, href: tel, external: false, primary: false } : null,
    mail && lead.contact.email
      ? { label: ui.common.email, value: lead.contact.email, href: mail, external: false, primary: false }
      : null,
    lead.contact.instagram
      ? {
          label: "Instagram",
          value: lead.contact.instagram.handle,
          href: lead.contact.instagram.url,
          external: true,
          primary: false,
        }
      : null,
  ].filter(Boolean) as { label: string; value: string; href: string; external: boolean; primary: boolean }[];

  return (
    <>
      <PageHeader eyebrow={ui.nav.contact} title={ui.contact.title} intro={ui.contact.preferWhatsapp} />

      <section className="pb-16 md:pb-24" style={{ background: "var(--ink)" }}>
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-10">
            <ul className="flex flex-col">
              {channels.map((c, i) => (
                <Reveal as="li" key={c.label} delay={i}>
                  <a
                    href={c.href}
                    target={c.external ? "_blank" : undefined}
                    rel={c.external ? "noopener noreferrer" : undefined}
                    className="group flex items-baseline justify-between gap-6 py-5 border-b"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <span className="display-3 group-hover:opacity-65 transition-opacity">{c.label}</span>
                    <span className="text-sm text-right muted max-w-[18ch]">{c.value}</span>
                  </a>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={2} className="flex flex-col gap-3">
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
            </Reveal>

            <Reveal delay={3} className="flex flex-wrap gap-3">
              {lead.booking.enabled ? (
                <Action href={sectionUrl(lead, "booking")}>{ui.common.bookNow}</Action>
              ) : null}
              <Action href={directionsLink(lead)} external variant="secondary">
                {ui.common.directions}
              </Action>
            </Reveal>
          </div>

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
            <div className="media" style={{ aspectRatio: "4 / 3", borderRadius: "var(--radius-image)" }}>
              <iframe
                src={mapEmbedSrc(lead)}
                title={`${lead.business.name} — ${ui.location.title}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{
                  width: "100%",
                  height: "100%",
                  border: 0,
                  filter: lead.design.mode === "dark" ? "invert(0.92) hue-rotate(180deg) saturate(0.6)" : "none",
                }}
              />
            </div>
            <a
              href={mapsLink(lead)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
            >
              {fullAddress(lead)}
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
