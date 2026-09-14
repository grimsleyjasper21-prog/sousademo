"use client";
import Link from "next/link";
import Action from "../components/Action";
import Img from "../components/Img";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import { ServiceMeta, PricingNote } from "../components/ServiceMeta";
import { formatDuration, formatPrice, relatedServices } from "../format";
import { useLead } from "../lead-context";
import { sectionUrl, serviceUrl } from "../routes";
import type { Service } from "../types";

/** A real page per service, generated from the lead's own service data. */
export default function ServicePage({ service }: { service: Service }) {
  const { lead, lang, ui, t, tl } = useLead();
  const category = lead.catalogue.categories.find((c) => c.id === service.categoryId);
  const includes = tl(service.includes);
  const practical = tl(service.practical);
  const related = relatedServices(lead.catalogue.services, service);
  const price = formatPrice(service.price, lang, ui);
  const bookHref = `${sectionUrl(lead, "booking")}?s=${encodeURIComponent(service.id)}`;

  return (
    <>
      <PageHeader
        title={t(service.name)}
        intro={t(service.short)}
        backHref={sectionUrl(lead, "services")}
        backLabel={ui.services.title}
        aside={
          <div className="flex flex-col gap-3 items-start md:items-end">
            <div className="flex items-baseline gap-4">
              <span className="display-3 tabular">{price ?? ui.services.noPrice}</span>
              <span className="text-sm muted tabular">{formatDuration(service.durationMin, lang, ui)}</span>
            </div>
            {lead.booking.enabled && service.bookable !== false ? (
              <Action href={bookHref}>{ui.common.bookThis}</Action>
            ) : null}
          </div>
        }
      />

      {service.image ? (
        <div className="wrap">
          <Reveal>
            <Img
              image={service.image}
              lang={lang}
              fallbackLang={lead.defaultLocale}
              ratio="21 / 9"
              sizes="(max-width: 1240px) 100vw, 1240px"
              priority
            />
          </Reveal>
        </div>
      ) : null}

      <section className="section-y" style={{ background: "var(--ink)" }}>
        <div className="wrap grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <div className="flex flex-col gap-8">
            {t(service.description) ? (
              <Reveal>
                <p className="lead-text max-w-[58ch]">{t(service.description)}</p>
              </Reveal>
            ) : null}

            {includes.length > 0 ? (
              <Reveal delay={1}>
                <div className="flex flex-col gap-4">
                  <p className="eyebrow">{ui.services.includes}</p>
                  <ul className="flex flex-col">
                    {includes.map((item) => (
                      <li
                        key={item}
                        className="py-3 border-b text-[var(--text-dim)]"
                        style={{ borderColor: "var(--line)" }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ) : null}

            {practical.length > 0 ? (
              <Reveal delay={2}>
                <div className="flex flex-col gap-3">
                  <p className="eyebrow">{ui.services.practical}</p>
                  <ul className="flex flex-col gap-2">
                    {practical.map((item) => (
                      <li key={item} className="text-sm text-[var(--text-dim)]">{item}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ) : null}
          </div>

          <Reveal delay={1}>
            <aside
              className="flex flex-col gap-5 p-7 border h-fit lg:sticky lg:top-28"
              style={{ borderColor: "var(--line-strong)", borderRadius: "var(--radius-lg)", background: "var(--surface)" }}
            >
              <dl className="flex flex-col gap-3 text-sm">
                {category ? (
                  <div className="flex justify-between gap-4">
                    <dt className="muted">{ui.services.category}</dt>
                    <dd style={{ color: "var(--text)" }}>{t(category.name)}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-4">
                  <dt className="muted">{ui.common.duration}</dt>
                  <dd className="tabular" style={{ color: "var(--text)" }}>
                    {formatDuration(service.durationMin, lang, ui)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="muted">{ui.common.price}</dt>
                  <dd className="tabular" style={{ color: "var(--text)" }}>{price ?? ui.services.noPrice}</dd>
                </div>
              </dl>
              {lead.booking.enabled && service.bookable !== false ? (
                <Action href={bookHref} className="w-full">
                  {ui.common.bookThis}
                </Action>
              ) : null}
              <PricingNote />
            </aside>
          </Reveal>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="section-y" style={{ background: "var(--surface)" }}>
          <div className="wrap flex flex-col gap-8">
            <Reveal>
              <h2 className="display-3">{ui.common.related}</h2>
            </Reveal>
            <ul className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r, i) => (
                <Reveal as="li" key={r.id} delay={i}>
                  <Link href={serviceUrl(lead, r.id)} className="group flex flex-col gap-3">
                    {r.image ? (
                      <div className="overflow-hidden" style={{ borderRadius: "var(--radius-image)" }}>
                        <Img
                          image={r.image}
                          lang={lang}
                          fallbackLang={lead.defaultLocale}
                          ratio="4 / 3"
                          sizes="(max-width: 640px) 90vw, 30vw"
                          className="transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      </div>
                    ) : null}
                    <span className="display-3">{t(r.name)}</span>
                    <ServiceMeta service={r} />
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
