import ContactPage from "@/factory/pages/ContactPage";
import { buildMetadata } from "@/factory/seo/metadata";
import { sousa } from "@/leads/sousa/lead";

export const metadata = buildMetadata(sousa, {
  path: "/sousa/contacto",
  title: "Contacto",
  description: "Contacta con SOUSA — The Hair Expert: WhatsApp, teléfono, Instagram y horario.",
});

export default function Page() {
  return <ContactPage />;
}
