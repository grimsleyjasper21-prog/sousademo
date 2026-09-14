import HomePage from "@/factory/pages/HomePage";
import { buildMetadata } from "@/factory/seo/metadata";
import { sousa } from "@/leads/sousa/lead";
import Campaign from "@/leads/sousa/sections/Campaign";
import TheStrand from "@/leads/sousa/sections/TheStrand";

export const metadata = buildMetadata(sousa, { path: "/sousa" });

export default function Page() {
  return <HomePage lead={sousa} custom={{ strand: <TheStrand />, campaign: <Campaign /> }} />;
}
