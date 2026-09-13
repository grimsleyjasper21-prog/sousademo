"use client";

import { useCallback, useRef, useState } from "react";

interface ImportSummary {
  rowsProcessed: number;
  imported: number;
  duplicates: number;
  invalid: number;
  invalidBreakdown: {
    missingBusinessName: number;
    missingPhone: number;
    permanentlyClosed: number;
  };
  malformedRows: number;
  insertFailures: number;
}

type State =
  | { phase: "idle" }
  | { phase: "uploading"; fileName: string }
  | { phase: "done"; fileName: string; summary: ImportSummary; batchName: string }
  | { phase: "error"; message: string };

export default function ImportClient() {
  const [state, setState] = useState<State>({ phase: "idle" });
  const [dragActive, setDragActive] = useState(false);
  const [batchName, setBatchName] = useState("");
  const [activate, setActivate] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      setState({ phase: "uploading", fileName: file.name });
      try {
        const formData = new FormData();
        formData.append("file", file);
        if (batchName.trim()) formData.append("batchName", batchName.trim());
        formData.append("activate", String(activate));

        const res = await fetch("/api/outreach/import", { method: "POST", body: formData });
        const data = await res.json();

        if (!res.ok) {
          setState({ phase: "error", message: data.error ?? "Import failed." });
          return;
        }

        setState({ phase: "done", fileName: file.name, summary: data.summary, batchName: data.batch.name });
      } catch {
        setState({ phase: "error", message: "Import failed. Check your connection and try again." });
      }
    },
    [batchName, activate]
  );

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void upload(file);
  }

  function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void upload(file);
  }

  const uploading = state.phase === "uploading";

  return (
    <div className="max-w-3xl">
      <p className="oe-eyebrow mb-2">Import Leads</p>
      <h1 className="text-4xl md:text-5xl mb-4">Upload a raw Outscraper export</h1>
      <p className="mb-10">No cleaning required — column matching, phone normalization, and duplicate detection all happen automatically.</p>

      <div className="oe-card p-6 mb-6 flex flex-wrap gap-6 items-end">
        <div className="flex-1 min-w-[220px]">
          <label className="oe-eyebrow block mb-2">Batch name (optional)</label>
          <input
            className="oe-field"
            placeholder="e.g. September 2026"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            disabled={uploading}
          />
        </div>
        <label className="flex items-center gap-2 text-sm pb-2">
          <input type="checkbox" checked={activate} onChange={(e) => setActivate(e.target.checked)} disabled={uploading} />
          Set as active batch
        </label>
      </div>

      <div
        className="oe-card flex flex-col items-center justify-center text-center p-16 cursor-pointer transition-colors"
        style={{ borderColor: dragActive ? "var(--oe-white)" : undefined, borderStyle: "dashed" }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept=".csv" hidden onChange={onFileSelect} />
        {uploading ? (
          <p className="text-lg">Importing {state.fileName}…</p>
        ) : (
          <>
            <p className="text-lg mb-2">Drag and drop your CSV here</p>
            <p className="text-sm">or click to browse — 300–1000 leads typical</p>
          </>
        )}
      </div>

      {state.phase === "error" && (
        <div className="oe-card p-5 mt-6" style={{ borderColor: "var(--oe-status-lost)" }}>
          <p style={{ color: "var(--oe-status-lost)" }}>{state.message}</p>
        </div>
      )}

      {state.phase === "done" && (
        <div className="oe-card p-6 mt-6">
          <p className="oe-eyebrow mb-3">Import complete — {state.batchName}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-4">
            <SummaryStat label="Processed" value={state.summary.rowsProcessed} />
            <SummaryStat label="Imported" value={state.summary.imported} />
            <SummaryStat label="Duplicates" value={state.summary.duplicates} />
            <SummaryStat label="Invalid" value={state.summary.invalid} />
          </div>
          <div className="text-sm space-y-1">
            <p>Missing business name: {state.summary.invalidBreakdown.missingBusinessName}</p>
            <p>Missing/invalid phone: {state.summary.invalidBreakdown.missingPhone}</p>
            <p>Permanently closed: {state.summary.invalidBreakdown.permanentlyClosed}</p>
            {state.summary.malformedRows > 0 && <p>Malformed rows skipped by parser: {state.summary.malformedRows}</p>}
            {state.summary.insertFailures > 0 && <p>Rows that failed to save: {state.summary.insertFailures}</p>}
          </div>
          <a href="/outreach" className="oe-btn oe-btn-primary mt-6 inline-flex">
            Go to Today&rsquo;s Outreach
          </a>
        </div>
      )}
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="oe-eyebrow mb-1">{label}</p>
      <p className="text-2xl oe-tabular">{value}</p>
    </div>
  );
}
