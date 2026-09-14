"use client";
import CtaSection from "../sections/CtaSection";
import PageHeader from "../components/PageHeader";
import ServicesSection from "../sections/ServicesSection";
import { useLead } from "../lead-context";

export default function ServicesPage() {
  const { ui } = useLead();
  return (
    <>
      <PageHeader eyebrow={ui.nav.services} title={ui.services.title} intro={ui.services.intro} />
      <ServicesSection full />
      <CtaSection />
    </>
  );
}
