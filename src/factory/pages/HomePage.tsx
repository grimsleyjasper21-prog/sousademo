import type { ReactNode } from "react";
import AboutSection from "../sections/AboutSection";
import BookingSection from "../sections/BookingSection";
import CtaSection from "../sections/CtaSection";
import Hero from "../sections/Hero";
import LocationSection from "../sections/LocationSection";
import ReviewsSection from "../sections/ReviewsSection";
import ServicesSection from "../sections/ServicesSection";
import StatementSection from "../sections/StatementSection";
import type { Lead } from "../types";

/**
 * The home page is composed from the lead's `design.sectionOrder`, so two demos
 * built from the same components still read in a different order — and a lead
 * with a signature moment of its own just drops it into `custom` and names it
 * in the order.
 */
export default function HomePage({ lead, custom = {} }: { lead: Lead; custom?: Record<string, ReactNode> }) {
  let counter = 0;
  const nextIndex = () => ++counter;

  return (
    <>
      {lead.design.sectionOrder.map((key) => {
        if (custom[key]) return <div key={key}>{custom[key]}</div>;
        switch (key) {
          case "hero":
            return <Hero key={key} />;
          case "statement":
            return <StatementSection key={key} index={nextIndex()} />;
          case "services":
            return <ServicesSection key={key} index={nextIndex()} />;
          case "about":
            return <AboutSection key={key} index={nextIndex()} />;
          case "booking":
            return <BookingSection key={key} index={nextIndex()} />;
          case "reviews":
            return <ReviewsSection key={key} index={nextIndex()} />;
          case "location":
            return <LocationSection key={key} index={nextIndex()} />;
          case "cta":
            return <CtaSection key={key} />;
          default:
            return null;
        }
      })}
    </>
  );
}
