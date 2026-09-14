"use client";
import Img from "../components/Img";
import Reveal from "../components/Reveal";
import SectionHead from "../components/SectionHead";
import { useLead } from "../lead-context";

/** Editorial about block: image on one side, the business's own story on the other. */
export default function AboutSection({ index }: { index?: number }) {
  const { lead, lang, ui, t, tl } = useLead();
  const about = lead.copy.about;
  if (!about) return null;
  const body = tl(about.body);
  const image = about.imageKey ? lead.images[about.imageKey] : undefined;

  return (
    <section id="about" className="section-y" style={{ background: "var(--ink)" }}>
      <div className="wrap grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
        {image ? (
          <Reveal>
            <Img
              image={image}
              lang={lang}
              fallbackLang={lead.defaultLocale}
              ratio="4 / 5"
              sizes="(max-width: 1024px) 92vw, 560px"
            />
          </Reveal>
        ) : null}
        <div className="flex flex-col gap-6">
          <SectionHead
            eyebrow={about.eyebrow ? t(about.eyebrow) : ui.nav.about}
            title={t(about.title)}
            index={index}
          />
          {body.map((paragraph, i) => (
            <Reveal key={i} delay={3 + i}>
              <p className="max-w-[54ch]">{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
