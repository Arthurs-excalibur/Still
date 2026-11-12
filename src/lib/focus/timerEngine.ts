import type { FocusSession, FocusSessionStatus } from "@/types";

/**
 * Pure functions for calculation of focus elapsed and remaining time.
 * Timestamp-based to prevent timer drift from background tab throttling or system sleep.
 */

export function calculateElapsedSeconds(
  session: FocusSession,
  nowUtcMs: number = Date.now()
): number {
  let elapsed = session.accumulatedFocusSeconds;

  if (session.status === "running") {
    const periodStart = session.pausedAt
      ? new Date(session.pausedAt).getTime()
      : new Date(session.startedAt).getTime();

    const diffSeconds = Math.max(0, Math.floor((nowUtcMs - periodStart) / 1000));
    elapsed += diffSeconds;
  }

  return Math.min(session.plannedDurationSeconds, elapsed);
}

export function calculateRemainingSeconds(
  session: FocusSession,
  nowUtcMs: number = Date.now()
): number {
  const elapsed = calculateElapsedSeconds(session, nowUtcMs);
  return Math.max(0, session.plannedDurationSeconds - elapsed);
}

export function formatTimeDisplay(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function createNewSession(
  priorityId: string,
  durationSeconds: number = 25 * 60
): FocusSession {
  const now = new Date().toISOString();
  return {
    id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    priorityId,
    startedAt: now,
    endedAt: null,
    plannedDurationSeconds: durationSeconds,
    accumulatedFocusSeconds: 0,
    pausedAt: null,
    status: "running",
    createdAt: now,
    updatedAt: now,
  };
}

export function pauseSessionState(
  session: FocusSession,
  nowUtcMs: number = Date.now()
): FocusSession {
  if (session.status !== "running") return session;

  const now = new Date(nowUtcMs).toISOString();
  const currentElapsed = calculateElapsedSeconds(session, nowUtcMs);

  return {
    ...session,
    status: "paused",
    pausedAt: now,
    accumulatedFocusSeconds: currentElapsed,
    updatedAt: now,
  };
}

export function resumeSessionState(
  session: FocusSession,
  nowUtcMs: number = Date.now()
): FocusSession {
  if (session.status !== "paused") return session;

  const now = new Date(nowUtcMs).toISOString();

  return {
    ...session,
    status: "running",
    startedAt: now, // New active window start
    pausedAt: null,
    updatedAt: now,
  };
}

export function completeSessionState(
  session: FocusSession,
  nowUtcMs: number = Date.now()
): FocusSession {
  const now = new Date(nowUtcMs).toISOString();
  return {
    ...session,
    status: "completed",
    endedAt: now,
    accumulatedFocusSeconds: session.plannedDurationSeconds,
    pausedAt: null,
    updatedAt: now,
  };
}

export function abandonSessionState(
  session: FocusSession,
  nowUtcMs: number = Date.now()
): FocusSession {
  const now = new Date(nowUtcMs).toISOString();
  const currentElapsed = calculateElapsedSeconds(session, nowUtcMs);

  return {
    ...session,
    status: "abandoned",
    endedAt: now,
    accumulatedFocusSeconds: currentElapsed,
    pausedAt: null,
    updatedAt: now,
  };
}

