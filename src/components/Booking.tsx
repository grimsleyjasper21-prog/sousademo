"use client";
import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { useBookingSelection } from "@/lib/booking-selection";
import { useWhatsAppMessage } from "@/lib/whatsapp";
import {
  categories,
  services,
  categoryLabel,
  serviceName,
  type CategoryId,
  type Service,
} from "@/lib/services-data";
import { getTimeSlots, isDateBookable, isSalonOpen, isWithinHorizon, formatDateHuman, todayISO } from "@/lib/availability";
import { submitBooking } from "@/lib/calendar";
import { usePwa } from "@/lib/pwa";
import { campaignImages } from "@/lib/campaign-images";

type FieldErrors = Partial<Record<"category" | "service" | "date" | "time" | "name" | "surname" | "phone" | "email" | "consent", string>>;

export default function Booking() {
  const { t, lang } = useI18n();
  const { selection } = useBookingSelection();
  const { canInstall, isIos, install } = usePwa();
  const waLink = useWhatsAppMessage();

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [viewMonth, setViewMonth] = useState(() => new Date());
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [reference, setReference] = useState("");
  const [submitError, setSubmitError] = useState("");
  const submittingRef = useRef(false);

  const [prevSelection, setPrevSelection] = useState(selection);
  if (selection !== prevSelection) {
    setPrevSelection(selection);
    if (selection.category && selection.serviceId) {
      setCategory(selection.category);
      setServiceId(selection.serviceId);
      setStep(3);
    }
  }

  const selectedService: Service | undefined = services.find((s) => s.id === serviceId);
  const filteredServices = services.filter((s) => s.category === category);

  const slots = useMemo(() => {
    if (!date || !selectedService) return [];
    return getTimeSlots(date, selectedService.durationMin);
  }, [date, selectedService]);

  const stepKeys = ["category", "service", "date", "time", "details", "review", "confirm"] as const;

  function goTo(n: number) {
    setStep(Math.min(7, Math.max(1, n)));
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function validateStep(n: number): boolean {
    const e: FieldErrors = {};
    if (n === 1 && !category) e.category = t("booking.errors.selectCategory");
    if (n === 2 && !serviceId) e.service = t("booking.errors.selectService");
    if (n === 3 && !date) e.date = t("booking.errors.selectDate");
    if (n === 4 && !time) e.time = t("booking.errors.selectTime");
    if (n === 5) {
      if (!name.trim()) e.name = t("booking.errors.required");
      if (!surname.trim()) e.surname = t("booking.errors.required");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t("booking.errors.email");
      if (!/^[+\d][\d\s()-]{5,}$/.test(phone)) e.phone = t("booking.errors.phone");
      if (!consent) e.consent = t("booking.errors.consent");
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validateStep(step)) return;
    goTo(step + 1);
  }

  async function handleSubmit() {
    if (submittingRef.current || !selectedService || !date || !time) return;
    submittingRef.current = true;
    setSubmitState("loading");
    setStep(7);
    const result = await submitBooking({
      service: selectedService,
      date,
      startTime: time,
      name: name.trim(),
      surname: surname.trim(),
      phone: phone.trim(),
      email: email.trim(),
      notes: notes.trim(),
      lang,
    });
    submittingRef.current = false;
    if (result.ok) {
      setReference(result.reference);
      setSubmitState("success");
    } else {
      setSubmitError(result.error);
      setSubmitState("error");
    }
  }

  function resetAll() {
    setStep(1);
    setCategory(null);
    setServiceId(null);
    setDate(null);
    setTime(null);
    setName("");
    setSurname("");
    setPhone("");
    setEmail("");
    setNotes("");
    setConsent(false);
    setSubmitState("idle");
    setErrors({});
  }

  const monthLabel = viewMonth.toLocaleDateString(lang === "en" ? "en-GB" : "es-ES", {
    month: "long",
    year: "numeric",
  });
  const weekdayLabels = useMemo(() => {
    const base = new Date(2024, 0, 1); // a Monday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d.toLocaleDateString(lang === "en" ? "en-GB" : "es-ES", { weekday: "short" });
    });
  }, [lang]);

  const monthDays = useMemo(() => {
    const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    const startOffset = (first.getDay() + 6) % 7; // Monday-first
    const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
    const cells: (string | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d).toISOString().slice(0, 10);
      cells.push(iso);
    }
    return cells;
  }, [viewMonth]);

  const scissors = campaignImages.scissorsMacro;

  return (
    <section id="booking" className="py-24 md:py-32 border-t hairline">
      <div className="container-editorial">
        <div className="grid md:grid-cols-[1fr_260px] gap-10 items-start mb-12">
          <div>
            <p className="eyebrow mb-3">{t("booking.eyebrow")}</p>
            <h2 className="text-4xl md:text-6xl mb-4">{t("booking.title")}</h2>
            <p className="max-w-md">{t("booking.subtitle")}</p>
            <p className="mt-4 text-xs text-[var(--bone-faint)] max-w-md">{t("booking.calendarNote")}</p>
          </div>
          <div className="relative hidden md:block aspect-[4/3] rounded-sm overflow-hidden">
            <Image src={scissors.url} alt={scissors.alt} fill sizes="20vw" className="object-cover" />
          </div>
        </div>

        <ol className="flex gap-1 md:gap-2 mb-10 overflow-x-auto">
          {stepKeys.map((key, i) => {
            const n = i + 1;
            const active = n === step;
            const done = n < step;
            return (
              <li key={key} className="flex-1 min-w-[70px]">
                <div
                  className="h-1 rounded-full mb-2"
                  style={{ background: active || done ? "var(--bone)" : "var(--hairline-strong)" }}
                />
                <span
                  className="text-[10px] uppercase tracking-[0.08em] whitespace-nowrap"
                  style={{ color: active ? "var(--bone)" : "var(--bone-faint)" }}
                >
                  {t(`booking.steps.${key}`)}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="border hairline rounded-sm p-6 md:p-10" style={{ background: "var(--surface)" }}>
          {step === 1 && (
            <div>
              <h3 className="text-2xl mb-1">{t("booking.categoryStep.title")}</h3>
              <p className="text-sm mb-6">{t("booking.categoryStep.helper")}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCategory(c.id);
                      setServiceId(null);
                      setErrors({});
                    }}
                    className="text-left px-5 py-4 rounded-sm border transition-colors"
                    style={{
                      borderColor: category === c.id ? "var(--bone)" : "var(--hairline-strong)",
                      background: category === c.id ? "var(--surface-2)" : "transparent",
                    }}
                  >
                    <span className="text-lg" style={{ fontFamily: "var(--font-display)" }}>
                      {categoryLabel(c.id, lang)}
                    </span>
                  </button>
                ))}
              </div>
              {errors.category && <p className="text-sm mt-3 text-[var(--oxblood-bright)]">{errors.category}</p>}
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-2xl mb-1">{t("booking.serviceStep.title")}</h3>
              <p className="text-sm mb-6">{t("booking.serviceStep.helper")}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {filteredServices.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setServiceId(s.id);
                      setErrors({});
                    }}
                    className="text-left px-5 py-4 rounded-sm border transition-colors flex flex-col gap-1"
                    style={{
                      borderColor: serviceId === s.id ? "var(--bone)" : "var(--hairline-strong)",
                      background: serviceId === s.id ? "var(--surface-2)" : "transparent",
                    }}
                  >
                    <span className="text-base">{serviceName(s, lang)}</span>
                    <span className="text-sm text-[var(--bone-faint)] tabular">
                      {s.durationMin} {t("services.min")} · €{s.priceEUR}
                    </span>
                  </button>
                ))}
              </div>
              {errors.service && <p className="text-sm mt-3 text-[var(--oxblood-bright)]">{errors.service}</p>}
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-2xl mb-1">{t("booking.dateStep.title")}</h3>
              <p className="text-sm mb-6">{t("booking.dateStep.helper")}</p>
              <div className="flex items-center justify-between mb-4">
                <button
                  aria-label="Prev month"
                  onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                  className="btn btn-outline px-3 py-1.5 text-sm"
                >
                  ←
                </button>
                <span className="capitalize text-sm">{monthLabel}</span>
                <button
                  aria-label="Next month"
                  onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                  className="btn btn-outline px-3 py-1.5 text-sm"
                >
                  →
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-[var(--bone-faint)] mb-2 uppercase">
                {weekdayLabels.map((w) => (
                  <span key={w}>{w}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {monthDays.map((iso, i) => {
                  if (!iso) return <span key={i} />;
                  const bookable = isDateBookable(iso);
                  const isToday = iso === todayISO();
                  const outOfHorizon = !isWithinHorizon(iso);
                  const closed = isWithinHorizon(iso) && !isSalonOpen(iso);
                  return (
                    <button
                      key={iso}
                      disabled={!bookable}
                      onClick={() => {
                        setDate(iso);
                        setTime(null);
                        setErrors({});
                      }}
                      title={closed ? t("booking.dateStep.closed") : undefined}
                      className="aspect-square rounded-sm text-sm flex items-center justify-center transition-colors tabular"
                      style={{
                        borderWidth: 1,
                        borderColor: date === iso ? "var(--bone)" : "transparent",
                        background: date === iso ? "var(--bone)" : "transparent",
                        color: date === iso ? "var(--ink)" : bookable ? "var(--bone)" : "var(--bone-faint)",
                        opacity: !bookable ? 0.35 : 1,
                        cursor: bookable ? "pointer" : "not-allowed",
                        textDecoration: closed || outOfHorizon ? "line-through" : "none",
                      }}
                    >
                      {Number(iso.slice(-2))}
                      {isToday && <span className="sr-only">{t("booking.dateStep.today")}</span>}
                    </button>
                  );
                })}
              </div>
              {errors.date && <p className="text-sm mt-3 text-[var(--oxblood-bright)]">{errors.date}</p>}
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="text-2xl mb-1">{t("booking.timeStep.title")}</h3>
              <p className="text-sm mb-6">{t("booking.timeStep.helper")}</p>
              {slots.length === 0 ? (
                <p className="text-sm text-[var(--bone-faint)]">{t("booking.timeStep.noSlots")}</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {slots.map((s) => (
                    <button
                      key={s.time}
                      disabled={!s.available}
                      onClick={() => {
                        setTime(s.time);
                        setErrors({});
                      }}
                      className="tabular text-sm px-2 py-2 rounded-sm border transition-colors"
                      style={{
                        borderColor: time === s.time ? "var(--bone)" : "var(--hairline-strong)",
                        background: time === s.time ? "var(--bone)" : "transparent",
                        color: time === s.time ? "var(--ink)" : s.available ? "var(--bone)" : "var(--bone-faint)",
                        opacity: s.available ? 1 : 0.35,
                        textDecoration: s.available ? "none" : "line-through",
                      }}
                    >
                      {s.time}
                    </button>
                  ))}
                </div>
              )}
              {errors.time && <p className="text-sm mt-3 text-[var(--oxblood-bright)]">{errors.time}</p>}
            </div>
          )}

          {step === 5 && (
            <div>
              <h3 className="text-2xl mb-6">{t("booking.detailsStep.title")}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={t("booking.detailsStep.name")} error={errors.name}>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("booking.detailsStep.namePh")}
                    autoComplete="given-name"
                    className="field-input"
                  />
                </Field>
                <Field label={t("booking.detailsStep.surname")} error={errors.surname}>
                  <input
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    placeholder={t("booking.detailsStep.surnamePh")}
                    autoComplete="family-name"
                    className="field-input"
                  />
                </Field>
                <Field label={t("booking.detailsStep.phone")} error={errors.phone}>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t("booking.detailsStep.phonePh")}
                    type="tel"
                    autoComplete="tel"
                    className="field-input"
                  />
                </Field>
                <Field label={t("booking.detailsStep.email")} error={errors.email}>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("booking.detailsStep.emailPh")}
                    type="email"
                    autoComplete="email"
                    className="field-input"
                  />
                </Field>
              </div>
              <div className="mt-4">
                <Field label={t("booking.detailsStep.notes")}>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t("booking.detailsStep.notesPh")}
                    rows={3}
                    className="field-input resize-none"
                  />
                </Field>
              </div>
              <label className="flex items-start gap-3 mt-4 text-sm text-[var(--bone-dim)]">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1"
                />
                {t("booking.detailsStep.consent")}
              </label>
              {errors.consent && <p className="text-sm mt-2 text-[var(--oxblood-bright)]">{errors.consent}</p>}
            </div>
          )}

          {step === 6 && selectedService && date && time && (
            <div>
              <h3 className="text-2xl mb-6">{t("booking.reviewStep.title")}</h3>
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                <ReviewRow label={t("booking.reviewStep.service")} value={serviceName(selectedService, lang)} />
                <ReviewRow label={t("booking.reviewStep.category")} value={categoryLabel(selectedService.category, lang)} />
                <ReviewRow label={t("booking.reviewStep.duration")} value={`${selectedService.durationMin} ${t("services.min")}`} />
                <ReviewRow label={t("booking.reviewStep.price")} value={`€${selectedService.priceEUR}`} />
                <ReviewRow label={t("booking.reviewStep.date")} value={formatDateHuman(date, lang)} />
                <ReviewRow label={t("booking.reviewStep.time")} value={time} />
                <ReviewRow label={t("booking.reviewStep.customer")} value={`${name} ${surname}`} />
                <ReviewRow label={t("booking.reviewStep.phone")} value={phone} />
                <ReviewRow label={t("booking.reviewStep.email")} value={email} />
                {notes && <ReviewRow label={t("booking.reviewStep.notes")} value={notes} />}
              </dl>
            </div>
          )}

          {step === 7 && (
            <div className="text-center py-4">
              {submitState === "loading" && (
                <p className="text-lg">{t("booking.reviewStep.submitting")}</p>
              )}

              {submitState === "success" && (
                <div>
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ background: "var(--bone)", color: "var(--ink)" }}
                  >
                    ✓
                  </div>
                  <h3 className="text-3xl mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    {t("booking.success.title")}
                  </h3>
                  <p className="max-w-sm mx-auto mb-1">{t("booking.success.body")}</p>
                  {date && time && (
                    <p className="mb-4 text-[var(--bone-dim)]">
                      {formatDateHuman(date, lang)} · {time}
                    </p>
                  )}
                  <p className="text-xs text-[var(--bone-faint)] mb-6 tabular">
                    {t("booking.success.reference")}: {reference}
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {canInstall ? (
                      <button onClick={install} className="btn btn-primary">
                        {t("booking.success.addToPhone")}
                      </button>
                    ) : isIos ? (
                      <a href="/app" className="btn btn-primary">
                        {t("booking.success.addToPhone")}
                      </a>
                    ) : null}
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                      {t("booking.success.whatsapp")}
                    </a>
                  </div>
                  <button onClick={resetAll} className="mt-6 text-sm underline text-[var(--bone-faint)]">
                    {t("booking.success.another")}
                  </button>
                </div>
              )}

              {submitState === "error" && (
                <div>
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ background: "var(--oxblood)", color: "var(--bone)" }}
                  >
                    !
                  </div>
                  <h3 className="text-3xl mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    {t("booking.error.title")}
                  </h3>
                  <p className="max-w-sm mx-auto mb-2">{t("booking.error.body")}</p>
                  {submitError && (
                    <p className="text-xs text-[var(--bone-faint)] mb-6 tabular">{submitError}</p>
                  )}
                  <div className="flex flex-wrap justify-center gap-3">
                    <button onClick={handleSubmit} className="btn btn-primary">
                      {t("booking.error.retry")}
                    </button>
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                      {t("booking.error.whatsapp")}
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {step < 7 && (
            <div className="flex justify-between mt-10">
              <button
                onClick={() => goTo(step - 1)}
                className="btn btn-outline"
                style={{ visibility: step === 1 ? "hidden" : "visible" }}
              >
                {t("booking.nav.back")}
              </button>
              {step < 6 ? (
                <button onClick={next} className="btn btn-primary">
                  {t("booking.nav.next")}
                </button>
              ) : (
                <button onClick={handleSubmit} className="btn btn-primary">
                  {t("booking.reviewStep.submit")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-[var(--bone-dim)]">{label}</span>
      {children}
      {error && <span className="text-xs text-[var(--oxblood-bright)]">{error}</span>}
    </label>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-[var(--bone-faint)]">{label}</dt>
      <dd>{value}</dd>
    </>
  );
}
