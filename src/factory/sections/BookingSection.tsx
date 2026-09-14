"use client";
import BookingFlow from "../booking/BookingFlow";
import SectionHead from "../components/SectionHead";
import Reveal from "../components/Reveal";
import { useLead } from "../lead-context";

/** The booking product, presented as a section of the page. */
export default function BookingSection({ index, initialServiceId }: { index?: number; initialServiceId?: string }) {
  const { lead, ui } = useLead();
  if (!lead.booking.enabled) return null;

  return (
    <section id="booking" className="section-y" style={{ background: "var(--surface-alt)" }}>
      <div className="wrap flex flex-col gap-10">
        <SectionHead eyebrow={ui.nav.booking} title={ui.booking.title} intro={ui.booking.intro} index={index} />
        <Reveal>
          <div className="max-w-[46rem]">
            <BookingFlow initialServiceId={initialServiceId} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
