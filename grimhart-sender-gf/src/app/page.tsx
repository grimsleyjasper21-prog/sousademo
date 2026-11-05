import SenderClient from "@/components/SenderClient";
import leads from "@/data/grimhart-leads.json";

export default function HomePage() {
  return <SenderClient leads={leads} />;
}
