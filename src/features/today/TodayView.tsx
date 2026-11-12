"use client";

import React, { useState, useEffect } from "react";
import { Check, Play, ChevronLeft, ChevronRight, RotateCcw, Clock } from "lucide-react";
import { useDailyPlan } from "@/features/daily-plans/useDailyPlan";
import { useFocus } from "@/features/focus/FocusContext";
import { formatTimeDisplay } from "@/lib/focus/timerEngine";
import {
  getLocalDateString,
  addDays,
  formatEditorialDate,
  isToday,
} from "@/lib/dates";

export function TodayView() {
  const [currentDate, setCurrentDate] = useState<string>(() => getLocalDateString());

  const {
    priorities,
    journalText,
    saveState,
    loading,
    setPriorityTitle,
    togglePriorityCompleted,
    handleJournalChange,
  } = useDailyPlan(currentDate);

  const {
    session,
    activePriority,
    remainingSeconds,
    isFocusModeOpen,
    startFocus,
    setIsFocusModeOpen,
  } = useFocus();

  const completedCount = priorities.filter((p) => p.completedAt && p.title.trim()).length;
  const filledCount = priorities.filter((p) => p.title.trim()).length;

  const handlePrevDay = () => setCurrentDate((prev) => addDays(prev, -1));
  const handleNextDay = () => setCurrentDate((prev) => addDays(prev, 1));
  const handleJumpToday = () => setCurrentDate(getLocalDateString());

  const formattedDate = formatEditorialDate(currentDate);
  const viewingToday = isToday(currentDate);

  // Allow query param ?view=focus or ?focus=1 for verification
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      if (p.get("focus") === "1" || p.get("view") === "focus") {
        const taskName = p.get("task") || "Draft application specifications";
        startFocus({
          id: "p_preview",
          planId: `plan_${currentDate}`,
          title: taskName,
          position: 1,
          completedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    } catch {}
  }, [startFocus, currentDate]);

  const currentFocusedPriority =
    priorities.find((p) => p.id === session?.priorityId) || activePriority;

  return (
    <main className="flex-1 flex flex-col space-y-8 sm:space-y-12">
      {/* Active Session Minimized Banner */}
      {session && !isFocusModeOpen && (
        <div className="flex items-center justify-between p-3.5 bg-paper-surface border border-paper-border rounded text-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-paper-text animate-pulse" />
            <span className="text-paper-text font-medium">
              Focus Session: {formatTimeDisplay(remainingSeconds)}
            </span>
            <span className="text-xs text-paper-muted hidden sm:inline">
              ({currentFocusedPriority?.title || "Task"})
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsFocusModeOpen(true)}
            className="text-xs font-medium text-paper-text hover:underline px-2.5 py-1 bg-paper border border-paper-border rounded"
          >
            Open Focus Mode
          </button>
        </div>
      )}

      {/* Date Header with quiet navigation */}
      <section aria-labelledby="today-date-heading" className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevDay}
              className="p-1 -ml-1 text-paper-muted hover:text-paper-text transition-colors rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper-text/40"
              aria-label="Previous day"
              title="Previous day"
            >
              <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
            </button>

            <h1
              id="today-date-heading"
              className="text-2xl sm:text-3xl font-serif tracking-tight text-paper-text select-none"
            >
              {formattedDate}
            </h1>

            <button
              type="button"
              onClick={handleNextDay}
              className="p-1 text-paper-muted hover:text-paper-text transition-colors rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper-text/40"
              aria-label="Next day"
              title="Next day"
            >
              <ChevronRight className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {!viewingToday && (
            <button
              type="button"
              onClick={handleJumpToday}
              className="flex items-center gap-1 text-xs text-paper-muted hover:text-paper-text transition-colors py-1 px-2 border border-paper-border rounded"
              title="Return to today"
            >
              <RotateCcw className="w-3 h-3 stroke-[1.5]" />
              <span>Today</span>
            </button>
          )}
        </div>

        <p className="text-xs sm:text-sm text-paper-muted">
          {loading
            ? "Loading plan..."
            : filledCount === 0
            ? "Three priorities for this day."
            : `${completedCount} of ${filledCount} completed.`}
        </p>
      </section>

      {/* Priorities Section (Cap = 3 enforced) */}
      <section aria-labelledby="priorities-heading" className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between text-xs text-paper-muted">
          <h2
            id="priorities-heading"
            className="uppercase tracking-widest font-medium"
          >
            Daily Priorities (Max 3)
          </h2>
          <span className="font-serif italic hidden xs:inline sm:inline">
            Focus on one at a time
          </span>
        </div>

        <div className="divide-y divide-paper-border/70 border-y border-paper-border/70">
          {priorities.map((item) => {
            const isCompleted = Boolean(item.completedAt);
            const isFilled = Boolean(item.title.trim());

            return (
              <div
                key={item.position}
                className="py-3 flex items-center gap-2.5 sm:gap-4 group transition-colors"
              >
                {/* Position Numeral */}
                <span className="text-xs font-serif text-paper-muted w-3.5 sm:w-4 select-none shrink-0">
                  0{item.position}
                </span>

                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() => togglePriorityCompleted(item.position)}
                  disabled={!isFilled}
                  className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper-text/40 ${
                    isCompleted
                      ? "bg-paper-text border-paper-text text-paper"
                      : isFilled
                      ? "border-paper-muted/60 hover:border-paper-text cursor-pointer"
                      : "border-paper-border opacity-40 cursor-not-allowed"
                  }`}
                  aria-label={`Mark priority ${item.position} as ${
                    isCompleted ? "incomplete" : "complete"
                  }`}
                >
                  {isCompleted && <Check className="w-2.5 h-2.5 stroke-[2.5]" />}
                </button>

                {/* Priority Input */}
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => setPriorityTitle(item.position, e.target.value)}
                    placeholder={`Priority ${item.position} — what needs your focus?`}
                    maxLength={120}
                    className={`w-full bg-transparent border-0 p-0 text-sm sm:text-base text-paper-text placeholder:text-paper-muted/60 focus:ring-0 focus:outline-none ${
                      isCompleted ? "line-through text-paper-muted" : ""
                    }`}
                  />
                </div>

                {/* Focus Trigger Button */}
                <button
                  type="button"
                  onClick={() => startFocus(item)}
                  disabled={!isFilled}
                  className={`shrink-0 flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs rounded border transition-all ${
                    isFilled
                      ? "text-paper-text border-paper-border hover:bg-paper-surface cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper-text/40"
                      : "text-paper-muted border-paper-border/60 opacity-40 cursor-not-allowed"
                  }`}
                  title={isFilled ? `Start focus session for Priority ${item.position}` : "Add task title first"}
                  aria-label={`Start focus session for Priority ${item.position}`}
                >
                  <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[1.5]" />
                  <span className="hidden sm:inline">Focus</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Daily Journal Section */}
      <section aria-labelledby="journal-heading" className="space-y-3 pt-2 sm:pt-4">
        <div className="flex items-center justify-between text-xs text-paper-muted">
          <h2
            id="journal-heading"
            className="uppercase tracking-widest font-medium"
          >
            Daily Journal
          </h2>
          <div className="flex items-center gap-2">
            <span>
              {journalText.trim()
                ? `${journalText.trim().split(/\s+/).length} words`
                : "Private & offline"}
            </span>
            <span aria-hidden="true">·</span>
            <span
              className={`transition-opacity ${
                saveState === "saving"
                  ? "text-paper-text animate-pulse"
                  : saveState === "saved"
                  ? "text-paper-muted"
                  : saveState === "error"
                  ? "text-red-500"
                  : "text-paper-muted/70"
              }`}
            >
              {saveState === "saving"
                ? "Saving..."
                : saveState === "saved"
                ? "Saved to device"
                : saveState === "error"
                ? "Failed to save"
                : "Saved locally"}
            </span>
          </div>
        </div>

        <div className="rounded border border-paper-border/80 bg-paper-surface/30 p-3 sm:p-4 focus-within:border-paper-muted transition-colors">
          <textarea
            value={journalText}
            onChange={(e) => handleJournalChange(e.target.value)}
            rows={5}
            placeholder="Write freely. Notes, reflections, or closing thoughts for today stay only on this device..."
            className="w-full bg-transparent border-0 p-0 text-sm sm:text-base text-paper-text placeholder:text-paper-muted/60 resize-y focus:ring-0 focus:outline-none leading-relaxed font-sans"
            aria-label="Daily journal notes"
          />
        </div>
      </section>
    </main>
  );
}
