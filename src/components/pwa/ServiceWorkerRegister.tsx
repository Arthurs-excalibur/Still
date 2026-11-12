"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          // Check for sw update
          reg.onupdatefound = () => {
            const installing = reg.installing;
            if (installing) {
              installing.onstatechange = () => {
                if (installing.state === "installed" && navigator.serviceWorker.controller) {
                  // New content available quietly
                  console.info("Still update available on next reload");
                }
              };
            }
          };
        })
        .catch((err) => {
          console.warn("ServiceWorker registration failed:", err);
        });
    }
  }, []);

  return null;
}

