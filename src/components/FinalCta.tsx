"use client";
import { useI18n } from "@/lib/i18n";
import { useWhatsAppMessage } from "@/lib/whatsapp";

export default function FinalCta() {
  const { t } = useI18n();
  const waLink = useWhatsAppMessage();

  return (
    <section className="py-28 md:py-40 border-t hairline">
      <div className="container-editorial text-center">
        <h2 className="text-[11vw] md:text-[6vw] leading-[0.98] mb-8">{t("finalCta.title")}</h2>
        <p className="mb-8">{t("finalCta.subtitle")}</p>
        <a href="#booking" className="btn btn-primary text-base px-10 py-4">
          {t("finalCta.cta")}
        </a>
        <p className="mt-6">
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-sm underline text-[var(--bone-faint)]">
            {t("finalCta.whatsapp")}
          </a>
        </p>
      </div>
    </section>
  );
}
