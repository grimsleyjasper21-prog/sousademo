"use client";
import type { ReactNode } from "react";
import { useLead } from "../lead-context";
import Reveal from "./Reveal";

/** Section opener. The eyebrow treatment is part of the lead's visual signature. */
export default function SectionHead({
  eyebrow,
  title,
  intro,
  index,
  align = "left",
  aside,
  titleClass = "display-2",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: string;
  index?: number;
  align?: "left" | "center";
  aside?: ReactNode;
  titleClass?: string;
}) {
  const { lead } = useLead();
  const style = lead.design.eyebrowStyle;
  const centred = align === "center";

  return (
    <div
      className={`flex flex-col gap-5 ${centred ? "items-center text-center" : ""} ${
        aside ? "md:flex-row md:items-end md:justify-between md:gap-10" : ""
      }`}
    >
      <div className={`flex flex-col gap-4 ${centred ? "items-center" : ""} ${aside ? "md:max-w-2xl" : ""}`}>
        {eyebrow ? (
          <Reveal>
            <p className="eyebrow" data-style={style}>
              {style === "numbered" && index !== undefined ? (
                <>
                  <span className="tabular opacity-60">{String(index).padStart(2, "0")}</span>
                  <span>{eyebrow}</span>
                </>
              ) : (
                eyebrow
              )}
            </p>
          </Reveal>
        ) : null}
        <Reveal delay={1}>
          <h2 className={titleClass}>{title}</h2>
        </Reveal>
        {intro ? (
          <Reveal delay={2}>
            <p className="lead-text max-w-[52ch]">{intro}</p>
          </Reveal>
        ) : null}
      </div>
      {aside ? <Reveal delay={2}>{aside}</Reveal> : null}
    </div>
  );
}
