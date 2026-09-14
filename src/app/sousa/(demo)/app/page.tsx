import AppPage from "@/factory/pages/AppPage";
import { buildMetadata } from "@/factory/seo/metadata";
import { sousa } from "@/leads/sousa/lead";

export const metadata = buildMetadata(sousa, {
  path: "/sousa/app",
  title: "App",
  description: "Instala SOUSA — The Hair Expert en tu móvil y reserva en un toque.",
});

export default function Page() {
  return <AppPage />;
}
