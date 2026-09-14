"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { leadWhatsapp } from "../contact";
import { useLead } from "../lead-context";
import { sectionUrl } from "../routes";

/**
 * Phone-only action bar. Appears once the hero is behind the visitor, so the
 * first impression stays clean but booking is never more than a thumb away.
 */
export default function StickyCta() {
  const { lead, ui } = useLead();
  const [visible, setVisible] = useState(false);
  const wa = leadWhatsapp(lead, `${ui.booking.whatsappMessage} — ${lead.business.name}`);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!lead.booking.enabled) return null;

  return (
    <div
      className="md:hidden fixed inset-x-0 bottom-0 z-40 p-3 flex gap-2"
      style={{
        background: "color-mix(in srgb, var(--ink) 92%, transparent)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid var(--line)",
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
        transform: visible ? "translateY(0)" : "translateY(110%)",
        transition: "transform 320ms cubic-bezier(0.22, 0.61, 0.36, 1)",
      }}
    >
      <Link href={sectionUrl(lead, "booking")} className="btn btn-primary flex-1">
        {ui.common.bookNow}
      </Link>
      {wa ? (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary px-4"
          aria-label="WhatsApp"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.41a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07s.89 2.4 1.02 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
          </svg>
        </a>
      ) : null}
    </div>
  );
}
