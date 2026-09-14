import LocationPage from "@/factory/pages/LocationPage";
import { buildMetadata } from "@/factory/seo/metadata";
import { sousa } from "@/leads/sousa/lead";

export const metadata = buildMetadata(sousa, {
  path: "/sousa/donde-estamos",
  title: "Dónde estamos",
  description: "SOUSA — The Hair Expert. Carrer Villalonga 63, Palma de Mallorca. Horario y cómo llegar.",
});

export default function Page() {
  return <LocationPage />;
}
