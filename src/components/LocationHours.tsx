"use client";
import { useI18n } from "@/lib/i18n";
import { SALON, openingHours } from "@/lib/services-data";
import { useWhatsAppMessage } from "@/lib/whatsapp";

const DAY_ORDER: { idx: number; key: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun" }[] = [
  { idx: 1, key: "mon" },
  { idx: 2, key: "tue" },
  { idx: 3, key: "wed" },
  { idx: 4, key: "thu" },
  { idx: 5, key: "fri" },
  { idx: 6, key: "sat" },
  { idx: 0, key: "sun" },
];

export default function LocationHours() {
  const { t } = useI18n();
  const waLink = useWhatsAppMessage();
  const addressQuery = encodeURIComponent(SALON.address);

  return (
    <section id="location" className="py-24 md:py-32 border-t hairline">
      <div className="container-editorial">
        <p className="eyebrow mb-3">{t("location.eyebrow")}</p>
        <h2 className="text-4xl md:text-6xl mb-12">{t("location.title")}</h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--bone-faint)] mb-2">
                {t("location.addressLabel")}
              </p>
              <p className="text-lg">{SALON.address}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--bone-faint)] mb-2">
                {t("location.hoursLabel")}
              </p>
              <table className="w-full text-sm">
                <tbody>
                  {DAY_ORDER.map(({ idx, key }) => {
                    const hours = openingHours[idx];
                    return (
                      <tr key={key} className="border-b" style={{ borderColor: "var(--hairline)" }}>
                        <td className="py-2 pr-4">{t(`location.days.${key}`)}</td>
                        <td className="py-2 text-right tabular text-[var(--bone-dim)]">
                          {hours ? `${hours.open}–${hours.close}` : t("location.closed")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--bone-faint)] mb-2">
                {t("location.phoneLabel")}
              </p>
              <p className="text-lg tabular">{SALON.phoneDisplay}</p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <a href={`tel:+${SALON.phoneE164}`} className="btn btn-primary">
                {t("location.call")}
              </a>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                {t("location.whatsapp")}
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${addressQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                {t("location.directions")}
              </a>
              <a href={SALON.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                {t("location.instagram")}
              </a>
            </div>
          </div>

          <div>
            <svg viewBox="0 0 400 320" className="w-full rounded-sm" role="img" aria-label={t("location.mapCaption")}>
              <rect width="400" height="320" fill="#16130f" />
              <path d="M0 210 Q100 170 200 205 T400 185 V320 H0 Z" fill="#1e1a15" />
              <g stroke="var(--hairline-strong)" strokeWidth="1">
                <line x1="0" y1="70" x2="400" y2="70" />
                <line x1="0" y1="140" x2="400" y2="140" />
                <line x1="130" y1="0" x2="130" y2="320" />
                <line x1="280" y1="0" x2="280" y2="320" />
              </g>
              <circle cx="205" cy="150" r="9" fill="var(--copper-bright)" />
              <path d="M205 150 v-26" stroke="var(--copper-bright)" strokeWidth="3" />
              <circle cx="205" cy="150" r="16" fill="none" stroke="var(--copper-bright)" strokeOpacity="0.4" />
            </svg>
            <p className="mt-3 text-xs text-[var(--bone-faint)] text-center">{t("location.mapCaption")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
