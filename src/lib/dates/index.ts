/**
 * Date utilities for Still.
 * Enforces local timezone date representation (YYYY-MM-DD) without UTC midnight shifting.
 */

export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseLocalDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(dateStr: string, days: number): string {
  const date = parseLocalDateString(dateStr);
  date.setDate(date.getDate() + days);
  return getLocalDateString(date);
}

export function formatEditorialDate(dateStr: string): string {
  const date = parseLocalDateString(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function isToday(dateStr: string): boolean {
  return dateStr === getLocalDateString();
}

