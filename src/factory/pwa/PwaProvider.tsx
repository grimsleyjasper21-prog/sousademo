"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type PwaCtx = {
  canInstall: boolean;
  isIos: boolean;
  isStandalone: boolean;
  install: () => Promise<void>;
};

const PwaContext = createContext<PwaCtx | null>(null);

export function PwaProvider({ children }: { children: ReactNode }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-only read of browser APIs; reading during render would break hydration.
    setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as unknown as { standalone?: boolean }).standalone === true
    );

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setDeferred(null);
    window.addEventListener("beforeinstallprompt", onBip);
    window.addEventListener("appinstalled", onInstalled);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Installability is a bonus, never a requirement for the site to work.
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  return (
    <PwaContext.Provider value={{ canInstall: !!deferred, isIos, isStandalone, install }}>
      {children}
    </PwaContext.Provider>
  );
}

export function usePwa(): PwaCtx {
  const ctx = useContext(PwaContext);
  if (!ctx) throw new Error("usePwa must be used inside <PwaProvider>");
  return ctx;
}
