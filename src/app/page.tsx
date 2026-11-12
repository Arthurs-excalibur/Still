"use client";

import React, { useState, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { Header, NavTab } from "@/components/layout/Header";
import { WelcomeView } from "@/features/welcome/WelcomeView";
import { TodayView } from "@/features/today/TodayView";
import { HistoryView } from "@/features/history/HistoryView";
import { SettingsView } from "@/features/settings/SettingsView";
import { FocusProvider, useFocus } from "@/features/focus/FocusContext";
import { FocusModeView } from "@/features/focus/FocusModeView";

const FIRST_VISIT_KEY = "still_first_visit_completed";

function MainApp() {
  const [currentTab, setCurrentTab] = useState<NavTab>("today");
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  const {
    session,
    activePriority,
    remainingSeconds,
    isFocusModeOpen,
    pauseFocus,
    resumeFocus,
    abandonFocus,
    finishFocus,
    setIsFocusModeOpen,
  } = useFocus();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get("view");
      const tabParam = params.get("tab") as NavTab | null;
      const themeParam = params.get("theme");

      if (themeParam === "dark") {
        document.documentElement.classList.add("dark");
      } else if (themeParam === "light") {
        document.documentElement.classList.remove("dark");
      }

      if (viewParam === "welcome") {
        setShowWelcome(true);
      } else if (viewParam === "today" || tabParam === "today" || viewParam === "focus") {
        setShowWelcome(false);
        setCurrentTab("today");
      } else if (tabParam === "history") {
        setShowWelcome(false);
        setCurrentTab("history");
      } else if (tabParam === "settings") {
        setShowWelcome(false);
        setCurrentTab("settings");
      } else {
        const hasVisited = localStorage.getItem(FIRST_VISIT_KEY);
        if (!hasVisited) {
          setShowWelcome(true);
        }
      }
    } catch {
      // LocalStorage access fallback
    }
    setMounted(true);
  }, []);

  const handleBegin = () => {
    try {
      localStorage.setItem(FIRST_VISIT_KEY, "true");
    } catch {
      // Storage fallback
    }
    setShowWelcome(false);
    setCurrentTab("today");
  };

  const handleOpenWelcome = () => {
    setShowWelcome(true);
  };

  const handleSelectTab = (tab: NavTab) => {
    setShowWelcome(false);
    setCurrentTab(tab);
  };

  if (!mounted) {
    return (
      <Shell>
        <div className="w-full flex items-center justify-between pb-8 mb-8 border-b border-paper-border/60">
          <span className="text-2xl font-serif tracking-tight text-paper-text">Still</span>
        </div>
        <div className="flex-1 flex flex-col justify-center py-12">
          <div className="space-y-4 max-w-prose opacity-40">
            <div className="h-8 bg-paper-border/60 rounded w-3/4" />
            <div className="h-4 bg-paper-border/40 rounded w-1/2" />
          </div>
        </div>
      </Shell>
    );
  }

  // Fullscreen distraction-free Focus Mode (replaces entire shell per PRD 7.4)
  if (isFocusModeOpen && session) {
    return (
      <FocusModeView
        session={session}
        priorityTitle={activePriority?.title || "Focused priority"}
        remainingSeconds={remainingSeconds}
        onPause={pauseFocus}
        onResume={resumeFocus}
        onAbandon={abandonFocus}
        onFinish={() => finishFocus()}
        onMinimize={() => setIsFocusModeOpen(false)}
      />
    );
  }

  return (
    <Shell>
      {!showWelcome && (
        <Header
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
        />
      )}

      {showWelcome ? (
        <WelcomeView onBegin={handleBegin} />
      ) : currentTab === "today" ? (
        <TodayView />
      ) : currentTab === "history" ? (
        <HistoryView />
      ) : (
        <SettingsView />
      )}
    </Shell>
  );
}

export default function Home() {
  return (
    <FocusProvider>
      <MainApp />
    </FocusProvider>
  );
}
