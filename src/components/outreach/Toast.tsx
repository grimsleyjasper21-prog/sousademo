"use client";

import { useCallback, useRef, useState } from "react";

interface ToastState {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((message: string, opts?: { actionLabel?: string; onAction?: () => void; durationMs?: number }) => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ message, actionLabel: opts?.actionLabel, onAction: opts?.onAction });
    timer.current = setTimeout(() => setToast(null), opts?.durationMs ?? 4000);
  }, []);

  const dismiss = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setToast(null);
  }, []);

  return { toast, show, dismiss };
}

export function Toast({
  toast,
  onDismiss,
}: {
  toast: { message: string; actionLabel?: string; onAction?: () => void } | null;
  onDismiss: () => void;
}) {
  if (!toast) return null;
  return (
    <div className="oe-toast" role="status">
      <span>{toast.message}</span>
      {toast.actionLabel && toast.onAction && (
        <button
          type="button"
          onClick={() => {
            toast.onAction?.();
            onDismiss();
          }}
        >
          {toast.actionLabel}
        </button>
      )}
    </div>
  );
}
