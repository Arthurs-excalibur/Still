"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { FocusSession, Priority } from "@/types";
import {
  calculateRemainingSeconds,
  createNewSession,
  pauseSessionState,
  resumeSessionState,
  completeSessionState,
  abandonSessionState,
} from "@/lib/focus/timerEngine";
import {
  saveFocusSession,
  getActiveFocusSession,
  getUserPreferences,
} from "@/lib/database/db";

export function useFocusSession() {
  const [session, setSession] = useState<FocusSession | null>(null);
  const [activePriority, setActivePriority] = useState<Priority | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);

  const sessionRef = useRef<FocusSession | null>(null);
  sessionRef.current = session;

  // On mount: check IndexedDB for any running or paused session to restore
  useEffect(() => {
    let mounted = true;
    async function restoreActive() {
      try {
        const active = await getActiveFocusSession();
        if (active && mounted) {
          const remaining = calculateRemainingSeconds(active);
          if (remaining <= 0 && active.status === "running") {
            const completed = completeSessionState(active);
            await saveFocusSession(completed);
            setSession(completed);
            setRemainingSeconds(0);
          } else {
            setSession(active);
            setRemainingSeconds(remaining);
            setIsFocusModeOpen(true);
          }
        }
      } catch (err) {
        console.error("Failed to restore focus session:", err);
      }
    }

    restoreActive();
    return () => {
      mounted = false;
    };
  }, []);

  // Ticker and visibility change handling
  useEffect(() => {
    if (!session || session.status !== "running") return;

    const tick = () => {
      const cur = sessionRef.current;
      if (!cur || cur.status !== "running") return;

      const remaining = calculateRemainingSeconds(cur);
      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        const completed = completeSessionState(cur);
        setSession(completed);
        saveFocusSession(completed).catch(console.error);
      }
    };

    tick();
    const intervalId = setInterval(tick, 1000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        tick();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [session?.status]);

  // Start new focus session
  const startFocus = useCallback(
    async (priority: Priority, durationMinutes?: number) => {
      let durationSec = 25 * 60;
      if (typeof durationMinutes === "number" && durationMinutes > 0) {
        durationSec = durationMinutes * 60;
      } else {
        try {
          const prefs = await getUserPreferences();
          if (prefs?.defaultFocusDurationSeconds) {
            durationSec = prefs.defaultFocusDurationSeconds;
          }
        } catch {
          // fallback default
        }
      }

      const newSession = createNewSession(priority.id, durationSec);
      setActivePriority(priority);
      setSession(newSession);
      setRemainingSeconds(newSession.plannedDurationSeconds);
      setIsFocusModeOpen(true);
      await saveFocusSession(newSession);
    },
    []
  );

  // Pause session
  const pauseFocus = useCallback(async () => {
    if (!sessionRef.current || sessionRef.current.status !== "running") return;
    const paused = pauseSessionState(sessionRef.current);
    setSession(paused);
    setRemainingSeconds(calculateRemainingSeconds(paused));
    await saveFocusSession(paused);
  }, []);

  // Resume session
  const resumeFocus = useCallback(async () => {
    if (!sessionRef.current || sessionRef.current.status !== "paused") return;
    const resumed = resumeSessionState(sessionRef.current);
    setSession(resumed);
    setRemainingSeconds(calculateRemainingSeconds(resumed));
    await saveFocusSession(resumed);
  }, []);

  // Abandon session early
  const abandonFocus = useCallback(async () => {
    if (!sessionRef.current) {
      setIsFocusModeOpen(false);
      return;
    }
    const abandoned = abandonSessionState(sessionRef.current);
    await saveFocusSession(abandoned);
    setSession(null);
    setIsFocusModeOpen(false);
  }, []);

  // Complete and exit
  const finishFocus = useCallback(async () => {
    if (sessionRef.current && sessionRef.current.status !== "completed") {
      const completed = completeSessionState(sessionRef.current);
      await saveFocusSession(completed);
    }
    setSession(null);
    setIsFocusModeOpen(false);
  }, []);

  return {
    session,
    activePriority,
    remainingSeconds,
    isFocusModeOpen,
    startFocus,
    pauseFocus,
    resumeFocus,
    abandonFocus,
    finishFocus,
    setIsFocusModeOpen,
  };
}

