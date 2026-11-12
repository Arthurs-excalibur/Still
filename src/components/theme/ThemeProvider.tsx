"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { ThemePreference } from "@/types";

interface ThemeContextType {
  theme: ThemePreference;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "still_theme_preference";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default to signature warm-paper "light" mode per PRD approved palette
  const [theme, setThemeState] = useState<ThemePreference>("light");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTheme = params.get("theme") as ThemePreference | null;
      if (urlTheme === "system" || urlTheme === "light" || urlTheme === "dark") {
        setThemeState(urlTheme);
        setMounted(true);
        return;
      }

      const stored = localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
      if (stored === "system" || stored === "light" || stored === "dark") {
        setThemeState(stored);
      }
    } catch {
      // LocalStorage access error fallback
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateResolved = () => {
      const resolved =
        theme === "system" ? (mediaQuery.matches ? "dark" : "light") : theme;

      setResolvedTheme(resolved);

      const root = document.documentElement;
      if (resolved === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    updateResolved();

    const handler = () => {
      if (theme === "system") {
        updateResolved();
      }
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme, mounted]);

  const setTheme = (next: ThemePreference) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
