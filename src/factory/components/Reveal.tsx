"use client";
import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";
import { motionSettings } from "../design/tokens";
import { useLead } from "../lead-context";

/**
 * Scroll reveal. Personality comes from the lead's motion profile, so the same
 * component feels cinematic on one demo and brisk on another — and does nothing
 * at all when the profile says `none` or the visitor prefers reduced motion.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
  style,
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}) {
  const { lead } = useLead();
  const settings = motionSettings[lead.design.motion];
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(settings.duration === 0);

  useEffect(() => {
    if (settings.duration === 0) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // No observer (very old browser, some crawlers): reveal immediately by
      // touching the DOM rather than looping back through React state.
      el.dataset.shown = "true";
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [settings.duration]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      data-shown={shown ? "true" : "false"}
      style={
        {
          "--reveal-distance": `${settings.distance}px`,
          "--reveal-duration": `${settings.duration}ms`,
          "--reveal-delay": `${delay * settings.stagger}ms`,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
