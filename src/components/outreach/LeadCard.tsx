"use client";

import { useState } from "react";
import type { Lead } from "@/lib/outreach/types";
import { whatsappLinkFor } from "@/lib/outreach/phone";

export type CardUiState = "idle" | "generating" | "failed" | "regenerating";

const REGENERATE_OPTIONS: { key: string; label: string; variant?: "try_again" | "more_casual" | "more_direct"; language?: "es" | "en" }[] = [
  { key: "try_again", label: "Try again", variant: "try_again" },
  { key: "more_casual", label: "More casual", variant: "more_casual" },
  { key: "more_direct", label: "More direct", variant: "more_direct" },
  { key: "es", label: "Spanish", language: "es" },
  { key: "en", label: "English", language: "en" },
];

export default function LeadCard({
  lead,
  uiState,
  onCopyNumber,
  onCopyMessage,
  onMarkSent,
  onSaveMessage,
  onRegenerate,
  onRetry,
}: {
  lead: Lead;
  uiState: CardUiState;
  onCopyNumber: () => void;
  onCopyMessage: () => void;
  onMarkSent: () => void;
  onSaveMessage: (message: string) => void;
  onRegenerate: (opts: { variant?: "try_again" | "more_casual" | "more_direct"; language?: "es" | "en" }) => void;
  onRetry: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(lead.message ?? "");
  const [menuOpen, setMenuOpen] = useState(false);

  const hasMessage = Boolean(lead.message);
  const whatsappHref = lead.normalized_phone
    ? whatsappLinkFor(lead.normalized_phone, lead.message ?? undefined)
    : null;

  function startEdit() {
    setDraft(lead.message ?? "");
    setEditing(true);
  }

  function save() {
    onSaveMessage(draft);
    setEditing(false);
  }

  return (
    <div className="oe-card p-5 md:p-6 flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-xl md:text-2xl truncate">{lead.business_name}</h3>
          <p className="text-sm mt-1">
            {[lead.category, lead.city].filter(Boolean).join(" · ") || "—"}
          </p>
        </div>
        <div className="text-right text-sm shrink-0">
          <div className="oe-tabular">{lead.phone || "No phone"}</div>
          {lead.website && (
            <a
              href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 decoration-[var(--oe-line-strong)] hover:decoration-[var(--oe-white)] break-all"
            >
              {lead.website.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>
      </div>

      <div className="oe-card !bg-[var(--oe-black)] p-4 min-h-[6rem]">
        {editing ? (
          <textarea
            className="oe-field !bg-transparent !border-0 !p-0 min-h-[6rem]"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
          />
        ) : uiState === "generating" || uiState === "regenerating" ? (
          <p className="oe-eyebrow">
            {uiState === "regenerating" ? "Regenerating message…" : "Generating message…"}
          </p>
        ) : uiState === "failed" ? (
          <p className="text-sm" style={{ color: "var(--oe-status-lost)" }}>
            MESSAGE GENERATION FAILED
          </p>
        ) : hasMessage ? (
          <p className="whitespace-pre-wrap text-[var(--oe-white)]">{lead.message}</p>
        ) : (
          <p className="oe-eyebrow">No message yet</p>
        )}
      </div>

      {!editing && (
        <a
          href={whatsappHref ?? undefined}
          target="_blank"
          rel="noreferrer"
          className="oe-btn oe-btn-primary !text-base !py-3.5 w-full"
          aria-disabled={!whatsappHref || !hasMessage}
          onClick={(e) => {
            if (!whatsappHref || !hasMessage) {
              e.preventDefault();
              return;
            }
            onMarkSent();
          }}
          style={!whatsappHref || !hasMessage ? { opacity: 0.45, pointerEvents: "none" } : undefined}
        >
          Message on WhatsApp →
        </a>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="oe-btn oe-btn-ghost oe-btn-sm" onClick={onCopyNumber} disabled={!lead.normalized_phone}>
          Copy number
        </button>
        <button
          type="button"
          className="oe-btn oe-btn-ghost oe-btn-sm"
          onClick={onCopyMessage}
          disabled={!hasMessage || editing}
        >
          Copy message
        </button>
        <button type="button" className="oe-btn oe-btn-ghost oe-btn-sm" onClick={onMarkSent}>
          Mark sent manually
        </button>

        <span className="flex-1" />

        {editing ? (
          <>
            <button type="button" className="oe-btn oe-btn-ghost oe-btn-sm" onClick={() => setEditing(false)}>
              Cancel
            </button>
            <button type="button" className="oe-btn oe-btn-outline oe-btn-sm" onClick={save}>
              Save
            </button>
          </>
        ) : uiState === "failed" ? (
          <button type="button" className="oe-btn oe-btn-outline oe-btn-sm" onClick={onRetry}>
            Retry
          </button>
        ) : (
          <>
            <button type="button" className="oe-btn oe-btn-ghost oe-btn-sm" onClick={startEdit}>
              Edit
            </button>
            <div className="relative">
              <button
                type="button"
                className="oe-btn oe-btn-ghost oe-btn-sm"
                onClick={() => setMenuOpen((v) => !v)}
                disabled={uiState === "regenerating" || uiState === "generating"}
              >
                Regenerate
              </button>
              {menuOpen && (
                <div
                  className="oe-card absolute right-0 bottom-full mb-2 py-1 z-10 w-40"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  {REGENERATE_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-[var(--oe-charcoal-2)]"
                      onClick={() => {
                        setMenuOpen(false);
                        onRegenerate({ variant: opt.variant, language: opt.language });
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
