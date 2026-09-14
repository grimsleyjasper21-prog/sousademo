import SenderClient from "@/components/sender/SenderClient";
import leads from "@/data/grimhart-leads.json";

export default function SendPage() {
  return <SenderClient leads={leads} />;
}
