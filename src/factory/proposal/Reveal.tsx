"use client";
import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

/** Proposal-side reveal. Self-contained: the proposal never loads a lead's design profile. */
export default function ProposalReveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
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
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`p-reveal ${className}`}
      data-shown={shown ? "true" : "false"}
      style={{ "--p-delay": `${delay * 70}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
