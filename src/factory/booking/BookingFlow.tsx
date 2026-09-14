"use client";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Action from "../components/Action";
import { leadWhatsapp } from "../contact";
import { formatDateLong, formatDuration, formatPrice, servicesInCategory } from "../format";
import { useLead } from "../lead-context";
import { localeTag } from "../locale";
import { addDaysISO, buildSlots, slotEnd, todayISO, type TimeSlot } from "./slots";
import type { Service } from "../types";

type Step = "service" | "date" | "time" | "details" | "review";
type Status = "idle" | "sending" | "done" | "error" | "taken";

const STEPS: Step[] = ["service", "date", "time", "details", "review"];

type Errors = Partial<Record<"name" | "surname" | "phone" | "email", string>>;

export default function BookingFlow({ initialServiceId }: { initialServiceId?: string }) {
  const { lead, lang, ui, t } = useLead();
  const { categories, services } = lead.catalogue;
  const bookable = useMemo(() => services.filter((s) => s.bookable !== false), [services]);

  const initial = initialServiceId ? bookable.find((s) => s.id === initialServiceId) : undefined;
  const [step, setStep] = useState<Step>(initial ? "date" : "service");
  const [categoryId, setCategoryId] = useState<string | null>(initial?.categoryId ?? null);
  const [service, setService] = useState<Service | null>(initial ?? null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<TimeSlot[] | null>(null);
  const [slotState, setSlotState] = useState<"idle" | "loading" | "error" | "closed">("idle");
  const [slotSource, setSlotSource] = useState<"calendar" | "schedule">("schedule");
  const [form, setForm] = useState({ name: "", surname: "", phone: "", email: "", notes: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const singleCategory = categories.length <= 1;
  const stepIndex = STEPS.indexOf(step);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const loadSlots = useCallback(
    async (serviceId: string, dateISO: string) => {
      setSlotState("loading");
      setSlots(null);
      try {
        const res = await fetch(
          `/api/availability?lead=${encodeURIComponent(lead.slug)}&date=${dateISO}&service=${encodeURIComponent(serviceId)}`
        );
        if (!res.ok) throw new Error("bad response");
        const data = (await res.json()) as { slots: TimeSlot[]; closed?: boolean; source: "calendar" | "schedule" };
        if (data.closed) {
          setSlotState("closed");
          setSlots([]);
          return;
        }
        setSlots(data.slots);
        setSlotSource(data.source);
        setSlotState("idle");
      } catch {
        setSlotState("error");
      }
    },
    [lead.slug]
  );

  const chooseService = (s: Service) => {
    setService(s);
    setTime(null);
    setSlots(null);
    if (date) void loadSlots(s.id, date);
    setStep("date");
  };

  const chooseDate = (d: string) => {
    setDate(d);
    setTime(null);
    setStep("time");
    if (service) void loadSlots(service.id, d);
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = ui.booking.invalidName;
    if (form.phone.replace(/\D/g, "").length < 6) next.phone = ui.booking.invalidPhone;
    const emailNeeded = lead.booking.requireEmail;
    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim());
    if ((emailNeeded || form.email.trim()) && !emailOk) next.email = ui.booking.invalidEmail;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!service || !date || !time) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead: lead.slug,
          serviceId: service.id,
          date,
          time,
          name: form.name.trim(),
          surname: form.surname.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          notes: form.notes.trim(),
          lang,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; reference?: string; error?: string };
      if (res.status === 409 || data.error === "SLOT_TAKEN") {
        setStatus("taken");
        if (service && date) void loadSlots(service.id, date);
        return;
      }
      if (!res.ok || !data.ok || !data.reference) {
        setStatus("error");
        return;
      }
      setReference(data.reference);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setReference(null);
    setService(null);
    setCategoryId(null);
    setDate(null);
    setTime(null);
    setSlots(null);
    setForm({ name: "", surname: "", phone: "", email: "", notes: "" });
    setStep("service");
  };

  const waMessage = () => {
    const parts = [ui.booking.whatsappMessage];
    if (service) parts.push(` ${t(service.name)}`);
    if (date) parts.push(` — ${formatDateLong(date, lang)}`);
    if (time) parts.push(` ${time}`);
    return `${parts.join("")}.`;
  };
  const waHref = leadWhatsapp(lead, waMessage());

  /* ------------------------------------------------------------ success */

  if (status === "done") {
    return (
      <div
        className="flex flex-col gap-6 p-7 md:p-10 border"
        style={{ borderColor: "var(--line-strong)", borderRadius: "var(--radius-lg)", background: "var(--surface)" }}
      >
        <div className="flex flex-col gap-3">
          <p className="eyebrow">{ui.booking.reference} {reference}</p>
          <h3 className="display-2">{ui.booking.successTitle}</h3>
          <p className="lead-text max-w-[46ch]">{ui.booking.successBody}</p>
        </div>
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2 text-sm">
          <Row label={ui.booking.service} value={service ? t(service.name) : "—"} />
          <Row label={ui.booking.date} value={date ? formatDateLong(date, lang) : "—"} />
          <Row
            label={ui.booking.time}
            value={time && service ? `${time} – ${slotEnd(time, service.durationMin)}` : "—"}
          />
          <Row label={ui.common.address} value={`${lead.location.addressLines[0]}, ${lead.location.locality}`} />
        </dl>
        <div className="flex flex-wrap gap-3">
          {waHref ? (
            <Action href={waHref} external variant="secondary">
              {ui.common.whatsapp}
            </Action>
          ) : null}
          <Action onClick={reset} variant="quiet">
            {ui.booking.addAnother}
          </Action>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------ stepper */

  const stepLabels: Record<Step, string> = {
    service: ui.booking.stepService,
    date: ui.booking.stepDate,
    time: ui.booking.stepTime,
    details: ui.booking.stepDetails,
    review: ui.booking.stepConfirm,
  };

  return (
    <div
      className="flex flex-col border overflow-hidden"
      style={{ borderColor: "var(--line-strong)", borderRadius: "var(--radius-lg)", background: "var(--surface)" }}
    >
      {/* progress */}
      <div className="flex flex-col gap-2 px-5 md:px-8 pt-6">
        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className="h-[3px] flex-1 block transition-colors duration-300"
              style={{ background: i <= stepIndex ? "var(--accent)" : "var(--line)" }}
            />
          ))}
        </div>
        {/* Five labels fit side by side on a desktop; on a phone they'd collide. */}
        <div className="hidden sm:flex items-center gap-1">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className="flex-1 text-[0.72rem] uppercase tracking-[0.08em] truncate"
              style={{ color: i === stepIndex ? "var(--text)" : "var(--text-faint)" }}
            >
              {stepLabels[s]}
            </span>
          ))}
        </div>
        <p className="sm:hidden text-xs uppercase tracking-[0.1em] muted">
          {ui.booking.step} {stepIndex + 1} {ui.booking.of} {STEPS.length} · {stepLabels[step]}
        </p>
      </div>

      <div className="p-5 md:p-8 flex flex-col gap-6">
        <h3 ref={headingRef} tabIndex={-1} className="display-3 outline-none">
          {step === "service" && (singleCategory || categoryId ? ui.booking.chooseService : ui.booking.chooseCategory)}
          {step === "date" && ui.booking.chooseDate}
          {step === "time" && ui.booking.chooseTime}
          {step === "details" && ui.booking.stepDetails}
          {step === "review" && ui.booking.summary}
        </h3>

        {step === "service" ? (
          <ServiceStep
            categories={categories.filter((c) => servicesInCategory(bookable, c.id).length > 0)}
            services={bookable}
            categoryId={singleCategory ? (categories[0]?.id ?? null) : categoryId}
            onCategory={setCategoryId}
            onService={chooseService}
          />
        ) : null}

        {step === "date" ? (
          <DateStep value={date} durationMin={service?.durationMin ?? 30} onPick={chooseDate} />
        ) : null}

        {step === "time" ? (
          <TimeStep
            state={slotState}
            slots={slots}
            value={time}
            source={slotSource}
            onPick={(v) => {
              setTime(v);
              setStep("details");
            }}
            onRetry={() => service && date && loadSlots(service.id, date)}
          />
        ) : null}

        {step === "details" ? (
          <DetailsStep
            form={form}
            errors={errors}
            requireEmail={lead.booking.requireEmail}
            onChange={(patch) => setForm((f) => ({ ...f, ...patch }))}
          />
        ) : null}

        {step === "review" && service && date && time ? (
          <div className="flex flex-col gap-5">
            <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2 text-sm">
              <Row label={ui.booking.service} value={t(service.name)} />
              <Row label={ui.common.duration} value={formatDuration(service.durationMin, lang, ui)} />
              <Row label={ui.booking.date} value={formatDateLong(date, lang)} />
              <Row label={ui.booking.time} value={`${time} – ${slotEnd(time, service.durationMin)}`} />
              <Row label={ui.booking.name} value={`${form.name} ${form.surname}`.trim()} />
              <Row label={ui.booking.phone} value={form.phone} />
              {form.email ? <Row label={ui.booking.email} value={form.email} /> : null}
              {formatPrice(service.price, lang, ui) ? (
                <Row label={ui.common.price} value={formatPrice(service.price, lang, ui) as string} />
              ) : null}
            </dl>
            {form.notes ? <p className="text-sm muted">{form.notes}</p> : null}

            {status === "error" ? (
              <div role="alert" className="flex flex-col gap-2 p-4" style={{ border: "1px solid var(--line-strong)", borderRadius: "var(--radius-sm)" }}>
                <p style={{ color: "var(--text)" }}>{ui.booking.errorTitle}</p>
                <p className="text-sm">{ui.booking.errorBody}</p>
              </div>
            ) : null}
            {status === "taken" ? (
              <div role="alert" className="flex flex-col gap-2 p-4" style={{ border: "1px solid var(--line-strong)", borderRadius: "var(--radius-sm)" }}>
                <p style={{ color: "var(--text)" }}>{ui.booking.slotTakenTitle}</p>
                <p className="text-sm">{ui.booking.slotTakenBody}</p>
                <button type="button" className="btn btn-quiet self-start" onClick={() => { setStatus("idle"); setStep("time"); }}>
                  {ui.booking.chooseAnother}
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* navigation */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {stepIndex > 0 ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setStatus("idle");
                setStep(STEPS[stepIndex - 1]);
              }}
            >
              {ui.booking.back}
            </button>
          ) : null}

          {step === "details" ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (validate()) setStep("review");
              }}
            >
              {ui.booking.next}
            </button>
          ) : null}

          {step === "review" ? (
            <button type="button" className="btn btn-primary" onClick={submit} disabled={status === "sending"}>
              {status === "sending" ? ui.booking.sending : ui.booking.confirm}
            </button>
          ) : null}

          {waHref && lead.booking.whatsappFallback ? (
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-quiet ml-auto">
              {ui.booking.whatsappInstead}
            </a>
          ) : null}
        </div>

        <p className="text-xs muted" aria-live="polite">
          {slotSource === "calendar" ? ui.booking.calendarNote : ui.booking.demoNote}
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[0.7rem] uppercase tracking-[0.12em] muted">{label}</dt>
      <dd style={{ color: "var(--text)" }}>{value}</dd>
    </div>
  );
}

/* ---------------------------------------------------------------- steps */

function ServiceStep({
  categories,
  services,
  categoryId,
  onCategory,
  onService,
}: {
  categories: { id: string; name: Service["name"] }[];
  services: Service[];
  categoryId: string | null;
  onCategory: (id: string) => void;
  onService: (s: Service) => void;
}) {
  const { lang, ui, t } = useLead();
  const list = categoryId ? servicesInCategory(services, categoryId) : [];

  return (
    <div className="flex flex-col gap-5">
      {categories.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onCategory(c.id)}
              aria-pressed={categoryId === c.id}
              className="px-4 py-2.5 text-sm transition-colors"
              style={{
                border: `1px solid ${categoryId === c.id ? "var(--accent)" : "var(--line-strong)"}`,
                background: categoryId === c.id ? "var(--accent)" : "transparent",
                color: categoryId === c.id ? "var(--accent-contrast)" : "var(--text-dim)",
                borderRadius: "var(--radius-pill)",
              }}
            >
              {t(c.name)}
            </button>
          ))}
        </div>
      ) : null}

      <ul className="flex flex-col">
        {list.map((s) => {
          const price = formatPrice(s.price, lang, ui);
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onService(s)}
                className="w-full text-left flex items-baseline justify-between gap-4 py-4 border-b hover:opacity-70 transition-opacity"
                style={{ borderColor: "var(--line)" }}
              >
                <span className="flex flex-col gap-1 min-w-0">
                  <span style={{ color: "var(--text)" }}>{t(s.name)}</span>
                  {s.short ? <span className="text-sm muted line-clamp-1">{t(s.short)}</span> : null}
                </span>
                <span className="flex items-center gap-3 shrink-0 tabular text-sm">
                  <span className="muted">{formatDuration(s.durationMin, lang, ui)}</span>
                  {price ? <span style={{ color: "var(--text)" }}>{price}</span> : null}
                </span>
              </button>
            </li>
          );
        })}
        {categoryId && list.length === 0 ? <li className="py-4 muted text-sm">—</li> : null}
      </ul>
    </div>
  );
}

function DateStep({
  value,
  durationMin,
  onPick,
}: {
  value: string | null;
  durationMin: number;
  onPick: (d: string) => void;
}) {
  const { lead, lang, ui } = useLead();
  const today = todayISO(lead.hours.timezone);
  const [monthOffset, setMonthOffset] = useState(0);

  const first = new Date(`${today}T00:00:00Z`);
  first.setUTCDate(1);
  first.setUTCMonth(first.getUTCMonth() + monthOffset);
  const monthISO = first.toISOString().slice(0, 10);
  const daysInMonth = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  const lead0 = (first.getUTCDay() + 6) % 7; // weeks start Monday
  const maxDate = addDaysISO(today, lead.booking.horizonDays);

  const monthLabel = first.toLocaleDateString(localeTag[lang], {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const weekdayLabels = useMemo(() => {
    const base = new Date(Date.UTC(2024, 0, 1)); // a Monday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setUTCDate(base.getUTCDate() + i);
      return d.toLocaleDateString(localeTag[lang], { weekday: "narrow", timeZone: "UTC" });
    });
  }, [lang]);

  return (
    <div className="flex flex-col gap-4 max-w-[26rem]">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMonthOffset((m) => Math.max(0, m - 1))}
          disabled={monthOffset === 0}
          className="btn btn-secondary px-3 py-2 min-h-0"
          aria-label="−"
        >
          ←
        </button>
        <span className="text-sm uppercase tracking-[0.12em]" style={{ color: "var(--text)" }}>
          {monthLabel}
        </span>
        <button
          type="button"
          onClick={() => setMonthOffset((m) => Math.min(2, m + 1))}
          disabled={monthOffset >= 2}
          className="btn btn-secondary px-3 py-2 min-h-0"
          aria-label="+"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1" role="group" aria-label={ui.booking.chooseDate}>
        {weekdayLabels.map((d, i) => (
          <span key={i} className="text-center text-[0.72rem] uppercase muted py-1">
            {d}
          </span>
        ))}
        {Array.from({ length: lead0 }, (_, i) => (
          <span key={`pad-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const dayISO = `${monthISO.slice(0, 8)}${String(i + 1).padStart(2, "0")}`;
          const inRange = dayISO >= today && dayISO <= maxDate;
          // Grey out a day the schedule itself can't fit this service into —
          // including today once it's too late to start. Days that are merely
          // fully booked stay selectable and say so when opened.
          const hasRoom =
            inRange &&
            buildSlots({
              dateISO: dayISO,
              durationMin,
              hours: lead.hours,
              config: lead.booking,
            }).some((slot) => slot.available);
          const disabled = !hasRoom;
          const selected = value === dayISO;
          return (
            <button
              key={dayISO}
              type="button"
              disabled={disabled}
              onClick={() => onPick(dayISO)}
              aria-label={dayISO}
              aria-pressed={selected}
              className="aspect-square text-sm tabular transition-colors flex items-center justify-center"
              style={{
                border: `1px solid ${selected ? "var(--accent)" : "var(--line)"}`,
                background: selected ? "var(--accent)" : "transparent",
                color: selected ? "var(--accent-contrast)" : disabled ? "var(--text-faint)" : "var(--text)",
                opacity: disabled ? 0.35 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
                borderRadius: "var(--radius-sm)",
              }}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TimeStep({
  state,
  slots,
  value,
  source,
  onPick,
  onRetry,
}: {
  state: "idle" | "loading" | "error" | "closed";
  slots: TimeSlot[] | null;
  value: string | null;
  source: "calendar" | "schedule";
  onPick: (t: string) => void;
  onRetry: () => void;
}) {
  const { ui } = useLead();

  if (state === "loading") return <p className="text-sm muted" aria-live="polite">{ui.booking.loadingSlots}</p>;
  if (state === "error") {
    return (
      <div className="flex flex-col gap-3 items-start" role="alert">
        <p className="text-sm">{ui.booking.slotsError}</p>
        <button type="button" className="btn btn-secondary" onClick={onRetry}>
          {ui.booking.retry}
        </button>
      </div>
    );
  }
  if (state === "closed") return <p className="text-sm muted">{ui.booking.closedThatDay}</p>;

  const free = (slots ?? []).filter((s) => s.available);
  if (free.length === 0) return <p className="text-sm muted">{ui.booking.noSlots}</p>;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))]">
        {(slots ?? []).map((slot) => (
          <button
            key={slot.time}
            type="button"
            disabled={!slot.available}
            onClick={() => onPick(slot.time)}
            aria-pressed={value === slot.time}
            className="py-2.5 text-sm tabular transition-colors"
            style={{
              border: `1px solid ${value === slot.time ? "var(--accent)" : "var(--line-strong)"}`,
              background: value === slot.time ? "var(--accent)" : "transparent",
              color: value === slot.time ? "var(--accent-contrast)" : slot.available ? "var(--text)" : "var(--text-faint)",
              opacity: slot.available ? 1 : 0.32,
              textDecoration: slot.available ? "none" : "line-through",
              cursor: slot.available ? "pointer" : "not-allowed",
              borderRadius: "var(--radius-sm)",
            }}
          >
            {slot.time}
          </button>
        ))}
      </div>
      <p className="text-xs muted">{source === "calendar" ? ui.booking.calendarNote : ui.booking.demoNote}</p>
    </div>
  );
}

function DetailsStep({
  form,
  errors,
  requireEmail,
  onChange,
}: {
  form: { name: string; surname: string; phone: string; email: string; notes: string };
  errors: Errors;
  requireEmail: boolean;
  onChange: (patch: Partial<typeof form>) => void;
}) {
  const { ui } = useLead();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label={ui.booking.name} error={errors.name}>
        <input
          className="field-input"
          value={form.name}
          autoComplete="given-name"
          aria-invalid={!!errors.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </Field>
      <Field label={ui.booking.surname} error={errors.surname}>
        <input
          className="field-input"
          value={form.surname}
          autoComplete="family-name"
          onChange={(e) => onChange({ surname: e.target.value })}
        />
      </Field>
      <Field label={ui.booking.phone} error={errors.phone}>
        <input
          className="field-input"
          value={form.phone}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          aria-invalid={!!errors.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
        />
      </Field>
      <Field label={`${ui.booking.email}${requireEmail ? "" : ` (${ui.booking.optional})`}`} error={errors.email}>
        <input
          className="field-input"
          value={form.email}
          type="email"
          inputMode="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          onChange={(e) => onChange({ email: e.target.value })}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label={ui.booking.notes}>
          <textarea
            className="field-input"
            rows={3}
            value={form.notes}
            placeholder={ui.booking.notesHint}
            onChange={(e) => onChange({ notes: e.target.value })}
          />
        </Field>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}
