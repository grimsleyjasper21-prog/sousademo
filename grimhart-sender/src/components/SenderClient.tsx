"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface SenderLead {
  id: number;
  business_name: string;
  phone: string;
  message: string;
}

type LeadStatus = "opened" | "sent" | "skipped";

interface StatusEntry {
  status: LeadStatus;
  at: string;
}

interface StoredState {
  statuses: Record<number, StatusEntry>;
  lastId: number | null;
}

const STORAGE_KEY = "grimhart-sender:v1";
const INSTALL_HINT_KEY = "grimhart-sender:install-hint-dismissed";

function loadState(): StoredState {
  if (typeof window === "undefined") return { statuses: {}, lastId: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { statuses: {}, lastId: null };
    const parsed = JSON.parse(raw);
    return {
      statuses: parsed?.statuses ?? {},
      lastId: typeof parsed?.lastId === "number" ? parsed.lastId : null,
    };
  } catch {
    return { statuses: {}, lastId: null };
  }
}

function saveState(state: StoredState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable (private mode, quota) — the session still works,
    // it just won't survive a refresh.
  }
}

/**
 * iOS/PWA WhatsApp handoff: try the native app scheme first (opens WhatsApp
 * directly to this chat), and fall back to wa.me only if the app didn't
 * take over within the timeout (i.e. WhatsApp isn't installed).
 */
function openWhatsAppFor(phone: string, message: string) {
  const text = encodeURIComponent(message);
  const nativeUrl = `whatsapp://send?phone=${phone}&text=${text}`;
  const webUrl = `https://wa.me/${phone}?text=${text}`;

  let leftPage = false;
  const onVisibilityChange = () => {
    if (document.visibilityState === "hidden") leftPage = true;
  };
  document.addEventListener("visibilitychange", onVisibilityChange);

  window.location.href = nativeUrl;

  window.setTimeout(() => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
    if (!leftPage) {
      window.location.href = webUrl;
    }
  }, 500);
}

export default function SenderClient({ leads }: { leads: SenderLead[] }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<StoredState>({ statuses: {}, lastId: null });
  const [showInstallHint, setShowInstallHint] = useState(false);
  const [messageOverflows, setMessageOverflows] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // localStorage is only available post-mount; reading it here (rather than
    // in the initial state) avoids an SSR/CSR hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadState());
    setReady(true);

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    const dismissed = window.localStorage.getItem(INSTALL_HINT_KEY) === "1";
    setShowInstallHint(!standalone && !dismissed);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
    }
  }, []);

  const update = useCallback((updater: (prev: StoredState) => StoredState) => {
    setState((prev) => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }, []);

  const currentLead = useMemo(
    () => leads.find((l) => !state.statuses[l.id]) ?? null,
    [leads, state.statuses]
  );

  const doneCount = Object.keys(state.statuses).length;
  const sentCount = Object.values(state.statuses).filter((s) => s.status === "sent").length;
  const skippedCount = Object.values(state.statuses).filter((s) => s.status === "skipped").length;

  useEffect(() => {
    const el = messageRef.current;
    if (!el) {
      setMessageOverflows(false);
      return;
    }
    const check = () => setMessageOverflows(el.scrollHeight - el.clientHeight > 2);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [currentLead?.id]);

  const lastEntry = state.lastId != null ? state.statuses[state.lastId] : undefined;
  const lastLead = state.lastId != null ? leads.find((l) => l.id === state.lastId) : undefined;
  const showStrip = ready && lastLead && lastEntry && lastEntry.status !== "sent";

  function setStatus(id: number, status: LeadStatus, makeLast: boolean) {
    update((prev) => ({
      statuses: { ...prev.statuses, [id]: { status, at: new Date().toISOString() } },
      lastId: makeLast ? id : prev.lastId,
    }));
  }

  function clearStatus(id: number) {
    update((prev) => {
      const next = { ...prev.statuses };
      delete next[id];
      return { statuses: next, lastId: prev.lastId === id ? null : prev.lastId };
    });
  }

  function handleOpenWhatsApp(lead: SenderLead) {
    setStatus(lead.id, "opened", true);
    openWhatsAppFor(lead.phone, lead.message);
  }

  function handleSkip(lead: SenderLead) {
    setStatus(lead.id, "skipped", true);
  }

  function handleMarkSent(lead: SenderLead) {
    setStatus(lead.id, "sent", false);
  }

  function dismissInstallHint() {
    window.localStorage.setItem(INSTALL_HINT_KEY, "1");
    setShowInstallHint(false);
  }

  function handleReset() {
    if (!window.confirm("Clear all progress on this device? This can't be undone.")) return;
    update(() => ({ statuses: {}, lastId: null }));
  }

  if (!ready) {
    return <div className="snd-page snd-loading" aria-hidden="true" />;
  }

  return (
    <div className="snd-page">
      {showInstallHint && (
        <div className="snd-install-hint">
          <span>Tap Share → Add to Home Screen</span>
          <button onClick={dismissInstallHint} aria-label="Dismiss">
            ✕
          </button>
        </div>
      )}

      <div className="snd-progress">
        <div className="snd-progress-row">
          <span className="snd-progress-count">
            {doneCount} / {leads.length}
          </span>
          <span className="snd-progress-sub">
            {sentCount} sent · {skippedCount} skipped
          </span>
        </div>
        <div className="snd-progress-bar">
          <div
            className="snd-progress-fill"
            style={{ width: `${leads.length ? (doneCount / leads.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {showStrip && lastLead && lastEntry && (
        <div className="snd-strip">
          <span className="snd-strip-text">
            {lastEntry.status === "opened" ? "Opened" : "Skipped"}: {lastLead.business_name}
          </span>
          <div className="snd-strip-actions">
            {lastEntry.status !== "sent" && (
              <button onClick={() => handleMarkSent(lastLead)}>Mark sent</button>
            )}
            <button onClick={() => clearStatus(lastLead.id)}>Undo</button>
          </div>
        </div>
      )}

      {currentLead ? (
        <>
          <div className="snd-card">
            <p className="snd-lead-number">
              #{leads.findIndex((l) => l.id === currentLead.id) + 1} of {leads.length}
            </p>
            <h1 className="snd-lead-name">{currentLead.business_name}</h1>
            <div
              ref={messageRef}
              className={`snd-message${messageOverflows ? " snd-message--overflow" : ""}`}
            >
              {currentLead.message}
            </div>
          </div>

          <div className="snd-actions">
            <button className="snd-btn-primary" onClick={() => handleOpenWhatsApp(currentLead)}>
              Open WhatsApp
            </button>
            <div className="snd-actions-row">
              <button className="snd-btn-secondary" onClick={() => handleSkip(currentLead)}>
                Skip
              </button>
              <button className="snd-btn-tertiary" onClick={() => handleMarkSent(currentLead)}>
                Mark sent
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="snd-card snd-done">
          <h1 className="snd-lead-name">All done 🎉</h1>
          <p className="snd-done-sub">
            Worked through all {leads.length} leads — {sentCount} sent, {skippedCount} skipped.
          </p>
        </div>
      )}

      <button className="snd-reset" onClick={handleReset}>
        Reset progress
      </button>
    </div>
  );
}
