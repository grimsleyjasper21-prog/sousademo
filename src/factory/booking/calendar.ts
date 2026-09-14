/**
 * Server-side Google Calendar adapter.
 *
 * Shape:  browser → /api/availability | /api/book → this adapter → Apps Script → Google Calendar
 *
 * The Apps Script leg is the integration GRIMHART already had working; what is
 * new is that the browser no longer talks to it directly, so the endpoint and
 * token stay out of the client bundle. Deploying one script per client (see
 * google-apps-script/README.md) is still what decides whose calendar an event
 * lands on — switching a demo to a paying client is configuration, not a rebuild.
 *
 * NEVER import this module from a Client Component.
 */
import { slotEnd } from "./slots";
import type { BusyRange } from "./slots";
import type { Lead, Locale, Service } from "../types";

/** Shared GRIMHART demo endpoint: sales bookings land on the GRIMHART demo calendar, never a prospect's. */
const DEMO_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbz75pRcZqQpXrQ_OUHiJrOOUneEhQBffVubTln7PSOedfb0T0FgRD2zJiNM34lyuA_y/exec";
const DEMO_TOKEN = "foryou-grimhart-demo-2026";

function envKey(ref: string, name: string): string {
  return `${name}_${ref.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`;
}

export function calendarConfig(lead: Lead): { endpoint: string; token: string; isClientCalendar: boolean } {
  const ref = lead.booking.calendarRef;
  const endpoint =
    process.env[envKey(ref, "CALENDAR_ENDPOINT_URL")] || process.env.CALENDAR_ENDPOINT_URL || DEMO_ENDPOINT;
  const token = process.env[envKey(ref, "CALENDAR_TOKEN")] || process.env.CALENDAR_TOKEN || DEMO_TOKEN;
  return { endpoint, token, isClientCalendar: endpoint !== DEMO_ENDPOINT };
}

export type BookingRequest = {
  service: Service;
  serviceName: string;
  categoryName: string;
  dateISO: string;
  startTime: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  notes: string;
  lang: Locale;
};

export function buildPayload(lead: Lead, b: BookingRequest, token: string) {
  const fullName = `${b.name} ${b.surname}`.trim();
  const endTime = slotEnd(b.startTime, b.service.durationMin);
  const title = `${lead.booking.eventPrefix} ${b.serviceName} — ${fullName}`.trim();

  const price = b.service.price ? `€${b.service.price.amount}` : "—";
  const description = [
    `${lead.business.name}`,
    `Servicio / Service: ${b.serviceName}`,
    `Categoría / Category: ${b.categoryName}`,
    `Duración / Duration: ${b.service.durationMin} min`,
    `Precio / Price: ${price}`,
    `Fecha / Date: ${b.dateISO}`,
    `Hora / Time: ${b.startTime} – ${endTime}`,
    `Cliente / Customer: ${fullName}`,
    `Teléfono / Phone: ${b.phone}`,
    `Email: ${b.email || "—"}`,
    `Notas / Notes: ${b.notes || "—"}`,
    "",
    `Lead: ${lead.slug}`,
  ].join("\n");

  // Field naming matches the deployed Apps Script contract (snake_case), with
  // camelCase aliases kept alongside so older script copies keep working.
  return {
    token,
    source: `${lead.slug}-demo`,
    lead: lead.slug,
    title,
    summary: title,
    description,
    date: b.dateISO,
    start_time: b.startTime,
    end_time: endTime,
    start: `${b.dateISO}T${b.startTime}:00`,
    end: `${b.dateISO}T${endTime}:00`,
    time_zone: lead.hours.timezone,
    service: b.serviceName,
    service_name: b.serviceName,
    category: b.categoryName,
    duration_min: b.service.durationMin,
    price_eur: b.service.price?.amount ?? null,
    customer_name: fullName,
    customer_first_name: b.name,
    customer_last_name: b.surname,
    customer_phone: b.phone,
    customer_email: b.email,
    customer_notes: b.notes,
    startTime: b.startTime,
    endTime,
    timeZone: lead.hours.timezone,
    durationMin: b.service.durationMin,
    customerName: fullName,
    firstName: b.name,
    lastName: b.surname,
    phone: b.phone,
    email: b.email,
    notes: b.notes,
  };
}

export type CreateResult = { ok: true; reference: string } | { ok: false; error: string };

export async function createEvent(lead: Lead, booking: BookingRequest): Promise<CreateResult> {
  const { endpoint, token } = calendarConfig(lead);
  const reference = `${lead.slug.slice(0, 6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      // text/plain keeps Apps Script's /exec endpoint from rejecting a CORS preflight.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(buildPayload(lead, booking, token)),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) return { ok: false, error: `HTTP_${res.status}` };

    const raw = await res.text();
    let parsed: Record<string, unknown> | null = null;
    try {
      parsed = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      // A plain-text 200 from an older script deploy still means the event was created.
    }

    if (parsed) {
      const failed =
        parsed.status === "error" || parsed.success === false || parsed.ok === false;
      if (failed) {
        const message = (parsed.message || parsed.error || "SCRIPT_ERROR") as string;
        return { ok: false, error: String(message) };
      }
    }

    return { ok: true, reference };
  } catch {
    return { ok: false, error: "NETWORK_ERROR" };
  }
}

export type BusyResult = {
  busy: BusyRange[];
  /** `calendar` = read from the connected calendar. `schedule` = generated from opening hours. */
  source: "calendar" | "schedule";
};

/**
 * Asks the lead's script for the day's busy ranges. A script copy that predates
 * the `busy` action simply answers without one, and the caller falls back to
 * opening-hours availability rather than inventing a calendar read.
 */
export async function fetchBusy(lead: Lead, dateISO: string): Promise<BusyResult> {
  if (lead.booking.mode !== "apps-script") return { busy: [], source: "schedule" };
  const { endpoint, token } = calendarConfig(lead);
  const url = `${endpoint}?action=busy&date=${encodeURIComponent(dateISO)}&token=${encodeURIComponent(token)}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return { busy: [], source: "schedule" };
    const parsed = (await res.json()) as { busy?: { start?: string; end?: string }[] };
    if (!Array.isArray(parsed.busy)) return { busy: [], source: "schedule" };
    const busy = parsed.busy
      .filter((r): r is BusyRange => typeof r.start === "string" && typeof r.end === "string")
      .map((r) => ({ start: r.start.slice(0, 5), end: r.end.slice(0, 5) }));
    return { busy, source: "calendar" };
  } catch {
    return { busy: [], source: "schedule" };
  }
}
