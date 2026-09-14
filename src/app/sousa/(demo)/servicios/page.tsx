import ServicesPage from "@/factory/pages/ServicesPage";
import { buildMetadata } from "@/factory/seo/metadata";
import { sousa } from "@/leads/sousa/lead";

export const metadata = buildMetadata(sousa, {
  path: "/sousa/servicios",
  title: "Servicios",
  description: "Corte, color, tratamientos y styling en SOUSA — The Hair Expert, Palma de Mallorca.",
});

export default function Page() {
  return <ServicesPage />;
}
