import type { LeadStatus } from "@/lib/outreach/types";

export default function StatusPill({ status }: { status: LeadStatus }) {
  return (
    <span className="oe-pill" data-status={status}>
      {status}
    </span>
  );
}
