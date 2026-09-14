import { NextResponse } from "next/server";
import { leadBySlug } from "@/leads/registry";
import { fetchBusy } from "@/factory/booking/calendar";
import { buildSlots, demoBusyRanges, isDateBookable, isOpenOn } from "@/factory/booking/slots";
import { findService } from "@/factory/format";

export const dynamic = "force-dynamic";

/** GET /api/availability?lead=sousa&date=2026-04-20&service=corte-mujer */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("lead") ?? "";
  const dateISO = url.searchParams.get("date") ?? "";
  const serviceId = url.searchParams.get("service") ?? "";

  const lead = leadBySlug(slug);
  if (!lead || !lead.booking.enabled) {
    return NextResponse.json({ error: "UNKNOWN_LEAD" }, { status: 404 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateISO)) {
    return NextResponse.json({ error: "BAD_DATE" }, { status: 400 });
  }

  const service = findService(lead.catalogue.services, serviceId);
  if (!service) return NextResponse.json({ error: "UNKNOWN_SERVICE" }, { status: 400 });

  if (!isOpenOn(dateISO, lead.hours)) {
    return NextResponse.json({ slots: [], closed: true, source: "schedule" });
  }
  if (!isDateBookable(dateISO, lead.hours, lead.booking)) {
    return NextResponse.json({ slots: [], closed: false, source: "schedule" });
  }

  const { busy, source } =
    lead.booking.mode === "apps-script"
      ? await fetchBusy(lead, dateISO)
      : { busy: demoBusyRanges(dateISO, lead.hours), source: "schedule" as const };

  const slots = buildSlots({
    dateISO,
    durationMin: service.durationMin,
    hours: lead.hours,
    config: lead.booking,
    busy,
  });

  return NextResponse.json({ slots, closed: false, source });
}
