"use client";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { usePwa } from "@/lib/pwa";

export default function AppPage() {
  const { t } = useI18n();
  const { canInstall, isIos, isStandalone, install } = usePwa();

  return (
    <div className="container-editorial py-32 md:py-40 flex flex-col items-center text-center min-h-[70vh]">
      <div className="w-24 h-24 rounded-2xl overflow-hidden mb-8 shadow-2xl">
        <Image src="/icons/icon-512.png" alt="SOUSA" width={96} height={96} />
      </div>
      <h1 className="text-4xl md:text-6xl mb-4">{t("appPage.title")}</h1>
      <p className="max-w-md mb-10">{t("appPage.subtitle")}</p>

      {isStandalone ? (
        <Link href="/#booking" className="btn btn-primary">
          {t("nav.cta")}
        </Link>
      ) : canInstall ? (
        <button onClick={install} className="btn btn-primary">
          {t("appPage.install")}
        </button>
      ) : isIos ? (
        <div className="border hairline rounded-sm p-6 max-w-sm text-left" style={{ background: "var(--surface)" }}>
          <p className="text-sm uppercase tracking-[0.1em] mb-4">{t("appPage.iosTitle")}</p>
          <ol className="space-y-2 text-sm list-decimal list-inside text-[var(--bone-dim)]">
            <li>{t("appPage.iosStep1")}</li>
            <li>{t("appPage.iosStep2")}</li>
            <li>{t("appPage.iosStep3")}</li>
          </ol>
        </div>
      ) : (
        <p className="text-sm text-[var(--bone-faint)] max-w-sm">{t("appPage.androidNote")}</p>
      )}

      <p className="mt-10 text-xs text-[var(--bone-faint)] max-w-sm">{t("appPage.disclaimer")}</p>

      <Link href="/" className="mt-8 text-sm underline text-[var(--bone-faint)]">
        {t("appPage.back")}
      </Link>
    </div>
  );
}
