"use client";
import { useI18n } from "@/lib/i18n";
import { SALON } from "@/lib/services-data";

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t hairline mt-24">
      <div className="container-editorial py-14 flex flex-col md:flex-row md:justify-between gap-8">
        <div>
          <p style={{ fontFamily: "var(--font-display)" }} className="text-2xl mb-2">
            {SALON.name}
          </p>
          <p className="max-w-xs text-sm">{t("footer.tagline")}</p>
        </div>
        <div className="text-sm text-[var(--bone-faint)] md:text-right space-y-1">
          <p>
            &copy; {year} SOUSA. {t("footer.rights")}
          </p>
          <p>{t("footer.demo")}</p>
          <a href={SALON.instagramUrl} target="_blank" rel="noopener noreferrer" className="underline">
            {t("footer.instagram")} · {SALON.instagram}
          </a>
        </div>
      </div>
    </footer>
  );
}
