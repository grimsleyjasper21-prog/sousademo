import type { Metadata } from "next";
import ProposalPage from "@/factory/proposal/ProposalPage";
import { grimhartFontClass } from "@/factory/proposal/fonts";
import { sousa } from "@/leads/sousa/lead";

export const metadata: Metadata = {
  title: `Propuesta · ${sousa.business.name} · GRIMHART`,
  description: "Propuesta de GRIMHART para SOUSA — The Hair Expert.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={grimhartFontClass}>
      <ProposalPage lead={sousa} />
    </div>
  );
}
