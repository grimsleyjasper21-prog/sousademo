"use client";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { campaignImages } from "@/lib/campaign-images";

export default function Hero() {
  const { t } = useI18n();
  const img = campaignImages.heroBg;

  return (
    <section id="home" className="relative min-h-[92vh] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={img.url}
          alt={img.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,9,8,0.35) 0%, rgba(10,9,8,0.55) 55%, rgba(10,9,8,0.95) 100%)",
          }}
        />
      </div>

      <div className="container-editorial relative z-10 pb-16 pt-40 w-full">
        <p className="eyebrow mb-6">{t("hero.eyebrow")}</p>
        <h1
          className="text-[13vw] md:text-[7.5vw] leading-[0.95] text-[var(--bone)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t("hero.headline1")}
          <br />
          {t("hero.headline2")}
        </h1>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a href="#booking" className="btn btn-primary">
            {t("hero.cta")}
          </a>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--bone-dim)]">
            <li>{t("hero.badgeLocation")}</li>
            <li className="opacity-40">·</li>
            <li>{t("hero.badgeService")}</li>
            <li className="opacity-40">·</li>
            <li>{t("hero.badgeRating")}</li>
          </ul>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-10 hidden md:flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--bone-faint)]">
        <span className="block w-px h-8 bg-[var(--hairline-strong)]" />
        {t("hero.scroll")}
      </div>
    </section>
  );
}
