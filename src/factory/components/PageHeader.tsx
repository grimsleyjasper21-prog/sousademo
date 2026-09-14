"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import Reveal from "./Reveal";
import { useLead } from "../lead-context";

/** Inner-page opener: breadcrumb back to where the visitor came from, then the title. */
export default function PageHeader({
  eyebrow,
  title,
  intro,
  backHref,
  backLabel,
  aside,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  backHref?: string;
  backLabel?: string;
  aside?: ReactNode;
}) {
  const { lead } = useLead();
  return (
    <header className="pt-28 md:pt-36 pb-10 md:pb-14" style={{ background: "var(--ink)" }}>
      <div className="wrap flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
        <div className="flex flex-col gap-4 max-w-[46rem]">
          {backHref && backLabel ? (
            <Reveal>
              <Link
                href={backHref}
                className="text-xs uppercase tracking-[0.16em] muted hover:text-[var(--text)] transition-colors w-fit"
              >
                ← {backLabel}
              </Link>
            </Reveal>
          ) : eyebrow ? (
            <Reveal>
              <p className="eyebrow" data-style={lead.design.eyebrowStyle}>{eyebrow}</p>
            </Reveal>
          ) : null}
          <Reveal delay={1}>
            <h1 className="display-1">{title}</h1>
          </Reveal>
          {intro ? (
            <Reveal delay={2}>
              <p className="lead-text max-w-[54ch]">{intro}</p>
            </Reveal>
          ) : null}
        </div>
        {aside ? <Reveal delay={2}>{aside}</Reveal> : null}
      </div>
    </header>
  );
}
