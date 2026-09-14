"use client";
import Link from "next/link";
import { useState } from "react";
import Img from "../components/Img";
import Reveal from "../components/Reveal";
import SectionHead from "../components/SectionHead";
import { PricingNote, ServiceMeta } from "../components/ServiceMeta";
import { formatPrice, servicesInCategory } from "../format";
import { useLead } from "../lead-context";
import { sectionUrl, serviceUrl } from "../routes";
import type { Service } from "../types";

/**
 * Four service presentations. An editorial index and an image grid sell very
 * differently, so which one a lead gets is an art-direction call, not a default.
 */
export default function ServicesSection({
  full = false,
  index,
  eyebrow,
  title,
  intro,
}: {
  /** true on the services page: every service, grouped by category. */
  full?: boolean;
  index?: number;
  eyebrow?: string;
  title?: string;
  intro?: string;
}) {
  const { lead, ui, t } = useLead();
  const variant = lead.design.variants.services;
  const { categories, services } = lead.catalogue;

  const shown = full ? services : services.filter((s) => s.featured);
  const list = shown.length > 0 ? shown : services.slice(0, 6);

  return (
    <section
      id="services"
      className={full ? "pb-16 md:pb-24" : "section-y"}
      style={{ background: "var(--ink)" }}
    >
      <div className="wrap flex flex-col gap-10 md:gap-14">
        {/* On the services page the page header already carries the title —
            repeating it here would read like a mistake. */}
        {full ? null : (
          <SectionHead
            eyebrow={eyebrow ?? ui.nav.services}
            title={title ?? ui.services.title}
            intro={intro}
            index={index}
            aside={
              <Link href={sectionUrl(lead, "services")} className="btn btn-quiet whitespace-nowrap">
                {ui.common.viewAll}
              </Link>
            }
          />
        )}

        {full ? (
          <div className="flex flex-col gap-16">
            {categories.map((category, i) => {
              const inCategory = servicesInCategory(services, category.id);
              if (inCategory.length === 0) return null;
              return (
                <div key={category.id} className="flex flex-col gap-6">
                  <Reveal>
                    <div className="flex items-baseline justify-between gap-6 border-b pb-3" style={{ borderColor: "var(--line)" }}>
                      <h3 className="display-3">{t(category.name)}</h3>
                      <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                  </Reveal>
                  {category.blurb ? (
                    <Reveal delay={1}>
                      <p className="max-w-[56ch]">{t(category.blurb)}</p>
                    </Reveal>
                  ) : null}
                  <ServiceList variant={variant} services={inCategory} />
                </div>
              );
            })}
          </div>
        ) : (
          <ServiceList variant={variant} services={list} />
        )}

        <PricingNote />
      </div>
    </section>
  );
}

function ServiceList({ variant, services }: { variant: string; services: Service[] }) {
  if (variant === "image-grid") return <ImageGrid services={services} />;
  if (variant === "menu-columns") return <MenuColumns services={services} />;
  if (variant === "feature-rail") return <FeatureRail services={services} />;
  return <EditorialIndex services={services} />;
}

/* ---------------------------------------------------------------- variants */

function EditorialIndex({ services }: { services: Service[] }) {
  const { lead, lang, ui, t } = useLead();
  const [hovered, setHovered] = useState<Service | null>(null);
  const preview = hovered?.image ?? null;

  return (
    <div className="relative grid lg:grid-cols-[1fr_auto] gap-10">
      <ul className="flex flex-col">
        {services.map((service, i) => (
          <Reveal as="li" key={service.id} delay={Math.min(i, 6)}>
            <Link
              href={serviceUrl(lead, service.id)}
              className="group grid grid-cols-[1fr_auto] items-baseline gap-4 py-5 border-b transition-colors"
              style={{ borderColor: "var(--line)" }}
              onMouseEnter={() => setHovered(service)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(service)}
              onBlur={() => setHovered(null)}
            >
              <span className="flex flex-col gap-1.5 min-w-0">
                <span
                  className="display-3 transition-opacity group-hover:opacity-60"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {t(service.name)}
                </span>
                {service.short ? (
                  <span className="text-sm muted line-clamp-2">{t(service.short)}</span>
                ) : null}
              </span>
              <ServiceMeta service={service} className="shrink-0" />
            </Link>
          </Reveal>
        ))}
      </ul>

      <div className="hidden lg:block w-[19rem]">
        <div className="sticky top-28">
          {preview ? (
            <Img
              image={preview}
              lang={lang}
              fallbackLang={lead.defaultLocale}
              ratio="3 / 4"
              sizes="304px"
            />
          ) : (
            <div
              className="media flex items-center justify-center text-center p-8"
              style={{ aspectRatio: "3 / 4" }}
            >
              <p className="text-xs uppercase tracking-[0.18em] muted">{ui.services.title}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ImageGrid({ services }: { services: Service[] }) {
  const { lead, lang, t } = useLead();
  return (
    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service, i) => (
        <Reveal key={service.id} delay={Math.min(i, 5)}>
          <Link href={serviceUrl(lead, service.id)} className="group flex flex-col gap-4">
            {service.image ? (
              <div className="overflow-hidden" style={{ borderRadius: "var(--radius-image)" }}>
                <Img
                  image={service.image}
                  lang={lang}
                  fallbackLang={lead.defaultLocale}
                  ratio="4 / 5"
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                  className="transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
            ) : null}
            <div className="flex flex-col gap-2">
              <h3 className="display-3">{t(service.name)}</h3>
              {service.short ? <p className="text-sm">{t(service.short)}</p> : null}
              <ServiceMeta service={service} />
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

function MenuColumns({ services }: { services: Service[] }) {
  const { lead, lang, ui, t } = useLead();
  return (
    <div className="grid gap-x-16 gap-y-2 md:grid-cols-2">
      {services.map((service, i) => {
        const price = formatPrice(service.price, lang, ui);
        return (
          <Reveal key={service.id} delay={Math.min(i, 8)}>
            <Link href={serviceUrl(lead, service.id)} className="group flex flex-col gap-1 py-4">
              <span className="flex items-baseline gap-3">
                <span className="display-3 shrink-0 group-hover:opacity-65 transition-opacity">
                  {t(service.name)}
                </span>
                <span
                  className="flex-1 border-b translate-y-[-0.25em]"
                  style={{ borderColor: "var(--line)" }}
                  aria-hidden="true"
                />
                {price ? <span className="tabular shrink-0" style={{ color: "var(--text)" }}>{price}</span> : null}
              </span>
              <span className="flex items-baseline gap-2 text-sm">
                {service.short ? <span className="muted">{t(service.short)}</span> : null}
                <span className="muted tabular ml-auto shrink-0">{service.durationMin} {ui.common.minutes}</span>
              </span>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}

function FeatureRail({ services }: { services: Service[] }) {
  const { lead, lang, t } = useLead();
  return (
    <div className="rail -mx-[clamp(1.25rem,4vw,3rem)] px-[clamp(1.25rem,4vw,3rem)]">
      {services.map((service, i) => (
        <Reveal key={service.id} delay={Math.min(i, 5)} className="w-[76vw] sm:w-[22rem]">
          <Link href={serviceUrl(lead, service.id)} className="group flex flex-col gap-4 h-full">
            {service.image ? (
              <div className="overflow-hidden" style={{ borderRadius: "var(--radius-image)" }}>
                <Img
                  image={service.image}
                  lang={lang}
                  fallbackLang={lead.defaultLocale}
                  ratio="3 / 4"
                  sizes="(max-width: 640px) 76vw, 352px"
                  className="transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
            ) : null}
            <div className="flex flex-col gap-2">
              <h3 className="display-3">{t(service.name)}</h3>
              {service.short ? <p className="text-sm">{t(service.short)}</p> : null}
              <ServiceMeta service={service} />
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

