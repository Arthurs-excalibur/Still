"use client";

import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import type { ThemePreference, UserPreferences } from "@/types";
import {
  getUserPreferences,
  saveUserPreferences,
  exportAllData,
  importBackupData,
  clearAllData,
  type StillBackupData,
} from "@/lib/database/db";
import { ShieldCheck, HardDrive, Download, Upload, Trash2, AlertTriangle } from "lucide-react";

export function SettingsView() {
  const { theme, setTheme } = useTheme();
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [focusMin, setFocusMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [savingPrefs, setSavingPrefs] = useState(false);

  // Status feedback
  const [statusMsg, setStatusMsg] = useState<{ text: string; error?: boolean } | null>(null);

  // Clear data double-confirmation state
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [clearInput, setClearInput] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;
    getUserPreferences().then((loaded) => {
      if (!isMounted) return;
      setPrefs(loaded);
      setFocusMin(Math.round(loaded.defaultFocusDurationSeconds / 60));
      setBreakMin(Math.round(loaded.shortBreakDurationSeconds / 60));
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveDurations = async (newFocus: number, newBreak: number) => {
    setFocusMin(newFocus);
    setBreakMin(newBreak);
    setSavingPrefs(true);
    try {
      await saveUserPreferences({
        defaultFocusDurationSeconds: Math.max(1, newFocus) * 60,
        shortBreakDurationSeconds: Math.max(1, newBreak) * 60,
      });
      setStatusMsg({ text: "Session durations saved." });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch {
      setStatusMsg({ text: "Failed to save preferences.", error: true });
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleExportJSON = async () => {
    try {
      const data = await exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const dateStr = new Date().toISOString().split("T")[0];
      a.href = url;
      a.download = `still-backup-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatusMsg({ text: "Backup exported successfully." });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch {
      setStatusMsg({ text: "Export failed.", error: true });
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text) as StillBackupData;
        await importBackupData(parsed);
        setStatusMsg({ text: "Data restored. Reloading view..." });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Invalid JSON backup file.";
        setStatusMsg({ text: `Import failed: ${msg}`, error: true });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleClearAll = async () => {
    if (clearInput.trim().toUpperCase() !== "DELETE") return;
    try {
      await clearAllData();
      setConfirmClearOpen(false);
      setStatusMsg({ text: "All data cleared. Resetting application..." });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch {
      setStatusMsg({ text: "Failed to clear database.", error: true });
    }
  };

  return (
    <main className="flex-1 flex flex-col space-y-10 animate-fade-in pb-16">
      <section className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-serif tracking-tight text-paper-text">
          Settings
        </h1>
        <p className="text-sm text-paper-muted">
          Quiet preferences and local data controls.
        </p>
      </section>

      {statusMsg && (
        <div
          role="status"
          className={`py-2 px-3 text-xs rounded border transition-all ${
            statusMsg.error
              ? "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400"
              : "border-paper-border bg-paper-surface text-paper-text"
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {/* Appearance Section */}
      <section aria-labelledby="appearance-heading" className="space-y-4">
        <h2
          id="appearance-heading"
          className="text-xs uppercase tracking-widest text-paper-muted font-medium"
        >
          Appearance
        </h2>

        <div className="grid grid-cols-3 gap-2.5">
          {(["system", "light", "dark"] as ThemePreference[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setTheme(mode)}
              className={`py-2 px-3 text-xs sm:text-sm capitalize rounded border transition-all text-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper-text/40 ${
                theme === mode
                  ? "border-paper-text bg-paper-surface font-medium text-paper-text shadow-sm"
                  : "border-paper-border text-paper-muted hover:text-paper-text hover:border-paper-muted/60"
              }`}
              aria-pressed={theme === mode}
            >
              {mode}
            </button>
          ))}
        </div>
      </section>

      {/* Focus Timer Config */}
      <section aria-labelledby="focus-config-heading" className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2
            id="focus-config-heading"
            className="text-xs uppercase tracking-widest text-paper-muted font-medium"
          >
            Focus Session Defaults
          </h2>
          {savingPrefs && (
            <span className="text-[11px] font-mono text-paper-muted animate-pulse">
              Saving...
            </span>
          )}
        </div>

        <div className="space-y-4 border-y border-paper-border/70 py-4 text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label htmlFor="focus-duration-input" className="text-paper-text font-medium block">
                Planned focus duration
              </label>
              <span className="text-xs text-paper-muted">Length of uninterrupted focus</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="focus-duration-input"
                type="number"
                min={1}
                max={180}
                value={focusMin}
                onChange={(e) => handleSaveDurations(Number(e.target.value), breakMin)}
                className="w-16 px-2 py-1 text-center font-mono text-sm rounded border border-paper-border bg-paper-surface text-paper-text focus:outline-none focus:border-paper-text"
              />
              <span className="text-xs text-paper-muted font-mono">min</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-paper-border/40">
            <div>
              <label htmlFor="break-duration-input" className="text-paper-text font-medium block">
                Short break duration
              </label>
              <span className="text-xs text-paper-muted">Interval between focus intervals</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="break-duration-input"
                type="number"
                min={1}
                max={60}
                value={breakMin}
                onChange={(e) => handleSaveDurations(focusMin, Number(e.target.value))}
                className="w-16 px-2 py-1 text-center font-mono text-sm rounded border border-paper-border bg-paper-surface text-paper-text focus:outline-none focus:border-paper-text"
              />
              <span className="text-xs text-paper-muted font-mono">min</span>
            </div>
          </div>
        </div>
      </section>

      {/* Data Backup & Privacy */}
      <section aria-labelledby="privacy-heading" className="space-y-4 pt-2">
        <h2
          id="privacy-heading"
          className="text-xs uppercase tracking-widest text-paper-muted font-medium"
        >
          Data &amp; Backup
        </h2>

        <div className="rounded border border-paper-border/80 bg-paper-surface/40 p-4 space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <HardDrive className="w-4 h-4 text-paper-muted shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-paper-text font-medium text-xs sm:text-sm">
                Local-first IndexedDB
              </p>
              <p className="text-xs text-paper-muted leading-relaxed">
                Your priorities, focus sessions, and journal entries remain strictly in your browser.
                No third-party trackers, analytics, or remote database synchronization.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-paper-border/50 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleExportJSON}
              className="inline-flex items-center justify-center gap-2 py-2 px-3 text-xs rounded border border-paper-border text-paper-text hover:border-paper-muted hover:bg-paper-surface transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper-text/40"
            >
              <Download className="w-3.5 h-3.5 text-paper-muted" />
              <span>Export JSON Backup</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 py-2 px-3 text-xs rounded border border-paper-border text-paper-text hover:border-paper-muted hover:bg-paper-surface transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper-text/40"
            >
              <Upload className="w-3.5 h-3.5 text-paper-muted" />
              <span>Import JSON Backup</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleImportFile}
            />
          </div>
        </div>
      </section>

      {/* Danger Zone: Clear Data */}
      <section aria-labelledby="danger-heading" className="space-y-4 pt-2">
        <h2
          id="danger-heading"
          className="text-xs uppercase tracking-widest text-red-600/80 dark:text-red-400/80 font-medium"
        >
          Reset Application
        </h2>

        {!confirmClearOpen ? (
          <button
            type="button"
            onClick={() => setConfirmClearOpen(true)}
            className="inline-flex items-center gap-2 py-2 px-3 text-xs rounded border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500/50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Data</span>
          </button>
        ) : (
          <div className="rounded border border-red-500/40 bg-red-500/5 p-4 space-y-3">
            <div className="flex items-start gap-2.5 text-red-700 dark:text-red-400">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-semibold">Irreversible action</p>
                <p className="text-xs leading-relaxed text-paper-muted">
                  This will permanently delete all daily plans, priorities, focus sessions, and preferences from this device.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <label htmlFor="confirm-delete-input" className="text-xs font-mono text-paper-muted block">
                Type <span className="font-semibold text-paper-text">DELETE</span> to confirm:
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="confirm-delete-input"
                  type="text"
                  value={clearInput}
                  onChange={(e) => setClearInput(e.target.value)}
                  placeholder="DELETE"
                  className="px-2.5 py-1 text-xs font-mono rounded border border-red-500/40 bg-paper-surface text-paper-text focus:outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={handleClearAll}
                  disabled={clearInput.trim().toUpperCase() !== "DELETE"}
                  className="py-1 px-3 text-xs rounded bg-red-600 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
                >
                  Confirm Reset
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmClearOpen(false);
                    setClearInput("");
                  }}
                  className="py-1 px-2.5 text-xs text-paper-muted hover:text-paper-text transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
