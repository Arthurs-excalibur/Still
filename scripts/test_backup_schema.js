const assert = require("assert");

// Mock backup schema validation test
function validateBackup(data) {
  if (!data || typeof data !== "object") return false;
  if (!Array.isArray(data.plans)) return false;
  if (!Array.isArray(data.priorities)) return false;
  if (!Array.isArray(data.focusSessions)) return false;
  if (typeof data.preferences !== "object") return false;
  return true;
}

const validSample = {
  version: 1,
  exportedAt: new Date().toISOString(),
  plans: [{ id: "p1", localDate: "2026-11-12", journalText: "Calm evening.", createdAt: "", updatedAt: "" }],
  priorities: [{ id: "pr1", planId: "p1", title: "Write code", position: 0, completedAt: null, createdAt: "", updatedAt: "" }],
  focusSessions: [],
  preferences: { theme: "light", defaultFocusDurationSeconds: 1500, shortBreakDurationSeconds: 300, schemaVersion: 1 }
};

assert.strictEqual(validateBackup(validSample), true, "Valid backup should pass");
assert.strictEqual(validateBackup(null), false, "Null backup should fail");
assert.strictEqual(validateBackup({ plans: [] }), false, "Missing priorities should fail");
assert.strictEqual(validateBackup("not an object"), false, "Primitive should fail");

console.log("Backup export/import schema assertions passed!");

