"use client";
import Action from "../components/Action";
import Img from "../components/Img";
import Reveal from "../components/Reveal";
import { leadWhatsapp } from "../contact";
import { useLead } from "../lead-context";
import { sectionUrl } from "../routes";

/** The closing ask. Three treatments, so the last screen is never predictable. */
export default function CtaSection() {
  const { lead, lang, ui, t } = useLead();
  const variant = lead.design.variants.cta;
  const cta = lead.copy.cta;
  const image = cta.imageKey ? lead.images[cta.imageKey] : undefined;
  const wa = leadWhatsapp(lead, `${ui.booking.whatsappMessage} — ${lead.business.name}`);

  const buttons = (
    <div className="flex flex-wrap gap-3">
      {lead.booking.enabled ? (
        <Action href={sectionUrl(lead, "booking")} variant={variant === "full-image" ? "invert" : "primary"}>
          {ui.common.bookNow}
        </Action>
      ) : null}
      {wa ? (
        <Action href={wa} external variant="secondary">
          {ui.common.whatsapp}
        </Action>
      ) : null}
    </div>
  );

  if (variant === "full-image" && image) {
    return (
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Img
            image={image}
            lang={lang}
            fallbackLang={lead.defaultLocale}
            sizes="100vw"
            style={{ width: "100%", height: "100%", aspectRatio: "auto", borderRadius: 0 }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "color-mix(in srgb, var(--ink) 68%, transparent)" }}
          />
        </div>
        <div className="wrap py-24 md:py-36 flex flex-col items-center text-center gap-6">
          <Reveal>
            <h2 className="display-2 max-w-[16ch]">{t(cta.title)}</h2>
          </Reveal>
          {cta.body ? (
            <Reveal delay={1}>
              <p className="lead-text max-w-[48ch]">{t(cta.body)}</p>
            </Reveal>
          ) : null}
          <Reveal delay={2}>{buttons}</Reveal>
        </div>
      </section>
    );
  }

  if (variant === "split-panel") {
    return (
      <section className="grid lg:grid-cols-2" style={{ background: "var(--surface)" }}>
        <div className="flex items-center">
          <div className="wrap py-20 md:py-28 flex flex-col gap-6 lg:max-w-[34rem] lg:ml-auto lg:pr-14">
            <Reveal>
              <h2 className="display-2">{t(cta.title)}</h2>
            </Reveal>
            {cta.body ? (
              <Reveal delay={1}>
                <p className="lead-text max-w-[46ch]">{t(cta.body)}</p>
              </Reveal>
            ) : null}
            <Reveal delay={2}>{buttons}</Reveal>
          </div>
        </div>
        {image ? (
          <div className="relative min-h-[42svh] lg:min-h-full">
            <Img
              image={image}
              lang={lang}
              fallbackLang={lead.defaultLocale}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="absolute inset-0"
              style={{ width: "100%", height: "100%", aspectRatio: "auto", borderRadius: 0 }}
            />
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section className="section-y" style={{ background: "var(--surface)" }}>
      <div className="wrap flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-4 max-w-[34rem]">
          <Reveal>
            <h2 className="display-2">{t(cta.title)}</h2>
          </Reveal>
          {cta.body ? (
            <Reveal delay={1}>
              <p className="lead-text">{t(cta.body)}</p>
            </Reveal>
          ) : null}
        </div>
        <Reveal delay={2}>{buttons}</Reveal>
      </div>
    </section>
  );
}
