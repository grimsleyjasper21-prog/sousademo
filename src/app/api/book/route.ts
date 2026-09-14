import { NextResponse } from "next/server";
import { leadBySlug } from "@/leads/registry";
import { createEvent, fetchBusy } from "@/factory/booking/calendar";
import { buildSlots, demoBusyRanges, isDateBookable } from "@/factory/booking/slots";
import { findService } from "@/factory/format";
import { text } from "@/factory/locale";
import type { Locale } from "@/factory/types";

export const dynamic = "force-dynamic";

type Body = {
  lead?: string;
  serviceId?: string;
  date?: string;
  time?: string;
  name?: string;
  surname?: string;
  phone?: string;
  email?: string;
  notes?: string;
  lang?: string;
};

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

/** POST /api/book — validates, re-checks the slot, then writes the calendar event. */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "BAD_REQUEST" }, { status: 400 });
  }

  const lead = leadBySlug(clean(body.lead, 64));
  if (!lead || !lead.booking.enabled) {
    return NextResponse.json({ ok: false, error: "UNKNOWN_LEAD" }, { status: 404 });
  }

  const service = findService(lead.catalogue.services, clean(body.serviceId, 64));
  if (!service || service.bookable === false) {
    return NextResponse.json({ ok: false, error: "UNKNOWN_SERVICE" }, { status: 400 });
  }

  const dateISO = clean(body.date, 10);
  const time = clean(body.time, 5);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateISO) || !/^\d{2}:\d{2}$/.test(time)) {
    return NextResponse.json({ ok: false, error: "BAD_SLOT" }, { status: 400 });
  }
  if (!isDateBookable(dateISO, lead.hours, lead.booking)) {
    return NextResponse.json({ ok: false, error: "BAD_SLOT" }, { status: 400 });
  }

  const name = clean(body.name, 60);
  const surname = clean(body.surname, 60);
  const phone = clean(body.phone, 30);
  const email = clean(body.email, 120);
  if (name.length < 2) return NextResponse.json({ ok: false, error: "BAD_NAME" }, { status: 400 });
  if (phone.replace(/\D/g, "").length < 6) {
    return NextResponse.json({ ok: false, error: "BAD_PHONE" }, { status: 400 });
  }
  if (lead.booking.requireEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "BAD_EMAIL" }, { status: 400 });
  }
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "BAD_EMAIL" }, { status: 400 });
  }

  // Re-check the slot at write time: the customer may have been sitting on the
  // form while someone else took it.
  const { busy } =
    lead.booking.mode === "apps-script"
      ? await fetchBusy(lead, dateISO)
      : { busy: demoBusyRanges(dateISO, lead.hours) };
  const slot = buildSlots({
    dateISO,
    durationMin: service.durationMin,
    hours: lead.hours,
    config: lead.booking,
    busy,
  }).find((s) => s.time === time);

  if (!slot) return NextResponse.json({ ok: false, error: "BAD_SLOT" }, { status: 400 });
  if (!slot.available) return NextResponse.json({ ok: false, error: "SLOT_TAKEN" }, { status: 409 });

  const lang = (lead.locales.includes(body.lang as Locale) ? body.lang : lead.defaultLocale) as Locale;
  const category = lead.catalogue.categories.find((c) => c.id === service.categoryId);

  const result = await createEvent(lead, {
    service,
    serviceName: text(service.name, lang, lead.defaultLocale),
    categoryName: text(category?.name, lang, lead.defaultLocale),
    dateISO,
    startTime: time,
    name,
    surname,
    phone,
    email,
    notes: clean(body.notes, 500),
    lang,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true, reference: result.reference });
}
