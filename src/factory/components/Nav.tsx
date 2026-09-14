"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLead } from "../lead-context";
import { demoHome, sectionUrl } from "../routes";
import Action from "./Action";
import LangSwitch from "./LangSwitch";

function useNavLinks() {
  const { lead, ui } = useLead();
  const links: { href: string; label: string }[] = [
    { href: sectionUrl(lead, "services"), label: ui.nav.services },
  ];
  if (lead.routes.about) links.push({ href: sectionUrl(lead, "about"), label: ui.nav.about });
  if (lead.routes.reviews && (lead.reputation.reviews.length > 0 || lead.reputation.rating)) {
    links.push({ href: sectionUrl(lead, "reviews"), label: ui.nav.reviews });
  }
  links.push({ href: sectionUrl(lead, "location"), label: ui.nav.location });
  links.push({ href: sectionUrl(lead, "contact"), label: ui.nav.contact });
  return links;
}

export default function Nav() {
  const { lead, ui } = useLead();
  const variant = lead.design.variants.nav;
  const links = useNavLinks();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const brand = lead.business.shortName ?? lead.business.name;
  const bookHref = sectionUrl(lead, "booking");
  const centred = variant === "centered-serif";

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-50 transition-[background-color,border-color] duration-300"
        style={{
          background: scrolled || open ? "color-mix(in srgb, var(--ink) 88%, transparent)" : "transparent",
          borderBottom: `1px solid ${scrolled && variant === "rule-under" ? "var(--line-strong)" : scrolled ? "var(--line)" : "transparent"}`,
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div
          className={`wrap flex items-center h-16 md:h-20 gap-6 ${
            centred ? "md:grid md:grid-cols-[1fr_auto_1fr]" : "justify-between"
          }`}
        >
          {centred ? (
            <nav className="hidden md:flex items-center gap-7 justify-start">
              {links.slice(0, 2).map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-[0.78rem] uppercase tracking-[0.16em] text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          ) : null}

          <Link
            href={demoHome(lead)}
            className={`text-lg md:text-xl tracking-[0.06em] whitespace-nowrap ${centred ? "md:text-center" : ""}`}
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            {brand}
          </Link>

          {centred ? (
            <div className="hidden md:flex items-center gap-4 justify-end">
              {links.slice(2).map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-[0.78rem] uppercase tracking-[0.16em] text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              <LangSwitch />
              <Action href={bookHref}>{ui.nav.booking}</Action>
            </div>
          ) : (
            <>
              <nav className="hidden md:flex items-center gap-8 ml-auto">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-[0.78rem] uppercase tracking-[0.16em] text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
                    aria-current={pathname === l.href ? "page" : undefined}
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              <div className="hidden md:flex items-center gap-3">
                <LangSwitch />
                <Action href={bookHref}>{ui.nav.booking}</Action>
              </div>
            </>
          )}

          <div className="flex md:hidden items-center gap-2 ml-auto">
            <LangSwitch />
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex flex-col gap-[5px] p-3 -mr-3"
              aria-expanded={open}
              aria-label={ui.nav.menu}
            >
              <span className="block w-6 h-px" style={{ background: "var(--text)" }} />
              <span className="block w-6 h-px" style={{ background: "var(--text)" }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className="md:hidden fixed inset-0 z-50 flex flex-col"
        aria-hidden={!open}
        style={{
          background: "var(--ink)",
          transform: open ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 380ms cubic-bezier(0.22, 0.61, 0.36, 1)",
          visibility: open ? "visible" : "hidden",
          overscrollBehavior: "contain",
        }}
      >
        <div className="wrap flex items-center justify-between h-16 shrink-0">
          <span className="text-lg tracking-[0.06em]" style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>
            {brand}
          </span>
          <button type="button" onClick={() => setOpen(false)} aria-label={ui.nav.close} className="p-3 -mr-3">
            <span className="block w-6 h-px translate-y-px rotate-45" style={{ background: "var(--text)" }} />
            <span className="block w-6 h-px -rotate-45" style={{ background: "var(--text)" }} />
          </button>
        </div>

        <nav className="wrap flex flex-col gap-1 mt-6 overflow-y-auto">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3 border-b"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 8vw, 2.5rem)",
                color: "var(--text)",
                borderColor: "var(--line)",
                opacity: open ? 1 : 0,
                transform: open ? "none" : "translateY(12px)",
                transition: `opacity 320ms ease ${80 + i * 45}ms, transform 320ms ease ${80 + i * 45}ms`,
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="wrap mt-auto pt-6 pb-8 shrink-0">
          <Action href={bookHref} className="w-full" onClick={() => setOpen(false)}>
            {ui.common.bookNow}
          </Action>
        </div>
      </div>
    </>
  );
}
