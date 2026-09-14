"use client";
import Img from "@/factory/components/Img";
import Reveal from "@/factory/components/Reveal";
import SectionHead from "@/factory/components/SectionHead";
import { useLead } from "@/factory/lead-context";
import { sousaImages } from "../images";

const copy = {
  es: {
    eyebrow: "Campaña",
    title: "Brunette. Copper. Blonde.",
    intro: "Una misma dirección de arte, tres resultados de color.",
    captions: {
      portraitBrunette: "Brunette natural",
      portraitCopper: "Copper cálido",
      portraitBlonde: "Blonde luminoso",
      textureDetail: "Textura macro",
      movementBlur: "Movimiento",
      salonAtmosphere: "El espacio",
      toolsFlatlay: "Herramientas de precisión",
    },
  },
  en: {
    eyebrow: "Campaign",
    title: "Brunette. Copper. Blonde.",
    intro: "One art direction, three colour results.",
    captions: {
      portraitBrunette: "Natural brunette",
      portraitCopper: "Warm copper",
      portraitBlonde: "Luminous blonde",
      textureDetail: "Macro texture",
      movementBlur: "Movement",
      salonAtmosphere: "The room",
      toolsFlatlay: "Precision tools",
    },
  },
} as const;

/** SOUSA's colour campaign: a mosaic that earns its place because the imagery is strong. */
export default function Campaign() {
  const { lead, lang } = useLead();
  const c = copy[lang === "en" ? "en" : "es"];

  const tiles = [
    { key: "portraitBrunette", image: sousaImages.portraitBrunette, ratio: "3 / 4", span: "md:col-span-4" },
    { key: "portraitCopper", image: sousaImages.portraitCopper, ratio: "3 / 4", span: "md:col-span-4" },
    { key: "portraitBlonde", image: sousaImages.portraitBlonde, ratio: "3 / 4", span: "md:col-span-4" },
    { key: "movementBlur", image: sousaImages.movementBlur, ratio: "16 / 9", span: "md:col-span-7" },
    { key: "textureDetail", image: sousaImages.textureDetail, ratio: "1 / 1", span: "md:col-span-5" },
    { key: "salonAtmosphere", image: sousaImages.salonAtmosphere, ratio: "16 / 9", span: "md:col-span-5" },
    { key: "toolsFlatlay", image: sousaImages.toolsFlatlay, ratio: "4 / 3", span: "md:col-span-7" },
  ] as const;

  return (
    <section className="section-y" style={{ background: "var(--surface)" }}>
      <div className="wrap flex flex-col gap-10 md:gap-14">
        <SectionHead eyebrow={c.eyebrow} title={c.title} intro={c.intro} />
        <div className="grid gap-4 md:grid-cols-12">
          {tiles.map((tile, i) => (
            <Reveal key={tile.key} delay={Math.min(i, 5)} className={tile.span}>
              <figure className="flex flex-col gap-2">
                <Img
                  image={tile.image}
                  lang={lang}
                  fallbackLang={lead.defaultLocale}
                  ratio={tile.ratio}
                  sizes="(max-width: 768px) 92vw, 45vw"
                />
                <figcaption className="text-xs uppercase tracking-[0.14em] muted">
                  {c.captions[tile.key]}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
