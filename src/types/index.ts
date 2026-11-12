export interface DailyPlan {
  id: string;
  localDate: string; // YYYY-MM-DD
  journalText: string;
  createdAt: string; // ISO 8601 UTC
  updatedAt: string; // ISO 8601 UTC
}

export interface Priority {
  id: string;
  planId: string;
  title: string;
  position: number;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type FocusSessionStatus =
  | "running"
  | "paused"
  | "completed"
  | "abandoned";

export interface FocusSession {
  id: string;
  priorityId: string;
  startedAt: string;
  endedAt: string | null;
  plannedDurationSeconds: number;
  accumulatedFocusSeconds: number;
  pausedAt: string | null;
  status: FocusSessionStatus;
  createdAt: string;
  updatedAt: string;
}

export type ThemePreference = "system" | "light" | "dark";

export interface UserPreferences {
  theme: ThemePreference;
  defaultFocusDurationSeconds: number;
  shortBreakDurationSeconds: number;
  schemaVersion: number;
}

