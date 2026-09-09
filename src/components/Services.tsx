"use client";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { categories, services, categoryLabel, serviceName, type CategoryId } from "@/lib/services-data";
import { useBookingSelection } from "@/lib/booking-selection";

export default function Services() {
  const { t, lang } = useI18n();
  const { select } = useBookingSelection();
  const [active, setActive] = useState<CategoryId>("corte");

  const filtered = services.filter((s) => s.category === active);

  const goBook = (categoryId: CategoryId, serviceId: string) => {
    select(categoryId, serviceId);
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="services" className="py-24 md:py-32 border-t hairline">
      <div className="container-editorial">
        <p className="eyebrow mb-3">{t("services.eyebrow")}</p>
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-10">
          <h2 className="text-4xl md:text-6xl">{t("services.title")}</h2>
          <p className="max-w-xs text-sm">{t("services.subtitle")}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className="text-sm uppercase tracking-[0.1em] px-4 py-2 rounded-sm border transition-colors"
              style={{
                borderColor: active === c.id ? "var(--bone)" : "var(--hairline-strong)",
                color: active === c.id ? "var(--ink)" : "var(--bone-dim)",
                background: active === c.id ? "var(--bone)" : "transparent",
              }}
            >
              {categoryLabel(c.id, lang)}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "var(--hairline)" }}>
          {filtered.map((s) => (
            <article key={s.id} className="p-6 flex flex-col gap-4" style={{ background: "var(--ink)" }}>
              <h3 className="text-2xl" style={{ fontFamily: "var(--font-display)" }}>
                {serviceName(s, lang)}
              </h3>
              <div className="flex items-baseline justify-between text-sm text-[var(--bone-dim)] tabular">
                <span>
                  {s.durationMin} {t("services.min")}
                </span>
                <span className="text-lg text-[var(--bone)]">
                  {t("services.from")} €{s.priceEUR}
                </span>
              </div>
              <button
                onClick={() => goBook(s.category, s.id)}
                className="btn btn-outline mt-auto self-start"
              >
                {t("services.book")}
              </button>
            </article>
          ))}
        </div>

        <p className="mt-8 text-xs text-[var(--bone-faint)] max-w-2xl">{t("services.disclaimer")}</p>
      </div>
    </section>
  );
}
