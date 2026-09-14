"use client";
import { useLead } from "../lead-context";
import { sectionUrl } from "../routes";
import Action from "../components/Action";
import Img from "../components/Img";
import Reveal from "../components/Reveal";
import type { ImageRef } from "../types";

/**
 * Four genuinely different first screens. The variant is a design decision made
 * per lead — a full-bleed cinema hero and a stacked-type hero share no layout,
 * only the data they read.
 */
export default function Hero() {
  const { lead, lang, ui, t } = useLead();
  const variant = lead.design.variants.hero;
  const hero = lead.images.hero;
  const secondary = lead.images.heroAlt;
  // The headline is the name people say out loud: a long legal-style name set
  // at display size wraps badly and reads worse.
  const name = lead.business.shortName ?? lead.business.name;
  const tagline = t(lead.business.tagline);
  const kicker = t(lead.business.kicker) || lead.location.locality;
  const bookHref = sectionUrl(lead, "booking");
  const servicesHref = sectionUrl(lead, "services");

  const actionItems = (
    <>
      {lead.booking.enabled ? <Action href={bookHref}>{ui.common.bookNow}</Action> : null}
      <Action href={servicesHref} variant="secondary">
        {ui.common.viewServices}
      </Action>
    </>
  );
  const actions = <div className="flex flex-wrap gap-3">{actionItems}</div>;

  // A lead still being built — or a business with no usable photography — gets a
  // type-led hero rather than a broken image box.
  if (!hero) {
    return (
      <section className="pt-32 md:pt-44 pb-10">
        <div className="wrap flex flex-col gap-7">
          <Reveal>
            <p className="eyebrow" data-style={lead.design.eyebrowStyle}>{kicker}</p>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="display-1 max-w-[14ch]">{name}</h1>
          </Reveal>
          {tagline ? (
            <Reveal delay={2}>
              <p className="lead-text max-w-[46ch]">{tagline}</p>
            </Reveal>
          ) : null}
          <Reveal delay={3}>{actions}</Reveal>
        </div>
      </section>
    );
  }

  if (variant === "split-editorial") {
    return (
      <section className="relative">
        <div className="grid lg:grid-cols-[1fr_1.05fr] min-h-[88svh]">
          <div className="flex items-center order-2 lg:order-1">
            <div className="wrap py-14 lg:py-0 flex flex-col gap-7 lg:max-w-[38rem] lg:ml-auto lg:pr-16">
              <Reveal>
                <p className="eyebrow" data-style={lead.design.eyebrowStyle}>{kicker}</p>
              </Reveal>
              <Reveal delay={1}>
                <h1 className="display-1">{name}</h1>
              </Reveal>
              <Reveal delay={2}>
                <p className="lead-text max-w-[44ch]">{tagline}</p>
              </Reveal>
              <Reveal delay={3}>{actions}</Reveal>
            </div>
          </div>
          <div className="order-1 lg:order-2 relative min-h-[46svh] lg:min-h-full">
            <HeroMedia image={hero} lang={lang} fallback={lead.defaultLocale} fill />
          </div>
        </div>
      </section>
    );
  }

  if (variant === "stacked-type") {
    return (
      <section className="pt-28 md:pt-36">
        <div className="wrap flex flex-col gap-8">
          <Reveal>
            <p className="eyebrow" data-style={lead.design.eyebrowStyle}>{kicker}</p>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="display-1 max-w-[16ch]">{name}</h1>
          </Reveal>
          <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <Reveal delay={2}>
              <p className="lead-text max-w-[46ch]">{tagline}</p>
            </Reveal>
            <Reveal delay={3}>{actions}</Reveal>
          </div>
        </div>
        <Reveal delay={4} className="mt-12">
          <div className="wrap">
            <Img
              image={hero}
              lang={lang}
              fallbackLang={lead.defaultLocale}
              ratio="16 / 9"
              sizes="(max-width: 1240px) 100vw, 1240px"
              priority
            />
          </div>
        </Reveal>
      </section>
    );
  }

  if (variant === "frame-portrait") {
    return (
      <section className="pt-28 md:pt-32 pb-4">
        <div className="wrap">
          <div className="relative flex flex-col items-center text-center gap-8">
            <Reveal>
              <p className="eyebrow" data-style={lead.design.eyebrowStyle}>{kicker}</p>
            </Reveal>
            <Reveal delay={1}>
              <h1 className="display-1 max-w-[14ch]">{name}</h1>
            </Reveal>
            <Reveal delay={2} className="w-full">
              <div className="mx-auto w-full max-w-[min(92vw,720px)]">
                <Img
                  image={hero}
                  lang={lang}
                  fallbackLang={lead.defaultLocale}
                  ratio="4 / 5"
                  sizes="(max-width: 768px) 92vw, 720px"
                  priority
                />
              </div>
            </Reveal>
            <Reveal delay={3}>
              <p className="lead-text max-w-[46ch] mx-auto">{tagline}</p>
            </Reveal>
            <Reveal delay={4}>
              <div className="flex flex-wrap gap-3 justify-center">{actionItems}</div>
            </Reveal>
          </div>
        </div>
      </section>
    );
  }

  // full-bleed-cinema
  return (
    <section className="relative min-h-[92svh] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <HeroMedia image={hero} lang={lang} fallback={lead.defaultLocale} fill zoom />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, color-mix(in srgb, var(--ink) 92%, transparent) 0%, color-mix(in srgb, var(--ink) 55%, transparent) 38%, color-mix(in srgb, var(--ink) 15%, transparent) 72%)",
          }}
        />
      </div>
      <div className="wrap relative pb-16 md:pb-24 pt-32 w-full">
        <div className="flex flex-col gap-6 max-w-[46rem]">
          <Reveal>
            <p className="eyebrow" data-style={lead.design.eyebrowStyle}>{kicker}</p>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="display-1">{name}</h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="lead-text max-w-[44ch]">{tagline}</p>
          </Reveal>
          <Reveal delay={3}>{actions}</Reveal>
        </div>
        {secondary ? (
          <Reveal delay={4} className="hidden lg:block absolute right-[clamp(1.25rem,4vw,3rem)] bottom-24 w-[15rem]">
            <Img
              image={secondary}
              lang={lang}
              fallbackLang={lead.defaultLocale}
              ratio="3 / 4"
              sizes="240px"
            />
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

function HeroMedia({
  image,
  lang,
  fallback,
  fill,
  zoom = false,
}: {
  image: ImageRef;
  lang: Parameters<typeof Img>[0]["lang"];
  fallback: Parameters<typeof Img>[0]["fallbackLang"];
  fill?: boolean;
  zoom?: boolean;
}) {
  return (
    <div className={fill ? "absolute inset-0" : ""}>
      <Img
        image={image}
        lang={lang}
        fallbackLang={fallback}
        ratio="auto"
        sizes="100vw"
        priority
        className={zoom ? "hero-zoom" : ""}
        style={{ width: "100%", height: "100%", aspectRatio: "auto" }}
      />
    </div>
  );
}
