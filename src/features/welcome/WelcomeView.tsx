"use client";

import React, { useState } from "react";
import { ArrowRight, Sparkles, Check } from "lucide-react";

interface WelcomeViewProps {
  onBegin: () => void;
}

export function WelcomeView({ onBegin }: WelcomeViewProps) {
  const [showPhilosophy, setShowPhilosophy] = useState(false);

  return (
    <main className="flex-1 flex flex-col justify-center items-center py-6 sm:py-16 animate-fade-in text-center max-w-2xl mx-auto px-2">
      {/* Pill badge matching reference: "A quieter way to work" */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-paper-border/80 bg-paper-surface/60 text-paper-muted text-xs font-mono mb-6 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0" />
        <span>A quieter way to work</span>
      </div>

      {/* Hero Headline from reference */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif tracking-tight text-paper-text leading-[1.12] mb-6">
        Productivity without <br className="hidden sm:inline" />
        <span className="italic font-serif font-normal">the noise</span>
      </h1>

      {/* Subheading */}
      <p className="text-sm sm:text-base text-paper-muted leading-relaxed font-sans max-w-xl mx-auto mb-8">
        Still is a mindful productivity tool designed for those who believe the best work happens
        in calm, not chaos. Plan up to three priorities, write an honest reflection, and focus on what matters.
      </p>

      {/* Call to Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
        <button
          type="button"
          onClick={onBegin}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-paper-text text-paper font-medium text-xs sm:text-sm shadow-sm hover:opacity-90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper-text/40"
        >
          <span>Begin today</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
        </button>

        <button
          type="button"
          onClick={() => setShowPhilosophy(!showPhilosophy)}
          className="text-xs sm:text-sm text-paper-muted hover:text-paper-text transition-colors py-2 px-3 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper-text/40 underline-offset-4 hover:underline"
        >
          {showPhilosophy ? "Hide principles" : "Learn our philosophy"}
        </button>
      </div>

      {/* Expandable Philosophy Section */}
      {showPhilosophy && (
        <section
          aria-label="Philosophy"
          className="mt-10 p-6 rounded border border-paper-border/80 bg-paper-surface/50 text-left space-y-4 animate-fade-in w-full text-xs sm:text-sm"
        >
          <div className="space-y-3 divide-y divide-paper-border/60">
            <div className="pt-2 first:pt-0 space-y-1">
              <span className="font-serif font-medium text-paper-text">01. Three priorities only</span>
              <p className="text-paper-muted leading-relaxed">
                Infinite backlogs breed anxiety. Restricting yourself to three daily outcomes creates clarity on what truly moves your day forward.
              </p>
            </div>
            <div className="pt-3 space-y-1">
              <span className="font-serif font-medium text-paper-text">02. Single-task focus</span>
              <p className="text-paper-muted leading-relaxed">
                When you initiate a session, the rest of the workspace disappears. One timer, one priority, zero clutter.
              </p>
            </div>
            <div className="pt-3 space-y-1">
              <span className="font-serif font-medium text-paper-text">03. Local &amp; sovereign</span>
              <p className="text-paper-muted leading-relaxed">
                Your daily entries, thoughts, and reflections belong to you. Everything is stored locally in your browser&apos;s IndexedDB. No accounts, no telemetry, no cloud sync.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Bottom subtle anchor */}
      <div className="mt-12 sm:mt-16 pt-4 border-t border-paper-border/40 w-full flex items-center justify-center gap-6 text-[11px] font-mono text-paper-muted/80">
        <span>No accounts needed</span>
        <span>·</span>
        <span>Local-first storage</span>
        <span>·</span>
        <span>Zero tracking</span>
      </div>
    </main>
  );
}
