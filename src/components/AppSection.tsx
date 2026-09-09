"use client";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { usePwa } from "@/lib/pwa";

export default function AppSection() {
  const { t } = useI18n();
  const { canInstall, isIos, isStandalone, install } = usePwa();

  const steps = [t("app.step1"), t("app.step2"), t("app.step3"), t("app.step4")];

  return (
    <section id="app" className="py-24 md:py-32 border-t hairline overflow-hidden">
      <div className="container-editorial grid md:grid-cols-[1fr_360px] gap-16 items-center">
        <div>
          <p className="eyebrow mb-3">{t("app.eyebrow")}</p>
          <h2 className="text-4xl md:text-6xl mb-8 leading-[0.98]">
            {t("app.title")}
            <br />
            {t("app.titleLine2")}
          </h2>
          <p className="max-w-md mb-10">{t("app.subtitle")}</p>

          <ol className="space-y-5 mb-10 max-w-md">
            {steps.map((s, i) => (
              <li key={i} className="flex items-start gap-4">
                <span
                  className="tabular flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center text-sm"
                  style={{ borderColor: "var(--hairline-strong)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="pt-1">{s}</span>
              </li>
            ))}
          </ol>

          {!isStandalone && (
            <div className="flex flex-wrap items-center gap-4">
              {canInstall ? (
                <button onClick={install} className="btn btn-primary">
                  {t("app.install")}
                </button>
              ) : (
                <a href="/app" className="btn btn-primary">
                  {t("app.install")}
                </a>
              )}
              {isIos && (
                <p className="text-xs text-[var(--bone-faint)]">
                  {t("app.iosStep1")} → {t("app.iosStep2")} → {t("app.iosStep3")}
                </p>
              )}
            </div>
          )}

          <p className="mt-8 text-xs text-[var(--bone-faint)] max-w-md">{t("app.nfcNote")}</p>
        </div>

        <div className="relative mx-auto">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div
      className="relative w-[220px] h-[440px] rounded-[2.2rem] border-4 p-2"
      style={{ borderColor: "#2a2520", background: "#000" }}
    >
      <div
        className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full z-10"
        style={{ background: "#000" }}
      />
      <div
        className="w-full h-full rounded-[1.7rem] p-4 pt-8"
        style={{ background: "linear-gradient(180deg, #1c1712, #0a0908)" }}
      >
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="w-9 h-9 rounded-xl" style={{ background: "rgba(243,236,223,0.08)" }} />
          ))}
          <div className="w-9 h-9 rounded-xl overflow-hidden ring-2" style={{ boxShadow: "0 0 0 2px var(--copper-bright)" }}>
            <Image src="/icons/icon-192.png" alt="SOUSA" width={36} height={36} />
          </div>
        </div>
        <p className="text-center text-[9px] mt-1.5 tracking-wide" style={{ color: "var(--bone-faint)" }}>
          SOUSA
        </p>
      </div>
    </div>
  );
}
