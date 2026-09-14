import type { ReactNode } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import StickyCta from "../components/StickyCta";
import InstallBanner from "../pwa/InstallBanner";
import { PwaProvider } from "../pwa/PwaProvider";
import { tokensToCss } from "../design/tokens";
import { LeadProvider } from "../lead-context";
import { localBusinessSchema } from "../seo/metadata";
import { ui } from "../i18n/strings";
import type { Lead } from "../types";

/**
 * Everything every page of a demo shares: the lead's design tokens, its
 * language state, nav, footer and the phone action bar. A lead's layout file is
 * three lines because all of it lives here.
 */
export default function LeadShell({ lead, children }: { lead: Lead; children: ReactNode }) {
  const strings = ui[lead.defaultLocale];
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: tokensToCss(lead.design) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema(lead)) }}
      />
      <LeadProvider lead={lead}>
        <PwaProvider>
        <div
          className="min-h-screen flex flex-col"
          data-buttons={lead.design.buttons}
          data-image={lead.design.imageTreatment}
          style={{ background: "var(--ink)" }}
        >
          <a href="#main" className="skip-link">
            {strings.common.skipToContent}
          </a>
          <Nav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <StickyCta />
          <InstallBanner />
          {/* Clears the phone action bar so nothing sits under it. */}
          <div className="md:hidden h-16" aria-hidden="true" />
        </div>
        </PwaProvider>
      </LeadProvider>
    </>
  );
}
