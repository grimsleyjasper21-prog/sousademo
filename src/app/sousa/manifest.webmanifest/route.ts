import { buildManifest } from "@/factory/pwa/manifest";
import { sousa } from "@/leads/sousa/lead";

export function GET() {
  return Response.json(buildManifest(sousa), {
    headers: { "Content-Type": "application/manifest+json" },
  });
}
