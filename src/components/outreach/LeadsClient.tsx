"use client";

import { useEffect, useState } from "react";
import type { Lead, LeadStatus } from "@/lib/outreach/types";
import StatusPill from "@/components/outreach/StatusPill";

type LeadRow = Lead & { batches: { name: string } | null };

const STATUS_FILTERS: { value: LeadStatus | ""; label: string }[] = [
  { value: "", label: "All" },
  { value: "uncontacted", label: "Uncontacted" },
  { value: "sent", label: "Sent" },
  { value: "replied", label: "Replied" },
  { value: "interested", label: "Interested" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export default function LeadsClient() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<LeadStatus | "">("");
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);

    const timeout = setTimeout(() => {
      setLoading(true);
      fetch(`/api/outreach/leads?${params.toString()}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((data) => setLeads(data.leads ?? []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 200);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [q, status]);

  return (
    <div>
      <p className="oe-eyebrow mb-2">Leads</p>
      <h1 className="text-4xl md:text-5xl mb-8">All Leads</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          className="oe-field max-w-xs"
          placeholder="Search name, phone or city…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value || "all"}
              type="button"
              className="oe-btn oe-btn-outline oe-btn-sm"
              style={status === f.value ? { background: "var(--oe-white)", color: "var(--oe-black)" } : undefined}
              onClick={() => setStatus(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="oe-card overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="oe-eyebrow text-left border-b oe-hairline">
              <th className="p-3">Business</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Category</th>
              <th className="p-3">City</th>
              <th className="p-3">Website</th>
              <th className="p-3">Status</th>
              <th className="p-3">Batch</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b oe-hairline last:border-0">
                <td className="p-3">{lead.business_name}</td>
                <td className="p-3 oe-tabular">{lead.phone || "—"}</td>
                <td className="p-3">{lead.category || "—"}</td>
                <td className="p-3">{lead.city || "—"}</td>
                <td className="p-3 max-w-[200px] truncate">{lead.website || "—"}</td>
                <td className="p-3">
                  <StatusPill status={lead.status} />
                </td>
                <td className="p-3">{lead.batches?.name || "—"}</td>
              </tr>
            ))}
            {!loading && leads.length === 0 && (
              <tr>
                <td className="p-6 text-center" colSpan={7}>
                  No leads match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
