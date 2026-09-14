import { grimhartFontClass } from "@/factory/proposal/fonts";
import "@/factory/proposal/proposal.css";

/**
 * The environment's front door. Deliberately says nothing about which
 * businesses are being pitched — the lead ledger is internal (`npm run leads`).
 */
export default function Home() {
  return (
    <div className={`grimhart ${grimhartFontClass}`} style={{ display: "flex", alignItems: "center", minHeight: "100svh" }}>
      <div className="g-wrap flex flex-col gap-8">
        <p className="g-eyebrow">GRIMHART</p>
        <h1 className="g-display" style={{ maxWidth: "12ch" }}>
          Demo environment
        </h1>
        <p className="g-lead" style={{ maxWidth: "44ch" }}>
          Personalised concept sites built for specific businesses. Each one lives at its own
          address and is shared directly.
        </p>
        <p className="g-eyebrow">grimhart.com</p>
      </div>
    </div>
  );
}
