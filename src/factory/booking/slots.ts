import { addMinutes, toHHMM, toMinutes } from "../hours";
import type { BookingConfig, OpeningHours } from "../types";

export type BusyRange = { start: string; end: string }; // "HH:mm" local to the business

export type TimeSlot = { time: string; available: boolean };

export function todayISO(timezone: string, at: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(at);
}

export function addDaysISO(dateISO: string, days: number): string {
  const d = new Date(`${dateISO}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function weekdayOf(dateISO: string): number {
  return new Date(`${dateISO}T00:00:00Z`).getUTCDay();
}

export function isWithinHorizon(dateISO: string, config: BookingConfig, timezone: string, at = new Date()): boolean {
  const today = todayISO(timezone, at);
  return dateISO >= today && dateISO <= addDaysISO(today, config.horizonDays);
}

export function isOpenOn(dateISO: string, hours: OpeningHours): boolean {
  const ranges = hours.week[weekdayOf(dateISO)];
  return !!ranges && ranges.length > 0;
}

export function isDateBookable(dateISO: string, hours: OpeningHours, config: BookingConfig, at = new Date()): boolean {
  return isWithinHorizon(dateISO, config, hours.timezone, at) && isOpenOn(dateISO, hours);
}

function overlaps(startMin: number, endMin: number, busy: BusyRange[]): boolean {
  return busy.some((b) => startMin < toMinutes(b.end) && endMin > toMinutes(b.start));
}

/**
 * Every slot whose [start, start + duration + buffer] fits inside one opening
 * range, is far enough ahead of now, and does not collide with a busy range.
 *
 * Split shifts are handled per range, so a 90-minute treatment is never offered
 * at 13:30 when the business closes for lunch at 14:00.
 */
export function buildSlots(args: {
  dateISO: string;
  durationMin: number;
  hours: OpeningHours;
  config: BookingConfig;
  busy?: BusyRange[];
  now?: Date;
}): TimeSlot[] {
  const { dateISO, durationMin, hours, config, busy = [], now = new Date() } = args;
  const ranges = hours.week[weekdayOf(dateISO)];
  if (!ranges || ranges.length === 0) return [];

  const isToday = dateISO === todayISO(hours.timezone, now);
  const nowParts = new Intl.DateTimeFormat("en-GB", {
    timeZone: hours.timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const nowMin =
    (Number(nowParts.find((p) => p.type === "hour")?.value ?? 0) % 24) * 60 +
    Number(nowParts.find((p) => p.type === "minute")?.value ?? 0);
  const earliest = isToday ? nowMin + config.leadTimeMin : -1;

  const slots: TimeSlot[] = [];
  for (const range of ranges) {
    const open = toMinutes(range.open);
    const close = toMinutes(range.close);
    const lastStart = close - durationMin;
    for (let m = open; m <= lastStart; m += config.slotStepMin) {
      const end = m + durationMin + config.bufferMin;
      const available = m >= earliest && !overlaps(m, end, busy);
      slots.push({ time: toHHMM(m), available });
    }
  }
  return slots;
}

export function slotEnd(time: string, durationMin: number): string {
  return addMinutes(time, durationMin);
}

/**
 * Demo-mode busy ranges. Deterministic per date so the grid looks like a real
 * working diary instead of an empty one — clearly generated, never presented
 * as data read from anyone's calendar.
 */
export function demoBusyRanges(dateISO: string, hours: OpeningHours): BusyRange[] {
  const ranges = hours.week[weekdayOf(dateISO)];
  if (!ranges) return [];
  let seed = 0;
  for (let i = 0; i < dateISO.length; i++) seed = (seed * 31 + dateISO.charCodeAt(i)) >>> 0;

  const busy: BusyRange[] = [];
  for (const range of ranges) {
    const open = toMinutes(range.open);
    const close = toMinutes(range.close);
    const span = close - open;
    if (span < 90) continue;
    const blocks = 1 + (seed % 3);
    for (let i = 0; i < blocks; i++) {
      seed = (seed * 1103515245 + 12345) >>> 0;
      const startOffset = 30 * Math.floor((seed % Math.max(1, span - 60)) / 30);
      seed = (seed * 1103515245 + 12345) >>> 0;
      const length = [45, 60, 90, 120][seed % 4];
      const start = open + startOffset;
      const end = Math.min(close, start + length);
      if (end - start >= 30) busy.push({ start: toHHMM(start), end: toHHMM(end) });
    }
  }
  return busy;
}
