"use client";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { campaignImages, type CampaignImage } from "@/lib/campaign-images";

type Tile = { img: CampaignImage; captionKey: string; span: string };

export default function Transformation() {
  const { t } = useI18n();

  const tiles: Tile[] = [
    { img: campaignImages.portraitBrunette, captionKey: "portraitBrunette", span: "row-span-2" },
    { img: campaignImages.textureDetail, captionKey: "textureDetail", span: "" },
    { img: campaignImages.portraitCopper, captionKey: "portraitCopper", span: "row-span-2" },
    { img: campaignImages.salonAtmosphere, captionKey: "salonAtmosphere", span: "col-span-2" },
    { img: campaignImages.portraitBlonde, captionKey: "portraitBlonde", span: "row-span-2" },
    { img: campaignImages.movementBlur, captionKey: "movementBlur", span: "" },
  ];

  return (
    <section className="py-24 md:py-32 border-t hairline">
      <div className="container-editorial">
        <p className="eyebrow mb-3">{t("transformation.eyebrow")}</p>
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-10">
          <h2 className="text-4xl md:text-6xl">{t("transformation.title")}</h2>
          <p className="max-w-xs text-sm">{t("transformation.subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[160px] md:auto-rows-[200px] gap-3">
          {tiles.map((tile, i) => (
            <figure key={i} className={`relative rounded-sm overflow-hidden group ${tile.span}`}>
              <Image
                src={tile.img.url}
                alt={tile.img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(10,9,8,0.75), transparent 55%)" }}
              />
              <figcaption className="absolute bottom-3 left-3 text-xs uppercase tracking-[0.1em] text-[var(--bone)]">
                {t(`transformation.captions.${tile.captionKey}`)}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
