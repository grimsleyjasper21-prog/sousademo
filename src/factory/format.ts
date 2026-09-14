import { localeTag } from "./locale";
import type { UiStrings } from "./i18n/strings";
import type { Locale, Price, Service } from "./types";

export function formatMoney(amount: number, lang: Locale, currency = "EUR"): string {
  const whole = Number.isInteger(amount);
  return new Intl.NumberFormat(localeTag[lang], {
    style: "currency",
    currency,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(amount);
}

/** Returns null when the lead publishes no price for this service — never a guess. */
export function formatPrice(price: Price | undefined, lang: Locale, strings: UiStrings): string | null {
  if (!price) return null;
  if (price.qualifier === "consult") return strings.common.consult;
  const money = formatMoney(price.amount, lang, price.currency ?? "EUR");
  return price.qualifier === "from" ? `${strings.common.from} ${money}` : money;
}

export function formatDuration(minutes: number, lang: Locale, strings: UiStrings): string {
  if (minutes < 60) return `${minutes} ${strings.common.minutes}`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hourLabel = lang === "de" ? "Std." : "h";
  return m === 0 ? `${h} ${hourLabel}` : `${h} ${hourLabel} ${m} ${strings.common.minutes}`;
}

export function formatDateLong(dateISO: string, lang: Locale): string {
  const d = new Date(`${dateISO}T00:00:00`);
  return d.toLocaleDateString(localeTag[lang], { weekday: "long", day: "numeric", month: "long" });
}

export function formatDateShort(dateISO: string, lang: Locale): string {
  const d = new Date(`${dateISO}T00:00:00`);
  return d.toLocaleDateString(localeTag[lang], { day: "numeric", month: "short" });
}

export function weekdayShort(dateISO: string, lang: Locale): string {
  const d = new Date(`${dateISO}T00:00:00`);
  return d.toLocaleDateString(localeTag[lang], { weekday: "short" }).replace(".", "");
}

export function servicesInCategory(services: Service[], categoryId: string): Service[] {
  return services.filter((s) => s.categoryId === categoryId);
}

export function findService(services: Service[], id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

/** Related services: same category first, then the featured ones, never the service itself. */
export function relatedServices(services: Service[], service: Service, limit = 3): Service[] {
  const sameCategory = services.filter((s) => s.id !== service.id && s.categoryId === service.categoryId);
  const others = services.filter((s) => s.id !== service.id && s.categoryId !== service.categoryId && s.featured);
  return [...sameCategory, ...others].slice(0, limit);
}
