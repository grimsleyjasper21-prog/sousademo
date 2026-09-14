"use client";
import { useLead } from "../lead-context";

/**
 * Demo disclosure. Present enough that nobody could mistake the page for the
 * business's live site, quiet enough that it never damages the first
 * impression — §62 of the brief, in one line.
 */
export default function DemoNote({ className = "" }: { className?: string }) {
  const { lead, ui } = useLead();
  if (!lead.meta.demoDisclosure) return null;
  return (
    <p className={`text-[0.72rem] tracking-[0.08em] uppercase muted ${className}`}>
      {ui.demo.footerNote}
    </p>
  );
}
