"use client";
import { useEffect } from "react";

/** Registers public/sw.js so the app opens and works offline (production only). */
export default function ServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") {
      // a worker left over from a production build on the same port would
      // serve stale cached code in dev, so remove it
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => regs.forEach((r) => r.unregister()));
      return;
    }
    // a new build id = a new worker URL, so each deploy installs a fresh cache
    navigator.serviceWorker
      .register(`/sw.js?v=${process.env.buildId}`)
      .catch((e) => console.error("Service worker registration failed", e));
  }, []);
  return null;
}
