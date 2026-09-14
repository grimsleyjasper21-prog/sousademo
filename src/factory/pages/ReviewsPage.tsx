"use client";
import CtaSection from "../sections/CtaSection";
import PageHeader from "../components/PageHeader";
import ReviewsSection from "../sections/ReviewsSection";
import { useLead } from "../lead-context";

export default function ReviewsPage() {
  const { ui } = useLead();
  return (
    <>
      <PageHeader eyebrow={ui.nav.reviews} title={ui.reviews.title} />
      <ReviewsSection full />
      <CtaSection />
    </>
  );
}
