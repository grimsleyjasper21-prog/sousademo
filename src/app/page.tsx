import { BookingSelectionProvider } from "@/lib/booking-selection";
import Hero from "@/components/Hero";
import BrandStatement from "@/components/BrandStatement";
import TheStrand from "@/components/TheStrand";
import Editorial from "@/components/Editorial";
import Services from "@/components/Services";
import Transformation from "@/components/Transformation";
import Booking from "@/components/Booking";
import AppSection from "@/components/AppSection";
import Reputation from "@/components/Reputation";
import LocationHours from "@/components/LocationHours";
import FinalCta from "@/components/FinalCta";

export default function Home() {
  return (
    <BookingSelectionProvider>
      <Hero />
      <BrandStatement />
      <TheStrand />
      <Editorial />
      <Services />
      <Transformation />
      <Booking />
      <AppSection />
      <Reputation />
      <LocationHours />
      <FinalCta />
    </BookingSelectionProvider>
  );
}
