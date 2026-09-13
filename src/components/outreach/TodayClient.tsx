"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Batch, Lead } from "@/lib/outreach/types";
import type { TodayStats } from "@/lib/outreach/queue";
import LeadCard, { type CardUiState } from "@/components/outreach/LeadCard";
import { Toast, useToast } from "@/components/outreach/Toast";

const GENERATE_CHUNK_SIZE = 8;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function patchLead(id: string, body: Record<string, unknown>) {
  const res = await fetch(`/api/outreach/leads/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

async function requestGeneration(
  leadIds: string[],
  opts?: { variant?: "try_again" | "more_casual" | "more_direct"; languageOverride?: "es" | "en" }
) {
  const res = await fetch("/api/outreach/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ leadIds, ...opts }),
  });
  if (!res.ok) throw new Error("Generation request failed");
  return res.json() as Promise<{
    succeeded: { lead_id: string; language: "es" | "en"; message: string }[];
    failedIds: string[];
  }>;
}

export default function TodayClient({
  initialBatch,
  initialLeads,
  initialStats,
  dailyTarget,
}: {
  initialBatch: Batch | null;
  initialLeads: Lead[];
  initialStats: TodayStats;
  dailyTarget: number;
}) {
  const [batch, setBatch] = useState(initialBatch);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [stats, setStats] = useState(initialStats);
  const [uiState, setUiState] = useState<Record<string, CardUiState>>({});
  const [showAll, setShowAll] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const { toast, show, dismiss } = useToast();

  const generatingIds = useRef(new Set<string>());

  const runGeneration = useCallback(
    async (
      ids: string[],
      opts?: { variant?: "try_again" | "more_casual" | "more_direct"; languageOverride?: "es" | "en" },
      markAs: CardUiState = "generating"
    ) => {
      const fresh = ids.filter((id) => !generatingIds.current.has(id));
      if (fresh.length === 0) return;
      fresh.forEach((id) => generatingIds.current.add(id));
      setUiState((prev) => {
        const next = { ...prev };
        fresh.forEach((id) => (next[id] = markAs));
        return next;
      });

      for (const group of chunk(fresh, GENERATE_CHUNK_SIZE)) {
        try {
          const result = await requestGeneration(group, opts);
          const byId = new Map(result.succeeded.map((m) => [m.lead_id, m]));

          setLeads((prev) =>
            prev.map((l) => {
              const msg = byId.get(l.id);
              if (!msg) return l;
              return { ...l, message: msg.message, message_language: msg.language };
            })
          );
          setUiState((prev) => {
            const next = { ...prev };
            group.forEach((id) => {
              next[id] = byId.has(id) ? "idle" : "failed";
            });
            return next;
          });
        } catch {
          setUiState((prev) => {
            const next = { ...prev };
            group.forEach((id) => (next[id] = "failed"));
            return next;
          });
        } finally {
          group.forEach((id) => generatingIds.current.delete(id));
        }
      }
    },
    []
  );

  // Kick off generation for any queue leads that don't have a message yet.
  useEffect(() => {
    const missing = leads.filter((l) => !l.message).map((l) => l.id);
    if (missing.length) void runGeneration(missing);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lastRemoved = useRef<{ lead: Lead; index: number } | null>(null);

  function handleCopyNumber(lead: Lead) {
    const value = lead.normalized_phone || lead.phone || "";
    navigator.clipboard.writeText(value).then(() => show("Copied"));
  }

  function handleCopyMessage(lead: Lead) {
    if (!lead.message) return;
    navigator.clipboard.writeText(lead.message).then(() => show("Copied"));
  }

  function handleMarkSent(lead: Lead) {
    const index = leads.findIndex((l) => l.id === lead.id);
    lastRemoved.current = { lead, index };

    setLeads((prev) => prev.filter((l) => l.id !== lead.id));
    setStats((prev) => ({
      ...prev,
      sentToday: prev.sentToday + 1,
      monthSent: prev.monthSent + 1,
      remaining: Math.max(prev.remaining - 1, 0),
    }));

    show("Marked sent", {
      actionLabel: "Undo",
      onAction: () => handleUndo(lead),
    });

    patchLead(lead.id, { action: "mark_sent" }).catch(() => {
      // Revert on failure.
      setLeads((prev) => {
        const copy = [...prev];
        copy.splice(index, 0, lead);
        return copy;
      });
      setStats((prev) => ({
        ...prev,
        sentToday: Math.max(prev.sentToday - 1, 0),
        monthSent: Math.max(prev.monthSent - 1, 0),
        remaining: prev.remaining + 1,
      }));
      show("Could not mark as sent — please retry.");
    });
  }

  function handleUndo(lead: Lead) {
    const restoreAt = lastRemoved.current?.lead.id === lead.id ? lastRemoved.current.index : 0;
    setLeads((prev) => {
      if (prev.some((l) => l.id === lead.id)) return prev;
      const copy = [...prev];
      copy.splice(Math.min(restoreAt, copy.length), 0, lead);
      return copy;
    });
    setStats((prev) => ({
      ...prev,
      sentToday: Math.max(prev.sentToday - 1, 0),
      monthSent: Math.max(prev.monthSent - 1, 0),
      remaining: prev.remaining + 1,
    }));
    patchLead(lead.id, { action: "undo" }).catch(() => show("Undo failed to save — please refresh."));
  }

  function handleSaveMessage(lead: Lead, message: string) {
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, message } : l)));
    patchLead(lead.id, { action: "edit_message", message }).catch(() =>
      show("Could not save edit — please retry.")
    );
  }

  function handleRegenerate(
    lead: Lead,
    opts: { variant?: "try_again" | "more_casual" | "more_direct"; language?: "es" | "en" }
  ) {
    void runGeneration(
      [lead.id],
      { variant: opts.variant, languageOverride: opts.language },
      "regenerating"
    );
  }

  function handleRetry(lead: Lead) {
    void runGeneration([lead.id]);
  }

  async function handleContinueOutreach() {
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/outreach/queue?extra=${dailyTarget}`);
      const data = await res.json();
      setBatch(data.batch);
      setLeads(data.leads);
      setStats(data.stats);
      setShowAll(true);
      const missing = (data.leads as Lead[]).filter((l) => !l.message).map((l) => l.id);
      if (missing.length) void runGeneration(missing);
    } finally {
      setLoadingMore(false);
    }
  }

  const targetReached = stats.sentToday >= dailyTarget;

  return (
    <div>
      <header className="mb-10">
        <p className="oe-eyebrow mb-2">{batch?.name ?? "No active batch"}</p>
        <h1 className="text-4xl md:text-5xl mb-8">Today&rsquo;s Outreach</h1>
        <div className="flex flex-wrap gap-x-12 gap-y-6">
          <Stat label="Sent Today" value={`${stats.sentToday} / ${dailyTarget}`} />
          <Stat label="Month" value={`${stats.monthSent} / ${stats.monthTotal}`} />
          <Stat label="Remaining" value={String(stats.remaining)} />
        </div>
      </header>

      {!batch ? (
        <EmptyState
          title="No active leads"
          body="Import an Outscraper CSV to start building today's queue."
          ctaHref="/outreach/import"
          ctaLabel="Import leads"
        />
      ) : leads.length === 0 ? (
        <EmptyState
          title="Batch complete"
          body={`${stats.monthTotal} businesses contacted in ${batch.name}. Import a new batch to keep going.`}
          ctaHref="/outreach/import"
          ctaLabel="Import leads"
        />
      ) : (
        <>
          {targetReached && !showAll && (
            <div className="oe-card p-5 mb-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-lg">
                Daily target complete — {stats.sentToday} / {dailyTarget}
              </p>
              <button className="oe-btn oe-btn-outline" onClick={handleContinueOutreach} disabled={loadingMore}>
                {loadingMore ? "Loading…" : "Continue outreach"}
              </button>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                uiState={uiState[lead.id] ?? "idle"}
                onCopyNumber={() => handleCopyNumber(lead)}
                onCopyMessage={() => handleCopyMessage(lead)}
                onMarkSent={() => handleMarkSent(lead)}
                onSaveMessage={(message) => handleSaveMessage(lead, message)}
                onRegenerate={(opts) => handleRegenerate(lead, opts)}
                onRetry={() => handleRetry(lead)}
              />
            ))}
          </div>
        </>
      )}

      <Toast toast={toast} onDismiss={dismiss} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="oe-eyebrow mb-1">{label}</p>
      <p className="text-3xl oe-tabular">{value}</p>
    </div>
  );
}

function EmptyState({
  title,
  body,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="oe-card p-10 md:p-14 text-center max-w-xl mx-auto mt-10">
      <h2 className="text-2xl mb-3">{title}</h2>
      <p className="mb-6">{body}</p>
      <Link href={ctaHref} className="oe-btn oe-btn-primary">
        {ctaLabel}
      </Link>
    </div>
  );
}
