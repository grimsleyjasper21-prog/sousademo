import { localeTag } from "./locale";
import type { DayHours, Locale, OpeningHours } from "./types";

export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

export function dayName(dayIndex: number, lang: Locale): string {
  // 2024-01-07 was a Sunday, so +dayIndex lands on the right weekday.
  const d = new Date(Date.UTC(2024, 0, 7 + dayIndex));
  const label = d.toLocaleDateString(localeTag[lang], { weekday: "long", timeZone: "UTC" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function toHHMM(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function addMinutes(time: string, minutes: number): string {
  return toHHMM(toMinutes(time) + minutes);
}

const closedLabel: Record<Locale, string> = {
  es: "Cerrado",
  en: "Closed",
  de: "Geschlossen",
  ca: "Tancat",
};

export function formatDay(hours: DayHours, lang: Locale): string {
  if (!hours || hours.length === 0) return closedLabel[lang];
  return hours.map((r) => `${r.open} – ${r.close}`).join(" · ");
}

/** Groups consecutive days that share the same hours: "Lun – Vie 09:00 – 18:30". */
export function groupedWeek(
  hours: OpeningHours,
  lang: Locale
): { days: string; hours: string }[] {
  const rows: { days: number[]; label: string }[] = [];
  for (const day of WEEK_ORDER) {
    const label = formatDay(hours.week[day] ?? null, lang);
    const last = rows[rows.length - 1];
    if (last && last.label === label) last.days.push(day);
    else rows.push({ days: [day], label });
  }
  return rows.map((r) => ({
    days:
      r.days.length === 1
        ? dayName(r.days[0], lang)
        : `${dayName(r.days[0], lang)} – ${dayName(r.days[r.days.length - 1], lang)}`,
    hours: r.label,
  }));
}

/** Current local time in the business's timezone, as {day, minutes}. */
export function nowInTimezone(timezone: string, at: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hour12: false,
  }).formatToParts(at);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hour = Number(get("hour")) % 24;
  return {
    day: Math.max(0, weekdays.indexOf(get("weekday"))),
    minutes: hour * 60 + Number(get("minute")),
  };
}

export function isOpenNow(hours: OpeningHours, at: Date = new Date()): boolean {
  const { day, minutes } = nowInTimezone(hours.timezone, at);
  const ranges = hours.week[day];
  if (!ranges) return false;
  return ranges.some((r) => minutes >= toMinutes(r.open) && minutes < toMinutes(r.close));
}

/** schema.org openingHoursSpecification — only emitted when the hours are verified. */
export function hoursSchema(hours: OpeningHours) {
  if (!hours.verified) return undefined;
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const out: { "@type": string; dayOfWeek: string; opens: string; closes: string }[] = [];
  for (const day of WEEK_ORDER) {
    for (const range of hours.week[day] ?? []) {
      out.push({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: names[day],
        opens: range.open,
        closes: range.close,
      });
    }
  }
  return out.length ? out : undefined;
}
