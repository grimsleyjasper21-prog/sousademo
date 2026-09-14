import { notFound } from "next/navigation";
import ServicePage from "@/factory/pages/ServicePage";
import { findService } from "@/factory/format";
import { text } from "@/factory/locale";
import { buildMetadata } from "@/factory/seo/metadata";
import { sousa } from "@/leads/sousa/lead";

/** One real route per service, generated from the lead's catalogue. */
export function generateStaticParams() {
  return sousa.catalogue.services.map((service) => ({ servicio: service.id }));
}

export async function generateMetadata(props: PageProps<"/sousa/servicios/[servicio]">) {
  const { servicio } = await props.params;
  const service = findService(sousa.catalogue.services, servicio);
  if (!service) return buildMetadata(sousa, { path: "/sousa/servicios" });

  const name = text(service.name, sousa.defaultLocale, sousa.defaultLocale);
  const short = text(service.short, sousa.defaultLocale, sousa.defaultLocale);
  return buildMetadata(sousa, {
    path: `/sousa/servicios/${service.id}`,
    title: name,
    description: short || undefined,
    image: service.image?.url,
  });
}

export default async function Page(props: PageProps<"/sousa/servicios/[servicio]">) {
  const { servicio } = await props.params;
  const service = findService(sousa.catalogue.services, servicio);
  if (!service) notFound();
  return <ServicePage service={service} />;
}
