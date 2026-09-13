"use client";

import { useEffect, useState } from "react";
import type { Lead, LeadStatus } from "@/lib/outreach/types";
import StatusPill from "@/components/outreach/StatusPill";

type LeadRow = Lead & { batches: { name: string } | null };

const EDITABLE_STATUSES: LeadStatus[] = ["sent", "replied", "interested", "won", "lost"];

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Madrid",
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default function HistoryClient() {
  const [q, setQ] = useState("");
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    const params = new URLSearchParams({ contactedOnly: "true" });
    if (q) params.set("q", q);
    fetch(`/api/outreach/leads?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setLeads(data.leads ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const timeout = setTimeout(load, 200);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function updateStatus(lead: LeadRow, status: LeadStatus) {
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status } : l)));
    fetch(`/api/outreach/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "set_status", status }),
    }).catch(() => load());
  }

  return (
    <div>
      <p className="oe-eyebrow mb-2">History</p>
      <h1 className="text-4xl md:text-5xl mb-8">Contacted Leads</h1>

      <input
        className="oe-field max-w-xs mb-6"
        placeholder="Search name, phone or city…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="oe-card overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="oe-eyebrow text-left border-b oe-hairline">
              <th className="p-3">Date</th>
              <th className="p-3">Business</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Message</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b oe-hairline last:border-0 align-top">
                <td className="p-3 whitespace-nowrap">
                  {lead.contacted_at ? dateFormatter.format(new Date(lead.contacted_at)) : "—"}
                </td>
                <td className="p-3">{lead.business_name}</td>
                <td className="p-3 oe-tabular whitespace-nowrap">{lead.phone || "—"}</td>
                <td className="p-3 max-w-[360px]">
                  <p className="line-clamp-2">{lead.message || "—"}</p>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <StatusPill status={lead.status} />
                    <select
                      className="oe-field !w-auto !py-1 !text-xs"
                      value={lead.status}
                      onChange={(e) => updateStatus(lead, e.target.value as LeadStatus)}
                    >
                      {EDITABLE_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && leads.length === 0 && (
              <tr>
                <td className="p-6 text-center" colSpan={5}>
                  No contacted leads yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
