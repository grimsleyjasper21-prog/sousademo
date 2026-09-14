"use client";
/**
 * THE STRAND — SOUSA's signature moment.
 *
 * A pinned, scroll-scrubbed GSAP sequence (precision → cut → transformation →
 * colour → resolve). This is the "bespoke section" pattern the factory is built
 * around: the shared engine handles every other page, and a lead that deserves
 * one signature piece gets it here without the rest of the system knowing.
 *
 * Falls back to a static editorial sequence under prefers-reduced-motion.
 */
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLead } from "@/factory/lead-context";
import { sousaImages } from "../images";


const strandCopy = {
  es: {
    label: "La cinta",
    state1: "PRECISIÓN.",
    state2: "CORTE.",
    state3: "TRANSFORMACIÓN.",
    state4: "COLOR.",
    state5a: "TU PELO.",
    state5b: "TU ESTILO.",
    state5c: "SOUSA.",
    hint: "Desplázate para continuar",
  },
  en: {
    label: "The reel",
    state1: "PRECISION.",
    state2: "THE CUT.",
    state3: "TRANSFORMATION.",
    state4: "COLOUR.",
    state5a: "YOUR HAIR.",
    state5b: "YOUR STYLE.",
    state5c: "SOUSA.",
    hint: "Keep scrolling",
  },
} as const;

export default function TheStrand() {
  const { lang } = useLead();
  const copy = strandCopy[lang === "en" ? "en" : "es"];
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const strandGroupRef = useRef<HTMLDivElement>(null);
  const brunetteRef = useRef<HTMLDivElement>(null);
  const copperRef = useRef<HTMLDivElement>(null);
  const blondeRef = useRef<HTMLDivElement>(null);
  const cutPieceRef = useRef<HTMLDivElement>(null);
  const scissorsRef = useRef<SVGSVGElement>(null);
  const bladeTopRef = useRef<SVGGElement>(null);
  const bladeBottomRef = useRef<SVGGElement>(null);
  const t1 = useRef<HTMLDivElement>(null);
  const t2 = useRef<HTMLDivElement>(null);
  const t3 = useRef<HTMLDivElement>(null);
  const t4 = useRef<HTMLDivElement>(null);
  const t5 = useRef<HTMLDivElement>(null);

  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-only read of a browser API to avoid an SSR/client hydration mismatch.
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || reduced) return;
    let ctx: { kill: () => void } | undefined;

    (async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default;
      const ScrollTrigger = stMod.default;
      gsap.registerPlugin(ScrollTrigger);

      gsap.set(cutPieceRef.current, { clipPath: "inset(55% 0% 0% 0%)" });
      gsap.set(copperRef.current, { opacity: 0 });
      gsap.set(blondeRef.current, { opacity: 0 });
      gsap.set(scissorsRef.current, { x: 420, opacity: 0 });
      gsap.set([t2.current, t3.current, t4.current, t5.current], { opacity: 0, y: 24 });
      gsap.set(t1.current, { opacity: 1, y: 0 });

      const tl = gsap.timeline({ defaults: { ease: "none" } });

      // STATE 1 — PRECISIÓN (0 - 1)
      tl.to(strandGroupRef.current, { scale: 1.06, duration: 1 }, 0)
        .to(t1.current, { opacity: 0, y: -16, duration: 0.25 }, 0.75);

      // STATE 2 — CORTE (1 - 2): scissors approach and close
      tl.to(scissorsRef.current, { x: 40, opacity: 1, duration: 0.6, ease: "power2.out" }, 1.0)
        .to(bladeTopRef.current, { rotate: -4, duration: 0.4 }, 1.55, )
        .to(bladeBottomRef.current, { rotate: 4, duration: 0.4 }, 1.55)
        .to(t2.current, { opacity: 1, y: 0, duration: 0.25 }, 1.1)
        .to(t2.current, { opacity: 0, y: -16, duration: 0.25 }, 1.8);

      // STATE 3 — TRANSFORMACIÓN (2 - 3): the cut falls away
      tl.to(cutPieceRef.current, { y: 260, rotate: 10, opacity: 0, duration: 0.85, ease: "power1.in" }, 2.0)
        .to(strandGroupRef.current, { scale: 1.22, y: -20, duration: 0.9 }, 2.0)
        .to(scissorsRef.current, { x: 480, opacity: 0, duration: 0.5 }, 2.0)
        .to(t3.current, { opacity: 1, y: 0, duration: 0.25 }, 2.1)
        .to(t3.current, { opacity: 0, y: -16, duration: 0.25 }, 2.8);

      // STATE 4 — COLOR (3 - 4): brunette -> copper -> blonde
      tl.to(brunetteRef.current, { opacity: 0, duration: 0.45 }, 3.0)
        .to(copperRef.current, { opacity: 1, duration: 0.45 }, 3.0)
        .to(copperRef.current, { opacity: 0, duration: 0.45 }, 3.5)
        .to(blondeRef.current, { opacity: 1, duration: 0.45 }, 3.5)
        .to(t4.current, { opacity: 1, y: 0, duration: 0.25 }, 3.15)
        .to(t4.current, { opacity: 0, y: -16, duration: 0.25 }, 3.85);

      // STATE 5 — SOUSA (4 - 5): resolve
      tl.to(strandGroupRef.current, { x: "-18%", opacity: 0, scale: 1.3, duration: 0.6 }, 4.0)
        .to(t5.current, { opacity: 1, y: 0, duration: 0.4 }, 4.25);

      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current!,
        start: "top top",
        end: "+=4200",
        pin: stageRef.current!,
        scrub: 0.6,
        animation: tl,
      });

      ctx = { kill: () => { trigger.kill(); tl.kill(); } };
    })();

    return () => ctx?.kill();
  }, [ready, reduced]);

  const strand = sousaImages.strandBrunette;
  const copper = sousaImages.strandCopper;
  const blonde = sousaImages.strandBlonde;

  if (ready && reduced) {
    return (
      <section id="strand" className="section-y">
        <div className="wrap">
          <p className="eyebrow mb-3">{copy.label}</p>
          <div className="grid gap-16">
            {[
              { img: strand, label: copy.state1 },
              { img: strand, label: copy.state2 },
              { img: copper, label: copy.state4 },
              { img: blonde, label: copy.state5c },
            ].map((s, i) => (
              <div key={i} className="grid md:grid-cols-2 gap-6 items-center">
                <div className="relative aspect-square  overflow-hidden">
                  <Image src={s.img.url} alt={s.img.alt[lang] ?? s.img.alt.es ?? ""} fill className="object-cover" />
                </div>
                <h3 className="text-5xl" style={{ fontFamily: "var(--font-display)" }}>
                  {s.label}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="strand" ref={sectionRef} className="relative">
      <div ref={stageRef} className="relative h-screen w-full overflow-hidden" style={{ background: "var(--ink)" }}>
        <div className="absolute top-8 left-0 w-full wrap z-20">
          <p className="eyebrow">{copy.label}</p>
        </div>

        <div
          ref={strandGroupRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[62vw] max-w-[760px] h-[62vh] max-h-[720px]"
        >
          <div ref={brunetteRef} className="absolute inset-0  overflow-hidden shadow-2xl">
            <Image src={strand.url} alt={strand.alt[lang] ?? strand.alt.es ?? ""} fill sizes="70vw" className="object-cover" />
          </div>
          <div ref={copperRef} className="absolute inset-0  overflow-hidden shadow-2xl">
            <Image src={copper.url} alt={copper.alt[lang] ?? copper.alt.es ?? ""} fill sizes="70vw" className="object-cover" />
          </div>
          <div ref={blondeRef} className="absolute inset-0  overflow-hidden shadow-2xl">
            <Image src={blonde.url} alt={blonde.alt[lang] ?? blonde.alt.es ?? ""} fill sizes="70vw" className="object-cover" />
          </div>

          <div ref={cutPieceRef} className="absolute inset-0  overflow-hidden">
            <Image src={strand.url} alt="" fill sizes="70vw" className="object-cover" />
          </div>
        </div>

        <svg
          ref={scissorsRef}
          viewBox="0 0 200 200"
          className="absolute left-1/2 top-1/2 w-40 md:w-56 -translate-y-1/2 z-10"
          style={{ filter: "drop-shadow(0 10px 24px rgba(0,0,0,0.5))" }}
        >
          <circle cx="60" cy="100" r="7" fill="#d9d9d9" />
          <g ref={bladeTopRef} style={{ transformOrigin: "60px 100px" }} transform="rotate(-22 60 100)">
            <path d="M60 100 L185 78 L178 68 L60 96 Z" fill="#e7e7e7" />
            <circle cx="182" cy="73" r="5" fill="#b5652f" />
          </g>
          <g ref={bladeBottomRef} style={{ transformOrigin: "60px 100px" }} transform="rotate(22 60 100)">
            <path d="M60 100 L185 122 L178 132 L60 104 Z" fill="#cfcfcf" />
            <circle cx="182" cy="127" r="5" fill="#b5652f" />
          </g>
        </svg>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div ref={t1} className="absolute" style={{ fontFamily: "var(--font-display)" }}>
            <span className="text-[14vw] md:text-[7vw] text-[var(--text)]">{copy.state1}</span>
          </div>
          <div ref={t2} className="absolute" style={{ fontFamily: "var(--font-display)" }}>
            <span className="text-[14vw] md:text-[7vw] text-[var(--text)]">{copy.state2}</span>
          </div>
          <div ref={t3} className="absolute" style={{ fontFamily: "var(--font-display)" }}>
            <span className="text-[14vw] md:text-[7vw] text-[var(--text)]">{copy.state3}</span>
          </div>
          <div ref={t4} className="absolute" style={{ fontFamily: "var(--font-display)" }}>
            <span className="text-[14vw] md:text-[7vw]" style={{ color: "var(--accent-bright)" }}>
              {copy.state4}
            </span>
          </div>
          <div ref={t5} className="absolute text-center" style={{ fontFamily: "var(--font-display)" }}>
            <span className="block text-[9vw] md:text-[4.4vw] text-[var(--text)] leading-tight">
              {copy.state5a}
            </span>
            <span className="block text-[9vw] md:text-[4.4vw] text-[var(--text)] leading-tight">
              {copy.state5b}
            </span>
            <span className="block text-[9vw] md:text-[4.4vw] leading-tight" style={{ color: "var(--accent-bright)" }}>
              {copy.state5c}
            </span>
          </div>
        </div>

        <div className="absolute bottom-8 inset-x-0 flex justify-center z-20">
          <span className="text-xs uppercase tracking-[0.18em] text-[var(--text-faint)]">{copy.hint}</span>
        </div>
      </div>
    </section>
  );
}
