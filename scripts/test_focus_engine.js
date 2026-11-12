const assert = require("assert");

// Import/recreate focus calculation logic for standalone test
function calculateElapsedSeconds(session, nowUtcMs) {
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

function calculateRemainingSeconds(session, nowUtcMs) {
  const elapsed = calculateElapsedSeconds(session, nowUtcMs);
  return Math.max(0, session.plannedDurationSeconds - elapsed);
}

const startTime = 1000000;
const plannedDuration = 25 * 60; // 1500s

// 1. Initial running session
const session = {
  id: "s1",
  priorityId: "p1",
  startedAt: new Date(startTime).toISOString(),
  endedAt: null,
  plannedDurationSeconds: plannedDuration,
  accumulatedFocusSeconds: 0,
  pausedAt: null,
  status: "running",
  createdAt: new Date(startTime).toISOString(),
  updatedAt: new Date(startTime).toISOString(),
};

// Check at 10 seconds later
assert.strictEqual(calculateElapsedSeconds(session, startTime + 10000), 10);
assert.strictEqual(calculateRemainingSeconds(session, startTime + 10000), 1490);

// Check simulated system sleep / background tab of 300 seconds
assert.strictEqual(calculateElapsedSeconds(session, startTime + 300000), 300);
assert.strictEqual(calculateRemainingSeconds(session, startTime + 300000), 1200);

// 2. Pause session at 300s
const pausedSession = {
  ...session,
  status: "paused",
  pausedAt: new Date(startTime + 300000).toISOString(),
  accumulatedFocusSeconds: 300,
};

// Check elapsed stays at 300 during pause
assert.strictEqual(calculateElapsedSeconds(pausedSession, startTime + 600000), 300);
assert.strictEqual(calculateRemainingSeconds(pausedSession, startTime + 600000), 1200);

// 3. Resume session after 10 minutes of pause (at t = 900s)
const resumedSession = {
  ...pausedSession,
  status: "running",
  startedAt: new Date(startTime + 900000).toISOString(),
  pausedAt: null,
};

// Check 50s after resume (t = 950s total wall clock)
// active focus should be 300 + 50 = 350s
assert.strictEqual(calculateElapsedSeconds(resumedSession, startTime + 950000), 350);
assert.strictEqual(calculateRemainingSeconds(resumedSession, startTime + 950000), 1150);

// 4. Check expiration clamp
assert.strictEqual(calculateElapsedSeconds(resumedSession, startTime + 9999999), 1500);
assert.strictEqual(calculateRemainingSeconds(resumedSession, startTime + 9999999), 0);

console.log("Focus engine domain assert tests passed successfully!");

