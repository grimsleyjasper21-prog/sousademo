"use client";
import BookingFlow from "../booking/BookingFlow";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import { groupedWeek } from "../hours";
import { formatPhone, leadWhatsapp, telHref } from "../contact";
import { useLead } from "../lead-context";

export default function BookingPage({ initialServiceId }: { initialServiceId?: string }) {
  const { lead, lang, ui } = useLead();
  const week = groupedWeek(lead.hours, lang);
  const phone = formatPhone(lead.contact);
  const tel = telHref(lead.contact);
  const wa = leadWhatsapp(lead, `${ui.booking.whatsappMessage} — ${lead.business.name}`);

  return (
    <>
      <PageHeader eyebrow={ui.nav.booking} title={ui.booking.title} intro={ui.booking.intro} />
      <section className="pb-20 md:pb-28" style={{ background: "var(--ink)" }}>
        <div className="wrap grid gap-10 lg:grid-cols-[1.4fr_0.8fr] lg:gap-16 items-start">
          <Reveal>
            <BookingFlow initialServiceId={initialServiceId} />
          </Reveal>

          <Reveal delay={1} className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <p className="eyebrow">{ui.common.hours}</p>
              <dl className="flex flex-col gap-1.5 text-sm">
                {week.map((row) => (
                  <div key={row.days} className="flex justify-between gap-6">
                    <dt className="text-[var(--text-dim)]">{row.days}</dt>
                    <dd className="tabular" style={{ color: "var(--text)" }}>{row.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex flex-col gap-3">
              <p className="eyebrow">{ui.contact.title}</p>
              <p className="text-sm">{ui.contact.preferWhatsapp}</p>
              <div className="flex flex-col gap-2 text-sm">
                {wa ? (
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-[var(--line-strong)] hover:decoration-[var(--text)] w-fit">
                    WhatsApp
                  </a>
                ) : null}
                {phone && tel ? (
                  <a href={tel} className="tabular underline underline-offset-4 decoration-[var(--line-strong)] hover:decoration-[var(--text)] w-fit">
                    {phone}
                  </a>
                ) : null}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
