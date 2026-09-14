"use client";
import Reveal from "../components/Reveal";
import { useLead } from "../lead-context";

/** The quiet beat after the hero: one idea, set large, with room around it. */
export default function StatementSection({ index }: { index?: number }) {
  const { lead, t, tl } = useLead();
  const statement = lead.copy.statement;
  if (!statement) return null;
  const body = tl(statement.body);

  return (
    <section className="section-y" style={{ background: "var(--surface)" }}>
      <div className="wrap-narrow flex flex-col gap-7 text-center items-center">
        {statement.eyebrow ? (
          <Reveal>
            <p className="eyebrow" data-style={lead.design.eyebrowStyle}>
              {lead.design.eyebrowStyle === "numbered" && index !== undefined ? (
                <>
                  <span className="tabular opacity-60">{String(index).padStart(2, "0")}</span>{" "}
                </>
              ) : null}
              {t(statement.eyebrow)}
            </p>
          </Reveal>
        ) : null}
        <Reveal delay={1}>
          <h2 className="display-2 max-w-[18ch]">{t(statement.title)}</h2>
        </Reveal>
        {body.map((paragraph, i) => (
          <Reveal key={i} delay={2 + i}>
            <p className="lead-text max-w-[58ch]">{paragraph}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
