// SOUSA — The Hair Expert. Demo availability generation.
// This is illustrative front-end availability only — NOT a two-way sync with
// a real calendar. Booking a slot here only creates a Google Calendar event
// via the Apps Script endpoint (see calendar.ts); it does not remove that
// slot from anyone else's view.
import { openingHours } from "./services-data";

const HORIZON_DAYS = 90;
const SLOT_STEP_MIN = 15;

export function todayISO(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
function toHHMM(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function isWithinHorizon(dateStr: string): boolean {
  const today = todayISO();
  const max = new Date(today + "T00:00:00");
  max.setDate(max.getDate() + HORIZON_DAYS);
  return dateStr >= today && dateStr <= max.toISOString().slice(0, 10);
}

export function isSalonOpen(dateStr: string): boolean {
  const day = new Date(dateStr + "T00:00:00").getDay();
  return openingHours[day] !== null;
}

export function isDateBookable(dateStr: string): boolean {
  return isWithinHorizon(dateStr) && isSalonOpen(dateStr);
}

function hashStr(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Deterministic cosmetic "already booked" slots — demo realism only. */
function isSeedBusy(dateStr: string, time: string): boolean {
  return hashStr(dateStr + time) % 4 === 0; // ~25% pre-filled
}

export type TimeSlot = { time: string; available: boolean };

/** Generates slots whose [start, start+duration] fits fully within opening hours. */
export function getTimeSlots(dateStr: string, durationMin: number): TimeSlot[] {
  const day = new Date(dateStr + "T00:00:00").getDay();
  const hours = openingHours[day];
  if (!hours) return [];

  const openMin = toMinutes(hours.open);
  const closeMin = toMinutes(hours.close);
  const lastStart = closeMin - durationMin;
  if (lastStart < openMin) return [];

  const now = new Date();
  const isToday = dateStr === todayISO();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const slots: TimeSlot[] = [];
  for (let m = openMin; m <= lastStart; m += SLOT_STEP_MIN) {
    const time = toHHMM(m);
    const past = isToday && m <= nowMin;
    const busy = isSeedBusy(dateStr, time);
    slots.push({ time, available: !past && !busy });
  }
  return slots;
}

export function formatDateHuman(dateStr: string, lang: "es" | "en"): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(lang === "en" ? "en-GB" : "es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
