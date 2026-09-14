"use client";
import CtaSection from "../sections/CtaSection";
import LocationSection from "../sections/LocationSection";
import PageHeader from "../components/PageHeader";
import { fullAddress } from "../contact";
import { useLead } from "../lead-context";

export default function LocationPage() {
  const { lead, ui } = useLead();
  return (
    <>
      <PageHeader eyebrow={ui.nav.location} title={ui.location.title} intro={fullAddress(lead)} />
      <LocationSection full />
      <CtaSection />
    </>
  );
}
