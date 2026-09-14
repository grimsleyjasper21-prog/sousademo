"use client";
import Link from "next/link";
import { formatPhone, fullAddress, leadWhatsapp, mailtoHref, mapsLink, telHref } from "../contact";
import { groupedWeek } from "../hours";
import { useLead } from "../lead-context";
import { demoHome, sectionUrl } from "../routes";
import DemoNote from "./DemoNote";

export default function Footer() {
  const { lead, lang, ui, t } = useLead();
  const variant = lead.design.variants.footer;
  const phone = formatPhone(lead.contact);
  const tel = telHref(lead.contact);
  const mail = mailtoHref(lead.contact);
  const wa = leadWhatsapp(lead, `${ui.booking.whatsappMessage} — ${lead.business.name}`);
  const week = groupedWeek(lead.hours, lang);

  const links = [
    { href: sectionUrl(lead, "services"), label: ui.nav.services },
    { href: sectionUrl(lead, "booking"), label: ui.nav.booking },
    { href: sectionUrl(lead, "location"), label: ui.nav.location },
    { href: sectionUrl(lead, "contact"), label: ui.nav.contact },
  ];

  const brand = lead.business.shortName ?? lead.business.name;

  return (
    <footer
      className="border-t"
      style={{ background: "var(--ink)", borderColor: "var(--line)" }}
    >
      <div className={`wrap ${variant === "compact" ? "py-12" : "py-16 md:py-24"}`}>
        {variant === "compact" ? (
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <Link href={demoHome(lead)} className="text-2xl" style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>
              {brand}
            </Link>
            <nav className="flex flex-wrap gap-x-7 gap-y-3">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="text-sm text-[var(--text-dim)] hover:text-[var(--text)] transition-colors">
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-1 text-sm">
              {phone && tel ? <a href={tel} className="hover:opacity-70 transition-opacity">{phone}</a> : null}
              <a href={mapsLink(lead)} target="_blank" rel="noopener noreferrer" className="text-[var(--text-dim)] hover:text-[var(--text)] transition-colors">
                {lead.location.locality}
              </a>
            </div>
          </div>
        ) : (
          <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr] md:gap-16">
            <div className="flex flex-col gap-5">
              <Link href={demoHome(lead)} className="text-3xl md:text-4xl" style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>
                {brand}
              </Link>
              <p className="max-w-[34ch]">{t(lead.business.tagline)}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                {wa ? (
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-[var(--line-strong)] hover:decoration-[var(--text)]">
                    WhatsApp
                  </a>
                ) : null}
                {lead.contact.instagram ? (
                  <a href={lead.contact.instagram.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-[var(--line-strong)] hover:decoration-[var(--text)]">
                    Instagram
                  </a>
                ) : null}
                {mail ? (
                  <a href={mail} className="underline underline-offset-4 decoration-[var(--line-strong)] hover:decoration-[var(--text)]">
                    {ui.common.email}
                  </a>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="eyebrow">{ui.common.hours}</p>
              <dl className="flex flex-col gap-1.5 text-sm">
                {week.map((row) => (
                  <div key={row.days} className="flex justify-between gap-4 max-w-[26rem]">
                    <dt className="text-[var(--text-dim)]">{row.days}</dt>
                    <dd className="tabular text-[var(--text)]">{row.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex flex-col gap-4">
              <p className="eyebrow">{ui.common.address}</p>
              <a
                href={mapsLink(lead)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--text-dim)] hover:text-[var(--text)] transition-colors max-w-[28ch]"
              >
                {fullAddress(lead)}
              </a>
              {phone && tel ? (
                <a href={tel} className="text-sm hover:opacity-70 transition-opacity tabular">
                  {phone}
                </a>
              ) : null}
              <nav className="flex flex-col gap-2 mt-2">
                {links.map((l) => (
                  <Link key={l.href} href={l.href} className="text-sm text-[var(--text-dim)] hover:text-[var(--text)] transition-colors">
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        <div
          className="mt-12 pt-6 border-t flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: "var(--line)" }}
        >
          <DemoNote />
          <p className="text-[0.72rem] tracking-[0.08em] uppercase muted">
            © {new Date().getFullYear()} {lead.business.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
