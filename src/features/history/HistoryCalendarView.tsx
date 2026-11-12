"use client";

import React, { useState } from "react";
import { getLocalDateString } from "@/lib/dates";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HistoryCalendarViewProps {
  loggedDates: Set<string>;
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
}

export function HistoryCalendarView({
  loggedDates,
  selectedDate,
  onSelectDate,
}: HistoryCalendarViewProps) {
  const [currentYear, setCurrentYear] = useState(() => {
    const parts = selectedDate.split("-").map(Number);
    return parts[0] || new Date().getFullYear();
  });
  const [currentMonth, setCurrentMonth] = useState(() => {
    const parts = selectedDate.split("-").map(Number);
    return (parts[1] ? parts[1] - 1 : new Date().getMonth());
  });

  const todayStr = getLocalDateString(new Date());

  // Month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];
  const weekdayShort = ["M", "T", "W", "T", "F", "S", "S"];

  // Selected date components for header
  const selDateObj = new Date(
    Number(selectedDate.split("-")[0]),
    Number(selectedDate.split("-")[1]) - 1,
    Number(selectedDate.split("-")[2])
  );
  const selDayNum = selDateObj.getDate();
  const selWeekdayName = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(selDateObj);

  // Compute days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // First day of month (0 = Sun, 1 = Mon ... 6 = Sat)
  // Convert so Monday = 0, Sunday = 6
  const rawFirstDay = new Date(currentYear, currentMonth, 1).getDay();
  const startOffset = (rawFirstDay + 6) % 7;

  // Build grid slots
  const slots: Array<{ day: number; dateStr: string } | null> = [];
  for (let i = 0; i < startOffset; i++) {
    slots.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const mStr = String(currentMonth + 1).padStart(2, "0");
    const dStr = String(d).padStart(2, "0");
    slots.push({
      day: d,
      dateStr: `${currentYear}-${mStr}-${dStr}`,
    });
  }

  return (
    <div className="w-full max-w-sm mx-auto sm:mx-0 p-6 sm:p-7 rounded border border-paper-border/80 bg-paper-surface/40 space-y-6">
      {/* Top Editorial Display (Reference style: Big day number, month/year, weekday) */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-5xl sm:text-6xl font-serif tracking-tight text-paper-text font-normal leading-none block">
            {selDayNum}
          </span>
          <div className="pt-2">
            <p className="text-xs font-mono uppercase tracking-widest text-paper-text font-medium">
              {monthNames[currentMonth]}
            </p>
            <p className="text-xs font-mono text-paper-muted">
              {currentYear}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between h-full space-y-4">
          <span className="text-sm font-serif text-paper-muted">
            {selWeekdayName}
          </span>
          <div className="flex items-center gap-1.5 pt-4">
            <button
              type="button"
              onClick={prevMonth}
              aria-label="Previous month"
              className="p-1 rounded text-paper-muted hover:text-paper-text hover:bg-paper-border/30 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper-text/40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              aria-label="Next month"
              className="p-1 rounded text-paper-muted hover:text-paper-text hover:bg-paper-border/30 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper-text/40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday headers (M T W T F S S) */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {weekdayShort.map((w, idx) => (
          <span
            key={idx}
            className="text-[11px] font-mono text-paper-muted select-none"
          >
            {w}
          </span>
        ))}
      </div>

      {/* Dot matrix grid */}
      <div className="grid grid-cols-7 gap-2.5 sm:gap-3 place-items-center">
        {slots.map((slot, index) => {
          if (!slot) {
            return (
              <div
                key={`empty-${index}`}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-paper-border/40 opacity-20"
                aria-hidden="true"
              />
            );
          }

          const isSelected = slot.dateStr === selectedDate;
          const isTodayDate = slot.dateStr === todayStr;
          const hasPlan = loggedDates.has(slot.dateStr);

          // Dot circle appearance matching reference:
          // solid charcoal circle for dates, subtle ring if no log, highlighted accent for selected
          return (
            <button
              key={slot.dateStr}
              type="button"
              onClick={() => onSelectDate(slot.dateStr)}
              className="relative group w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper-text/40"
              aria-label={`${slot.dateStr}${hasPlan ? " (has entry)" : ""}${isSelected ? " (selected)" : ""}`}
              aria-pressed={isSelected}
            >
              <span
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full transition-all flex items-center justify-center text-[10px] font-mono ${
                  isSelected
                    ? "bg-[#D9653B] text-white shadow-sm scale-105" // Signature warm terracotta accent from reference
                    : hasPlan
                    ? "bg-paper-text text-paper hover:opacity-90"
                    : isTodayDate
                    ? "border-2 border-paper-text text-paper-text"
                    : "border border-paper-border/80 text-paper-muted hover:border-paper-muted hover:text-paper-text"
                }`}
              >
                {slot.day}
              </span>
            </button>
          );
        })}
      </div>

      {/* Subtle quote / footer matching reference */}
      <div className="pt-2 border-t border-paper-border/50 text-center">
        <span className="text-[10px] uppercase tracking-widest text-paper-muted font-mono">
          Less but better
        </span>
      </div>
    </div>
  );
}

