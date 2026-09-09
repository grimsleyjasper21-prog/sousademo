// SOUSA — The Hair Expert. Booking submission to the GRIMHART Google Apps
// Script demo endpoint, which creates a real event on a Google Calendar.
// This is intentionally the SAME reused GRIMHART demo integration —
// see the brief: website -> Google Apps Script -> Google Calendar.
import { categoryLabel, serviceName, type Service } from "./services-data";

const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbz75pRcZqQpXrQ_OUHiJrOOUneEhQBffVubTln7PSOedfb0T0FgRD2zJiNM34lyuA_y/exec";
const DEMO_TOKEN = "foryou-grimhart-demo-2026";
const TIMEZONE = "Europe/Madrid";

export type BookingDetails = {
  service: Service;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  name: string;
  surname: string;
  phone: string;
  email: string;
  notes: string;
  lang: "es" | "en";
};

function addMinutes(date: string, time: string, minutes: number) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(`${date}T00:00:00`);
  d.setHours(h, m + minutes, 0, 0);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function buildBookingPayload(b: BookingDetails) {
  const fullName = `${b.name} ${b.surname}`.trim();
  const svcName = serviceName(b.service, b.lang);
  const catName = categoryLabel(b.service.category, b.lang);
  const endTime = addMinutes(b.date, b.startTime, b.service.durationMin);
  const title = `[SOUSA DEMO] ${svcName} — ${fullName}`;

  const description = [
    "SOUSA — THE HAIR EXPERT DEMO",
    `Servicio / Service: ${svcName}`,
    `Categoría / Category: ${catName}`,
    `Duración / Duration: ${b.service.durationMin} min`,
    `Precio demo / Demo price: €${b.service.priceEUR}`,
    `Fecha / Date: ${b.date}`,
    `Hora inicio / Start time: ${b.startTime}`,
    `Hora fin / End time: ${endTime}`,
    `Cliente / Customer: ${fullName}`,
    `Teléfono / Phone: ${b.phone}`,
    `Email: ${b.email}`,
    `Notas / Notes: ${b.notes || "—"}`,
    "",
    "Reserva creada desde la demostración digital GRIMHART para SOUSA.",
  ].join("\n");

  return {
    // Confirmed required by the endpoint (it rejected a request missing this
    // exact snake_case key), so the whole payload follows that convention.
    token: DEMO_TOKEN,
    source: "sousa-demo",
    title,
    description,
    summary: title,
    date: b.date,
    start_time: b.startTime,
    end_time: endTime,
    start: `${b.date}T${b.startTime}:00`,
    end: `${b.date}T${endTime}:00`,
    time_zone: TIMEZONE,
    service: svcName,
    service_name: svcName,
    category: catName,
    duration_min: b.service.durationMin,
    price_eur: b.service.priceEUR,
    customer_name: fullName,
    customer_first_name: b.name,
    customer_last_name: b.surname,
    customer_phone: b.phone,
    customer_email: b.email,
    customer_notes: b.notes,
    // Kept alongside for compatibility in case other fields are read camelCase.
    startTime: b.startTime,
    endTime,
    timeZone: TIMEZONE,
    durationMin: b.service.durationMin,
    priceEUR: b.service.priceEUR,
    customerName: fullName,
    firstName: b.name,
    lastName: b.surname,
    phone: b.phone,
    email: b.email,
    notes: b.notes,
  };
}

export type SubmitResult =
  | { ok: true; reference: string }
  | { ok: false; error: string };

export async function submitBooking(b: BookingDetails): Promise<SubmitResult> {
  const payload = buildBookingPayload(b);
  const reference = `SOUSA-${Date.now().toString(36).toUpperCase()}`;

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      // text/plain avoids a CORS preflight against the Apps Script /exec endpoint.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return { ok: false, error: `HTTP_${res.status}` };
    }

    let parsed: unknown = null;
    const text = await res.text();
    try {
      parsed = JSON.parse(text);
    } catch {
      // Non-JSON 200 response (e.g. plain "OK") — still treated as success below.
    }

    if (
      parsed &&
      typeof parsed === "object" &&
      (("status" in parsed && (parsed as { status?: string }).status === "error") ||
        ("success" in parsed && (parsed as { success?: boolean }).success === false) ||
        ("ok" in parsed && (parsed as { ok?: boolean }).ok === false))
    ) {
      const message =
        (parsed as { message?: string; error?: string }).message ||
        (parsed as { message?: string; error?: string }).error ||
        "SCRIPT_ERROR";
      return { ok: false, error: message };
    }

    return { ok: true, reference };
  } catch {
    return { ok: false, error: "NETWORK_ERROR" };
  }
}
