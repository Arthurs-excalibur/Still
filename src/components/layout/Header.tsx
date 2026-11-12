"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

export type NavTab = "today" | "history" | "settings";

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export function Header({
  currentTab,
  onSelectTab,
}: HeaderProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "system") {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("system");
    }
  };

  return (
    <header className="w-full pb-3 sm:pb-8 mb-6 sm:mb-8 border-b border-paper-border/60 space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
      {/* Top row on mobile, left column on desktop */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onSelectTab("today")}
          className="text-xl sm:text-2xl font-serif tracking-tight text-paper-text hover:text-paper-text/80 transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper-text/30 rounded"
          aria-label="Still - return to Today"
        >
          Still
        </button>

        {/* Action icons on mobile */}
        <div className="flex items-center space-x-1 sm:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1 text-paper-muted hover:text-paper-text transition-colors rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper-text/40"
            title={`Current theme: ${theme}`}
            aria-label={`Toggle theme, current is ${theme}`}
          >
            {resolvedTheme === "dark" ? (
              <Moon className="w-3.5 h-3.5 stroke-[1.5]" />
            ) : (
              <Sun className="w-3.5 h-3.5 stroke-[1.5]" />
            )}
          </button>
        </div>
      </div>

      {/* Nav tabs */}
      <nav aria-label="Main navigation" className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm">
        <button
          type="button"
          onClick={() => onSelectTab("today")}
          className={`transition-colors py-1 relative focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper-text/40 rounded ${
            currentTab === "today"
              ? "text-paper-text font-medium"
              : "text-paper-muted hover:text-paper-text"
          }`}
          aria-current={currentTab === "today" ? "page" : undefined}
        >
          Today
          {currentTab === "today" && (
            <span
              className="absolute -bottom-1 left-0 right-0 h-[1px] bg-paper-text"
              aria-hidden="true"
            />
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectTab("history")}
          className={`transition-colors py-1 relative focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper-text/40 rounded ${
            currentTab === "history"
              ? "text-paper-text font-medium"
              : "text-paper-muted hover:text-paper-text"
          }`}
          aria-current={currentTab === "history" ? "page" : undefined}
        >
          Past Days
          {currentTab === "history" && (
            <span
              className="absolute -bottom-1 left-0 right-0 h-[1px] bg-paper-text"
              aria-hidden="true"
            />
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectTab("settings")}
          className={`transition-colors py-1 relative focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper-text/40 rounded ${
            currentTab === "settings"
              ? "text-paper-text font-medium"
              : "text-paper-muted hover:text-paper-text"
          }`}
          aria-current={currentTab === "settings" ? "page" : undefined}
        >
          Settings
          {currentTab === "settings" && (
            <span
              className="absolute -bottom-1 left-0 right-0 h-[1px] bg-paper-text"
              aria-hidden="true"
            />
          )}
        </button>

        {/* Theme toggle on desktop */}
        <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-paper-border">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 text-paper-muted hover:text-paper-text transition-colors rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper-text/40"
            title={`Current theme: ${theme} (Click to toggle)`}
            aria-label={`Toggle theme, current is ${theme}`}
          >
            {resolvedTheme === "dark" ? (
              <Moon className="w-4 h-4 stroke-[1.5]" />
            ) : (
              <Sun className="w-4 h-4 stroke-[1.5]" />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
