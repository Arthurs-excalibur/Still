/**
 * Domain self-check script for Still.
 * Tests date calculation and priority cap rules without external test runners.
 */

const assert = require("assert");

// 1. Test local date string representation
function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDateString(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(dateStr, days) {
  const date = parseLocalDateString(dateStr);
  date.setDate(date.getDate() + days);
  return getLocalDateString(date);
}

// Check standard date addition across month boundary
assert.strictEqual(addDays("2026-01-31", 1), "2026-02-01", "Month boundary addition failed");
assert.strictEqual(addDays("2026-03-01", -1), "2026-02-28", "Leap/non-leap day deduction failed");
assert.strictEqual(addDays("2026-12-31", 1), "2027-01-01", "Year boundary addition failed");

// 2. Test 3-priority cap rule logic
function enforceMaxThree(existingCount, isNew) {
  if (isNew && existingCount >= 3) {
    throw new Error("Plan already has the maximum of three priorities");
  }
  return true;
}

assert.strictEqual(enforceMaxThree(0, true), true);
assert.strictEqual(enforceMaxThree(2, true), true);
assert.strictEqual(enforceMaxThree(3, false), true); // Updating existing is allowed
assert.throws(() => enforceMaxThree(3, true), /maximum of three priorities/);

console.log("All domain assert tests passed successfully!");

