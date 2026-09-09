"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { usePwa } from "@/lib/pwa";

const DISMISS_KEY = "sousa-install-dismissed";

export default function InstallBanner() {
  const { t } = useI18n();
  const { canInstall, isIos, isStandalone, install } = usePwa();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-only read of a browser API to avoid an SSR/client hydration mismatch.
      setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  if (isStandalone || dismissed || (!canInstall && !isIos)) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  };

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-40 border hairline rounded-sm p-4"
      style={{ background: "var(--surface)" }}
      role="status"
    >
      <p className="text-sm mb-3">{t("install.text")}</p>
      {isIos && !canInstall ? (
        <p className="text-xs text-[var(--bone-faint)] mb-3">
          {t("install.iosStep1")} → {t("install.iosStep2")} → {t("install.iosStep3")}
        </p>
      ) : null}
      <div className="flex justify-end gap-3">
        <button onClick={dismiss} className="btn btn-outline text-xs px-3 py-1.5">
          {t("install.dismiss")}
        </button>
        {canInstall ? (
          <button onClick={install} className="btn btn-primary text-xs px-3 py-1.5">
            {t("install.install")}
          </button>
        ) : null}
      </div>
    </div>
  );
}
