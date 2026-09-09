"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function Nav() {
  const { t, lang, setLang } = useI18n();
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

  const links = [
    { href: "/#services", label: t("nav.services") },
    { href: "/#booking", label: t("nav.booking") },
    { href: "/#app", label: t("nav.app") },
    { href: "/#location", label: t("nav.contact") },
  ];

  return (
    <>
    <header
      className="fixed top-0 inset-x-0 z-50 transition-colors duration-300"
      style={{
        background: scrolled ? "rgba(10,9,8,0.86)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--hairline)" : "1px solid transparent",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="container-editorial flex items-center justify-between h-16 md:h-20">
        <Link
          href="/"
          className="font-[var(--font-display)] text-xl md:text-2xl tracking-wide"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t("nav.brand")}
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm uppercase tracking-[0.14em] text-[var(--bone-dim)] hover:text-[var(--bone)] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="text-xs uppercase tracking-[0.12em] border border-[var(--hairline-strong)] px-3 py-1.5 rounded-sm hover:border-[var(--bone)] transition-colors"
          >
            {t("lang.switchTo")}
          </button>
          <Link href="/#booking" className="btn btn-primary">
            {t("nav.cta")}
          </Link>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-expanded={open}
          aria-label={t("nav.menu")}
        >
          <span className="block w-6 h-px bg-[var(--bone)]" />
          <span className="block w-6 h-px bg-[var(--bone)]" />
        </button>
      </div>
    </header>

      <div
        className="md:hidden fixed inset-0 z-50 flex flex-col overflow-y-auto"
        style={{
          background: "var(--ink)",
          clipPath: open ? "circle(150vmax at 100% 0%)" : "circle(0px at 100% 0%)",
          WebkitClipPath: open ? "circle(150vmax at 100% 0%)" : "circle(0px at 100% 0%)",
          transition: "clip-path 400ms ease-out",
        }}
      >
        <div className="container-editorial flex items-center justify-between h-16">
          <span style={{ fontFamily: "var(--font-display)" }} className="text-xl">
            {t("nav.brand")}
          </span>
          <button onClick={() => setOpen(false)} aria-label={t("nav.close")} className="p-2">
            <span
              className="block w-6 h-px bg-[var(--bone)] rotate-45 translate-y-px"
            />
            <span className="block w-6 h-px bg-[var(--bone)] -rotate-45" />
          </button>
        </div>
        <nav className="container-editorial flex flex-col gap-6 mt-10">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ fontFamily: "var(--font-display)" }}
              className="text-4xl"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="container-editorial mt-auto mb-10 flex flex-col gap-4">
          <button
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="text-sm uppercase tracking-[0.12em] border border-[var(--hairline-strong)] px-4 py-2 rounded-sm self-start"
          >
            {t("lang.switchTo")}
          </button>
          <Link href="/#booking" onClick={() => setOpen(false)} className="btn btn-primary w-full">
            {t("nav.cta")}
          </Link>
        </div>
      </div>
    </>
  );
}
