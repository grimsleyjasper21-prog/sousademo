import BookingPage from "@/factory/pages/BookingPage";
import { buildMetadata } from "@/factory/seo/metadata";
import { sousa } from "@/leads/sousa/lead";

export const metadata = buildMetadata(sousa, {
  path: "/sousa/reservar",
  title: "Reservar cita",
  description: "Reserva tu cita en SOUSA — The Hair Expert. Elige servicio, día y hora.",
});

export default async function Page(props: PageProps<"/sousa/reservar">) {
  const { s } = await props.searchParams;
  const initialServiceId = typeof s === "string" ? s : undefined;
  return <BookingPage initialServiceId={initialServiceId} />;
}
