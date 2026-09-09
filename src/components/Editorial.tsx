"use client";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { campaignImages } from "@/lib/campaign-images";

export default function Editorial() {
  const { t } = useI18n();
  const scissors = campaignImages.scissorsCutting;
  const flatlay = campaignImages.toolsFlatlay;

  return (
    <section className="py-24 md:py-32">
      <div className="container-editorial">
        <p className="eyebrow mb-3">{t("editorial.eyebrow")}</p>
        <h2 className="text-4xl md:text-6xl mb-16 md:mb-24 max-w-2xl">{t("editorial.title")}</h2>

        <div className="grid md:grid-cols-2 gap-16 md:gap-10">
          <div className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-start">
            <div className="relative w-full md:w-40 aspect-[4/3] md:aspect-[3/4] rounded-sm overflow-hidden order-2 md:order-1">
              <Image src={scissors.url} alt={scissors.alt} fill sizes="30vw" className="object-cover" />
            </div>
            <div className="order-1 md:order-2">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--copper-bright)] mb-2">
                {t("editorial.chapter1Label")}
              </p>
              <h3 className="text-3xl md:text-4xl mb-4">{t("editorial.chapter1Title")}</h3>
              <p className="max-w-sm">{t("editorial.chapter1Body")}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-start">
            <div className="relative w-full md:w-40 aspect-[4/3] md:aspect-[3/4] rounded-sm overflow-hidden order-2 md:order-1">
              <Image src={flatlay.url} alt={flatlay.alt} fill sizes="30vw" className="object-cover" />
            </div>
            <div className="order-1 md:order-2">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--copper-bright)] mb-2">
                {t("editorial.chapter2Label")}
              </p>
              <h3 className="text-3xl md:text-4xl mb-4">{t("editorial.chapter2Title")}</h3>
              <p className="max-w-sm">{t("editorial.chapter2Body")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
