"use client";
import Action from "../components/Action";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import { useLead } from "../lead-context";
import { demoHome, sectionUrl } from "../routes";
import { usePwa } from "../pwa/PwaProvider";

/**
 * The install page. Doubles as the landing page for an NFC card or QR code in
 * the business itself — tap the card, install, next appointment is one tap away.
 */
export default function AppPage() {
  const { lead, ui } = useLead();
  const { canInstall, isIos, isStandalone, install } = usePwa();
  const name = lead.business.shortName ?? lead.business.name;

  const steps = [
    ui.pwa.install,
    ui.pwa.title.replace("{name}", name),
    ui.pwa.body,
  ];

  return (
    <>
      <PageHeader
        eyebrow={ui.nav.app}
        title={ui.pwa.title.replace("{name}", name)}
        intro={ui.pwa.body}
        backHref={demoHome(lead)}
        backLabel={ui.nav.home}
      />

      <section className="pb-20 md:pb-28" style={{ background: "var(--ink)" }}>
        <div className="wrap grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            {isStandalone ? (
              <Reveal>
                <p className="lead-text">{ui.pwa.installed}</p>
              </Reveal>
            ) : canInstall ? (
              <Reveal>
                <Action onClick={install} className="w-full sm:w-auto">
                  {ui.pwa.install}
                </Action>
              </Reveal>
            ) : null}

            {isIos || !canInstall ? (
              <Reveal delay={1} className="flex flex-col gap-3">
                <p className="eyebrow">{ui.pwa.iosTitle}</p>
                <ol className="flex flex-col">
                  {[ui.pwa.iosStep1, ui.pwa.iosStep2, ui.pwa.iosStep3].map((s, i) => (
                    <li
                      key={s}
                      className="flex gap-4 py-3 border-b"
                      style={{ borderColor: "var(--line)" }}
                    >
                      <span className="tabular muted text-sm">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-[var(--text-dim)]">{s}</span>
                    </li>
                  ))}
                </ol>
                <p className="text-sm muted">{ui.pwa.androidNote}</p>
              </Reveal>
            ) : null}

            <Reveal delay={2}>
              <Action href={sectionUrl(lead, "booking")} variant="secondary">
                {ui.common.bookNow}
              </Action>
            </Reveal>
          </div>

          <Reveal delay={1} className="flex flex-col gap-5">
            <ol className="flex flex-col">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-5 py-4 border-b" style={{ borderColor: "var(--line)" }}>
                  <span className="tabular muted text-sm">{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ color: "var(--text)" }}>{step}</span>
                </li>
              ))}
            </ol>
            <p className="text-sm muted">{ui.pwa.nfcNote}</p>
            <p className="text-xs muted">{ui.pwa.disclaimer}</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
