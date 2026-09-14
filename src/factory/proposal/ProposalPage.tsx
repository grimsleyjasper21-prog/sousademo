import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import ProposalReveal from "./Reveal";
import { PRICING, grimhartWhatsapp, pricingCopy, withApp } from "./pricing";
import { absolute, demoHome } from "../routes";
import type { Lead } from "../types";
import "./proposal.css";

function screenshot(slug: string, name: string): string | null {
  const rel = `/proposals/${slug}/${name}.png`;
  return fs.existsSync(path.join(process.cwd(), "public", rel)) ? rel : null;
}

/**
 * The proposal sells GRIMHART; the demo sells the client. Which is why this page
 * shares no tokens, fonts or components with the site it links to.
 */
export default function ProposalPage({ lead }: { lead: Lead }) {
  const p = lead.proposal;
  const locale = p.locale === "en" ? "en" : "es";
  const copy = pricingCopy[locale];
  const demo = demoHome(lead);
  const wa = grimhartWhatsapp(p.whatsappMessage);
  const desktop = screenshot(lead.slug, "desktop");
  const mobile = screenshot(lead.slug, "mobile");

  const money = (n: number) => `€${n}`;

  return (
    <div className="grimhart">
      {/* Cover */}
      <section
        className="g-section"
        style={{
          paddingTop: "clamp(3rem, 8vw, 6rem)",
          paddingBottom: desktop || mobile ? "clamp(2.5rem, 5vw, 4rem)" : undefined,
        }}
      >
        <div className="g-wrap flex flex-col gap-10">
          <ProposalReveal className="flex items-center justify-between gap-6">
            <span className="g-eyebrow">GRIMHART</span>
            <span className="g-eyebrow">{locale === "en" ? "Proposal" : "Propuesta"}</span>
          </ProposalReveal>

          <hr className="g-rule" />

          <div className="flex flex-col gap-8 pt-6 md:pt-14">
            <ProposalReveal delay={1}>
              <h1 className="g-display">{lead.business.name}</h1>
            </ProposalReveal>
            <ProposalReveal delay={2}>
              <p className="g-lead" style={{ maxWidth: "46ch" }}>{p.intro}</p>
            </ProposalReveal>
            <ProposalReveal delay={3} className="flex flex-wrap gap-3">
              <a className="g-btn" href={demo}>
                {locale === "en" ? "Open the demo" : "Ver la web"}
              </a>
              <a className="g-btn g-btn-ghost" href="#precio">
                {locale === "en" ? "See the price" : "Ver el precio"}
              </a>
            </ProposalReveal>
          </div>
        </div>
      </section>

      {/* Preview */}
      {desktop || mobile ? (
        <section className="g-wrap" style={{ paddingBottom: "clamp(3rem, 7vw, 6rem)" }}>
          <ProposalReveal>
            <div className="grid gap-5 md:grid-cols-[1.9fr_1fr] items-start">
              {desktop ? (
                <a href={demo} className="g-shot block">
                  <Image
                    src={desktop}
                    alt={`${lead.business.name} — ${locale === "en" ? "desktop preview" : "vista de escritorio"}`}
                    width={1440}
                    height={900}
                    sizes="(max-width: 768px) 92vw, 720px"
                    style={{ width: "100%", height: "auto" }}
                  />
                </a>
              ) : null}
              {mobile ? (
                <a href={demo} className="g-shot block">
                  <Image
                    src={mobile}
                    alt={`${lead.business.name} — ${locale === "en" ? "phone preview" : "vista en móvil"}`}
                    width={390}
                    height={844}
                    sizes="(max-width: 768px) 60vw, 360px"
                    style={{ width: "100%", height: "auto" }}
                  />
                </a>
              ) : null}
            </div>
          </ProposalReveal>
          <ProposalReveal delay={1}>
            <p className="g-eyebrow" style={{ marginTop: "1.25rem" }}>
              {absolute(demo).replace(/^https?:\/\//, "")}
            </p>
          </ProposalReveal>
        </section>
      ) : null}

      {/* What I noticed */}
      <section className="g-section g-invert">
        <div className="g-wrap grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <ProposalReveal>
            <h2 className="g-h2">{locale === "en" ? "What I noticed" : "Lo que vi"}</h2>
          </ProposalReveal>
          <ol className="flex flex-col">
            {p.noticed.map((item, i) => (
              <ProposalReveal as="li" key={i} delay={i + 1}>
                <div
                  className="flex gap-6 py-6"
                  style={{ borderTop: i === 0 ? "none" : "1px solid var(--g-line)" }}
                >
                  <span className="g-number pt-1.5">{String(i + 1).padStart(2, "0")}</span>
                  <p style={{ fontSize: "1.08rem", lineHeight: 1.55 }}>{item}</p>
                </div>
              </ProposalReveal>
            ))}
          </ol>
        </div>
      </section>

      {/* The idea */}
      <section className="g-section">
        <div className="g-wrap flex flex-col gap-8">
          <ProposalReveal>
            <p className="g-eyebrow">{locale === "en" ? "The idea" : "La idea"}</p>
          </ProposalReveal>
          <ProposalReveal delay={1}>
            <p className="g-h2" style={{ maxWidth: "22ch", fontFamily: "inherit" }}>{p.idea}</p>
          </ProposalReveal>
        </div>
      </section>

      {/* What customers can do */}
      <section className="g-section" style={{ background: "var(--g-surface)" }}>
        <div className="g-wrap flex flex-col gap-10">
          <ProposalReveal>
            <h2 className="g-h2" style={{ maxWidth: "20ch" }}>
              {locale === "en" ? "What your customers can now do" : "Lo que pueden hacer tus clientes"}
            </h2>
          </ProposalReveal>
          <ul className="grid gap-x-12 gap-y-0 md:grid-cols-2">
            {p.customerCan.map((item, i) => (
              <ProposalReveal as="li" key={i} delay={i}>
                <div className="flex items-baseline gap-5 py-5" style={{ borderTop: "1px solid var(--g-line)" }}>
                  <span className="g-number">{String(i + 1).padStart(2, "0")}</span>
                  <p style={{ color: "var(--g-text)" }}>{item}</p>
                </div>
              </ProposalReveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Features */}
      <section className="g-section">
        <div className="g-wrap flex flex-col gap-10">
          <ProposalReveal>
            <p className="g-eyebrow">{locale === "en" ? "Included" : "Incluido"}</p>
          </ProposalReveal>
          <div className="grid gap-px" style={{ background: "var(--g-line)", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 19rem), 1fr))" }}>
            {p.features.map((feature, i) => (
              <ProposalReveal key={i} delay={i}>
                <div className="g-card h-full" style={{ border: "none", background: "var(--g-ink)" }}>
                  <h3 className="g-h3">{feature.title}</h3>
                  <p>{feature.body}</p>
                </div>
              </ProposalReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precio" className="g-section g-invert">
        <div className="g-wrap flex flex-col gap-12">
          <ProposalReveal>
            <h2 className="g-h2">{locale === "en" ? "Price" : "Precio"}</h2>
          </ProposalReveal>

          <div className={`grid gap-6 ${p.showAppUpsell ? "md:grid-cols-2" : "md:max-w-[28rem]"}`}>
            <ProposalReveal delay={1}>
              <div className="g-card h-full">
                <p className="g-eyebrow">{copy.webTitle}</p>
                <p className="g-price">
                  {money(PRICING.monthly)}
                  <span style={{ fontSize: "1rem", letterSpacing: 0 }}>{copy.perMonth}</span>
                </p>
                <p>
                  + {money(PRICING.activation)} {copy.activationLabel.toLowerCase()} ({copy.oneOff})
                </p>
                <p style={{ marginTop: "0.5rem" }}>{copy.webBody}</p>
              </div>
            </ProposalReveal>

            {p.showAppUpsell ? (
              <ProposalReveal delay={2}>
                <div className="g-card h-full">
                  <p className="g-eyebrow">{copy.appTitle}</p>
                  <p className="g-price">
                    {money(withApp)}
                    <span style={{ fontSize: "1rem", letterSpacing: 0 }}>{copy.perMonth}</span>
                  </p>
                  <p>
                    + {money(PRICING.activation)} {copy.activationLabel.toLowerCase()} ({copy.oneOff})
                  </p>
                  <p style={{ marginTop: "0.5rem" }}>{copy.appBody}</p>
                </div>
              </ProposalReveal>
            ) : null}
          </div>

          <ProposalReveal delay={3} className="flex flex-col gap-2">
            <p style={{ color: "var(--g-text)" }}>{copy.minimumTerm}</p>
            {p.showAppUpsell ? <p>{copy.appOptional}</p> : null}
          </ProposalReveal>
        </div>
      </section>

      {/* Close */}
      <section className="g-section">
        <div className="g-wrap flex flex-col gap-8">
          <ProposalReveal>
            <h2 className="g-display" style={{ maxWidth: "14ch" }}>
              {locale === "en" ? "Next step" : "Siguiente paso"}
            </h2>
          </ProposalReveal>
          <ProposalReveal delay={1}>
            <p className="g-lead" style={{ maxWidth: "46ch" }}>{p.closing}</p>
          </ProposalReveal>
          <ProposalReveal delay={2} className="flex flex-wrap gap-3">
            {/* No number configured (NEXT_PUBLIC_GRIMHART_WHATSAPP) means no CTA
                rather than an invented one — the demo link carries the close instead. */}
            {wa ? (
              <a className="g-btn" href={wa} target="_blank" rel="noopener noreferrer">
                {p.ctaLabel}
              </a>
            ) : null}
            <a className={wa ? "g-btn g-btn-ghost" : "g-btn"} href={demo}>
              {locale === "en" ? "Open the demo again" : "Volver a ver la web"}
            </a>
          </ProposalReveal>
        </div>
      </section>

      <footer className="g-wrap" style={{ paddingBottom: "clamp(3rem, 6vw, 5rem)" }}>
        <hr className="g-rule" />
        <div className="flex flex-col gap-2 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="g-eyebrow">GRIMHART · grimhart.com</p>
          <p className="g-eyebrow">
            {locale === "en"
              ? "This site is a concept built for this proposal."
              : "Esta web es un concepto creado para esta propuesta."}
          </p>
        </div>
      </footer>
    </div>
  );
}
