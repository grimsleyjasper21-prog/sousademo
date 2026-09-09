"use client";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { campaignImages } from "@/lib/campaign-images";

export default function BrandStatement() {
  const { t, lang } = useI18n();
  const bg = campaignImages.brandBg;

  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 opacity-25">
        <Image src={bg.url} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--ink)", opacity: 0.55 }} />
      </div>
      <div className="container-editorial text-center max-w-4xl relative z-10">
        <p
          className="text-[7vw] md:text-[3.4vw] leading-[1.05] text-[var(--bone)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          &ldquo;{t("brandStatement.quote")}&rdquo;
        </p>
        {lang === "en" && (
          <p className="mt-6 text-sm italic text-[var(--bone-faint)]">{t("brandStatement.original")}</p>
        )}
      </div>
    </section>
  );
}
