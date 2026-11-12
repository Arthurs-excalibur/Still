import type { DailyPlan, Priority, FocusSession, UserPreferences } from "@/types";

const DB_NAME = "still_db";
const DB_VERSION = 1;

const STORES = {
  PLANS: "daily_plans",
  PRIORITIES: "priorities",
  FOCUS_SESSIONS: "focus_sessions",
  PREFERENCES: "preferences",
} as const;

let dbPromise: Promise<IDBDatabase> | null = null;

export function getDB(): Promise<IDBDatabase> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("IndexedDB is only accessible in browser"));
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 1. Daily plans
      if (!db.objectStoreNames.contains(STORES.PLANS)) {
        const planStore = db.createObjectStore(STORES.PLANS, { keyPath: "id" });
        planStore.createIndex("localDate", "localDate", { unique: true });
      }

      // 2. Priorities
      if (!db.objectStoreNames.contains(STORES.PRIORITIES)) {
        const priorityStore = db.createObjectStore(STORES.PRIORITIES, { keyPath: "id" });
        priorityStore.createIndex("planId", "planId", { unique: false });
        priorityStore.createIndex("planId_position", ["planId", "position"], { unique: false });
      }

      // 3. Focus sessions
      if (!db.objectStoreNames.contains(STORES.FOCUS_SESSIONS)) {
        const sessionStore = db.createObjectStore(STORES.FOCUS_SESSIONS, { keyPath: "id" });
        sessionStore.createIndex("priorityId", "priorityId", { unique: false });
        sessionStore.createIndex("status", "status", { unique: false });
      }

      // 4. Preferences
      if (!db.objectStoreNames.contains(STORES.PREFERENCES)) {
        db.createObjectStore(STORES.PREFERENCES, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

// -------------------------------------------------------------
// Daily Plan Repository
// -------------------------------------------------------------

export async function getPlanByDate(localDate: string): Promise<DailyPlan | null> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.PLANS, "readonly");
    const store = tx.objectStore(STORES.PLANS);
    const index = store.index("localDate");
    const request = index.get(localDate);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function savePlan(plan: DailyPlan): Promise<DailyPlan> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.PLANS, "readwrite");
    const store = tx.objectStore(STORES.PLANS);
    const request = store.put(plan);

    request.onsuccess = () => resolve(plan);
    request.onerror = () => reject(request.error);
  });
}

export async function updateJournalText(planId: string, journalText: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.PLANS, "readwrite");
    const store = tx.objectStore(STORES.PLANS);
    const getReq = store.get(planId);

    getReq.onsuccess = () => {
      const plan = getReq.result as DailyPlan | undefined;
      if (!plan) {
        reject(new Error(`DailyPlan not found: ${planId}`));
        return;
      }
      plan.journalText = journalText;
      plan.updatedAt = new Date().toISOString();
      const putReq = store.put(plan);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

export async function getAllPlans(): Promise<DailyPlan[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.PLANS, "readonly");
    const store = tx.objectStore(STORES.PLANS);
    const request = store.getAll();

    request.onsuccess = () => {
      const plans = (request.result || []) as DailyPlan[];
      // Chronological sort
      plans.sort((a, b) => a.localDate.localeCompare(b.localDate));
      resolve(plans);
    };
    request.onerror = () => reject(request.error);
  });
}

// -------------------------------------------------------------
// Priority Repository (Cap = 3 enforced)
// -------------------------------------------------------------

export async function getPrioritiesForPlan(planId: string): Promise<Priority[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.PRIORITIES, "readonly");
    const store = tx.objectStore(STORES.PRIORITIES);
    const index = store.index("planId");
    const request = index.getAll(planId);

    request.onsuccess = () => {
      const items = (request.result || []) as Priority[];
      items.sort((a, b) => a.position - b.position);
      resolve(items.slice(0, 3)); // Strict guarantee: max 3
    };
    request.onerror = () => reject(request.error);
  });
}

export async function savePriority(priority: Priority): Promise<Priority> {
  const db = await getDB();
  const existing = await getPrioritiesForPlan(priority.planId);

  // If this is a new priority, verify cap
  const isExisting = existing.some((p) => p.id === priority.id);
  if (!isExisting && existing.length >= 3) {
    throw new Error("Plan already has the maximum of three priorities");
  }

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.PRIORITIES, "readwrite");
    const store = tx.objectStore(STORES.PRIORITIES);
    const request = store.put(priority);

    request.onsuccess = () => resolve(priority);
    request.onerror = () => reject(request.error);
  });
}

export async function deletePriority(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.PRIORITIES, "readwrite");
    const store = tx.objectStore(STORES.PRIORITIES);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// -------------------------------------------------------------
// Focus Session Repository
// -------------------------------------------------------------

export async function saveFocusSession(session: FocusSession): Promise<FocusSession> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.FOCUS_SESSIONS, "readwrite");
    const store = tx.objectStore(STORES.FOCUS_SESSIONS);
    const request = store.put(session);

    request.onsuccess = () => resolve(session);
    request.onerror = () => reject(request.error);
  });
}

export async function getActiveFocusSession(): Promise<FocusSession | null> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.FOCUS_SESSIONS, "readonly");
    const store = tx.objectStore(STORES.FOCUS_SESSIONS);
    const request = store.getAll();

    request.onsuccess = () => {
      const all = (request.result || []) as FocusSession[];
      // Find session that is still running or paused
      const active = all.find((s) => s.status === "running" || s.status === "paused");
      resolve(active || null);
    };
    request.onerror = () => reject(request.error);
  });
}

// -------------------------------------------------------------
// Preferences Repository
// -------------------------------------------------------------

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "system",
  defaultFocusDurationSeconds: 25 * 60,
  shortBreakDurationSeconds: 5 * 60,
  schemaVersion: 1,
};

export async function getUserPreferences(): Promise<UserPreferences> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.PREFERENCES, "readonly");
    const store = tx.objectStore(STORES.PREFERENCES);
    const request = store.get("user_preferences");

    request.onsuccess = () => {
      if (request.result && request.result.value) {
        resolve({ ...DEFAULT_PREFERENCES, ...request.result.value });
      } else {
        resolve(DEFAULT_PREFERENCES);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

export async function saveUserPreferences(prefs: Partial<UserPreferences>): Promise<UserPreferences> {
  const current = await getUserPreferences();
  const updated: UserPreferences = { ...current, ...prefs };
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.PREFERENCES, "readwrite");
    const store = tx.objectStore(STORES.PREFERENCES);
    const request = store.put({ key: "user_preferences", value: updated });

    request.onsuccess = () => resolve(updated);
    request.onerror = () => reject(request.error);
  });
}

// -------------------------------------------------------------
// Full Database Export, Import & Reset
// -------------------------------------------------------------

export interface StillBackupData {
  version: number;
  exportedAt: string;
  plans: DailyPlan[];
  priorities: Priority[];
  focusSessions: FocusSession[];
  preferences: UserPreferences;
}

export async function exportAllData(): Promise<StillBackupData> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(
      [STORES.PLANS, STORES.PRIORITIES, STORES.FOCUS_SESSIONS, STORES.PREFERENCES],
      "readonly"
    );
    const plansReq = tx.objectStore(STORES.PLANS).getAll();
    const prioritiesReq = tx.objectStore(STORES.PRIORITIES).getAll();
    const sessionsReq = tx.objectStore(STORES.FOCUS_SESSIONS).getAll();
    const prefsReq = tx.objectStore(STORES.PREFERENCES).get("user_preferences");

    tx.oncomplete = () => {
      resolve({
        version: 1,
        exportedAt: new Date().toISOString(),
        plans: (plansReq.result || []) as DailyPlan[],
        priorities: (prioritiesReq.result || []) as Priority[],
        focusSessions: (sessionsReq.result || []) as FocusSession[],
        preferences: prefsReq.result?.value || DEFAULT_PREFERENCES,
      });
    };
    tx.onerror = () => reject(tx.error);
  });
}

export async function importBackupData(data: StillBackupData): Promise<void> {
  if (!data || typeof data !== "object" || !Array.isArray(data.plans) || !Array.isArray(data.priorities)) {
    throw new Error("Invalid backup format: missing required plan or priority arrays.");
  }

  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(
      [STORES.PLANS, STORES.PRIORITIES, STORES.FOCUS_SESSIONS, STORES.PREFERENCES],
      "readwrite"
    );

    // Clear existing
    tx.objectStore(STORES.PLANS).clear();
    tx.objectStore(STORES.PRIORITIES).clear();
    tx.objectStore(STORES.FOCUS_SESSIONS).clear();

    const planStore = tx.objectStore(STORES.PLANS);
    for (const plan of data.plans) {
      if (plan.id && plan.localDate) {
        planStore.put(plan);
      }
    }

    const priorityStore = tx.objectStore(STORES.PRIORITIES);
    for (const prio of data.priorities) {
      if (prio.id && prio.planId) {
        priorityStore.put(prio);
      }
    }

    const sessionStore = tx.objectStore(STORES.FOCUS_SESSIONS);
    if (Array.isArray(data.focusSessions)) {
      for (const sess of data.focusSessions) {
        if (sess.id) {
          sessionStore.put(sess);
        }
      }
    }

    if (data.preferences) {
      tx.objectStore(STORES.PREFERENCES).put({
        key: "user_preferences",
        value: { ...DEFAULT_PREFERENCES, ...data.preferences },
      });
    }

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function clearAllData(): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(
      [STORES.PLANS, STORES.PRIORITIES, STORES.FOCUS_SESSIONS, STORES.PREFERENCES],
      "readwrite"
    );
    tx.objectStore(STORES.PLANS).clear();
    tx.objectStore(STORES.PRIORITIES).clear();
    tx.objectStore(STORES.FOCUS_SESSIONS).clear();
    tx.objectStore(STORES.PREFERENCES).clear();

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}



