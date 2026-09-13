"use client";

import { useState } from "react";
import type { LanguageMode, Settings } from "@/lib/outreach/types";

const LANGUAGE_OPTIONS: { value: LanguageMode; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "es", label: "Prefer Spanish" },
  { value: "en", label: "Prefer English" },
];

export default function SettingsClient({ initialSettings }: { initialSettings: Settings }) {
  const [dailyTarget, setDailyTarget] = useState(initialSettings.daily_target);
  const [languageMode, setLanguageMode] = useState<LanguageMode>(initialSettings.language_mode);
  const [aiContext, setAiContext] = useState(initialSettings.ai_context);
  const [baseInstructions, setBaseInstructions] = useState(initialSettings.base_instructions);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/outreach/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          daily_target: dailyTarget,
          language_mode: languageMode,
          ai_context: aiContext,
          base_instructions: baseInstructions,
        }),
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <p className="oe-eyebrow mb-2">Settings</p>
      <h1 className="text-4xl md:text-5xl mb-10">Settings</h1>

      <div className="flex flex-col gap-8">
        <div>
          <label className="oe-eyebrow block mb-2">Daily target</label>
          <input
            type="number"
            min={1}
            max={200}
            className="oe-field max-w-[140px]"
            value={dailyTarget}
            onChange={(e) => setDailyTarget(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="oe-eyebrow block mb-2">Default language behaviour</label>
          <div className="flex gap-2">
            {LANGUAGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className="oe-btn oe-btn-outline oe-btn-sm"
                style={
                  languageMode === opt.value
                    ? { background: "var(--oe-white)", color: "var(--oe-black)" }
                    : undefined
                }
                onClick={() => setLanguageMode(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="oe-eyebrow block mb-2">GRIMHART AI context</label>
          <textarea
            className="oe-field min-h-[140px]"
            value={aiContext}
            onChange={(e) => setAiContext(e.target.value)}
          />
        </div>

        <div>
          <label className="oe-eyebrow block mb-2">Base outreach instructions</label>
          <textarea
            className="oe-field min-h-[140px]"
            value={baseInstructions}
            onChange={(e) => setBaseInstructions(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <button type="button" className="oe-btn oe-btn-primary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
          {saved && <span className="oe-eyebrow">Saved</span>}
        </div>
      </div>
    </div>
  );
}
