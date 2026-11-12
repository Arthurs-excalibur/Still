"use client";

import React from "react";
import type { FocusSession } from "@/types";
import { formatTimeDisplay } from "@/lib/focus/timerEngine";
import { Play, Pause, X, Check } from "lucide-react";

interface FocusModeViewProps {
  session: FocusSession;
  priorityTitle: string;
  remainingSeconds: number;
  onPause: () => void;
  onResume: () => void;
  onAbandon: () => void;
  onFinish: (markPriorityComplete: boolean) => void;
  onMinimize: () => void;
}

export function FocusModeView({
  session,
  priorityTitle,
  remainingSeconds,
  onPause,
  onResume,
  onAbandon,
  onFinish,
  onMinimize,
}: FocusModeViewProps) {
  const isRunning = session.status === "running";
  const isPaused = session.status === "paused";
  const isCompleted = session.status === "completed" || remainingSeconds <= 0;

  const displayTime = formatTimeDisplay(remainingSeconds);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Distraction-free focus session"
      className="min-h-screen w-full max-w-full overflow-x-hidden bg-paper text-paper-text flex flex-col justify-between p-4 sm:p-12 animate-fade-in selection:bg-paper-border selection:text-paper-text box-border"
    >
      {/* Top minimal bar */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-between shrink-0 min-w-0">
        <span className="text-xs sm:text-sm font-serif tracking-tight text-paper-muted select-none truncate">
          Still · Focus Mode
        </span>

        <button
          type="button"
          onClick={onMinimize}
          className="p-1 sm:p-1.5 text-paper-muted hover:text-paper-text transition-colors rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper-text/40 shrink-0"
          title="Minimize to workspace"
          aria-label="Minimize focus mode"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
        </button>
      </div>

      {/* Main Focus Center */}
      <div className="w-full max-w-md mx-auto my-auto flex flex-col items-center text-center space-y-6 sm:space-y-8 px-2 min-w-0 box-border">
        {/* Selected Priority Title */}
        <div className="space-y-1.5 sm:space-y-2 w-full min-w-0">
          <p className="text-[11px] sm:text-xs uppercase tracking-widest text-paper-muted font-medium">
            Current Priority
          </p>
          <h2 className="text-lg sm:text-3xl font-serif text-paper-text leading-snug break-words max-w-full">
            {priorityTitle || "Focused priority"}
          </h2>
        </div>

        {/* Large Countdown Display */}
        <div className="py-2 sm:py-4 w-full min-w-0" aria-live="off" aria-atomic="true">
          <span className="text-6xl sm:text-8xl font-serif tracking-tight tabular-nums text-paper-text select-none block max-w-full" aria-label={`Remaining time: ${displayTime}`}>
            {displayTime}
          </span>
        </div>

        {/* Status text */}
        <p className="text-xs sm:text-sm text-paper-muted font-serif italic max-w-full break-words" role="status" aria-live="polite">
          {isCompleted
            ? "Session finished. Take a breath."
            : isPaused
            ? "Session paused"
            : "Stay with this single task"}
        </p>

        {/* Controls */}
        <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-full min-w-0">
          {isCompleted ? (
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full min-w-0">
              <button
                type="button"
                onClick={() => onFinish(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-paper-text text-paper rounded text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper-text/40 shadow-sm"
              >
                <Check className="w-3.5 h-3.5 stroke-[2]" />
                <span>Mark complete &amp; return</span>
              </button>

              <button
                type="button"
                onClick={() => onFinish(false)}
                className="w-full sm:w-auto px-4 py-2.5 border border-paper-border text-paper-muted hover:text-paper-text rounded text-xs sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper-text/40"
              >
                Return to Today
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full min-w-0">
              {isRunning && (
                <button
                  type="button"
                  onClick={onPause}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-paper-surface hover:bg-paper-hover border border-paper-border rounded text-xs sm:text-sm font-medium text-paper-text transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper-text/40"
                >
                  <Pause className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>Pause</span>
                </button>
              )}

              {isPaused && (
                <button
                  type="button"
                  onClick={onResume}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-paper-text text-paper hover:opacity-90 rounded text-xs sm:text-sm font-medium transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper-text/40 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>Resume</span>
                </button>
              )}

              <button
                type="button"
                onClick={onAbandon}
                className="px-3 py-2 text-xs sm:text-sm text-paper-muted hover:text-paper-text transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper-text/40"
              >
                End session early
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom hint */}
      <div className="w-full max-w-xl mx-auto text-center shrink-0 min-w-0 px-2">
        <p className="text-[11px] sm:text-xs text-paper-muted/60 leading-relaxed break-words max-w-full">
          Distraction-free environment. Other priorities and navigation are quieted.
        </p>
      </div>
    </div>
  );
}
