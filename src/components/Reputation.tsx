"use client";
import { useI18n } from "@/lib/i18n";
import { SALON } from "@/lib/services-data";

export default function Reputation() {
  const { t } = useI18n();
  const mapsQuery = encodeURIComponent(`${SALON.name} ${SALON.address}`);

  return (
    <section className="py-24 border-t hairline">
      <div className="container-editorial flex flex-col items-center text-center">
        <p className="eyebrow mb-3">{t("reputation.eyebrow")}</p>
        <div className="flex items-center gap-1 mb-4" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} filled={i < Math.round(SALON.rating)} />
          ))}
        </div>
        <h2 className="text-5xl md:text-7xl mb-3">{t("reputation.title")}</h2>
        <p className="mb-2">{t("reputation.subtitle")}</p>
        <p className="text-sm text-[var(--bone-faint)] mb-8 tabular">
          +{SALON.reviewCount} {t("reputation.reviews")}
        </p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          {t("reputation.cta")}
        </a>
      </div>
    </section>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "var(--copper-bright)" : "none"} stroke="var(--copper-bright)">
      <path
        d="M12 2.5l2.9 6.4 7 .7-5.3 4.7 1.6 6.9L12 17.6l-6.2 3.6 1.6-6.9L2.1 9.6l7-.7L12 2.5z"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
