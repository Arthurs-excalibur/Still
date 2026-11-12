"use client";

import React, { useEffect, useState } from "react";
import { getAllPlans, getPrioritiesForPlan } from "@/lib/database/db";
import { formatEditorialDate, getLocalDateString } from "@/lib/dates";
import type { DailyPlan, Priority } from "@/types";
import { Calendar, CheckCircle2, Circle, ChevronDown, ChevronUp, LayoutList, CalendarDays } from "lucide-react";
import { HistoryCalendarView } from "./HistoryCalendarView";

interface DayArchiveItem {
  plan: DailyPlan;
  priorities: Priority[];
}

export function HistoryView() {
  const [historyItems, setHistoryItems] = useState<DayArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPlanIds, setExpandedPlanIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"list" | "calendar">("calendar");
  
  const todayStr = getLocalDateString(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(todayStr);

  useEffect(() => {
    let isMounted = true;
    async function loadHistory() {
      try {
        const plans = await getAllPlans();
        const sortedPlans = [...plans].sort((a, b) => b.localDate.localeCompare(a.localDate));

        const fullItems: DayArchiveItem[] = await Promise.all(
          sortedPlans.map(async (plan) => {
            const priorities = await getPrioritiesForPlan(plan.id);
            return { plan, priorities };
          })
        );

        if (isMounted) {
          setHistoryItems(fullItems);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
        if (isMounted) setLoading(false);
      }
    }

    loadHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleExpand = (planId: string) => {
    setExpandedPlanIds((prev) => {
      const next = new Set(prev);
      if (next.has(planId)) next.delete(planId);
      else next.add(planId);
      return next;
    });
  };

  const loggedDatesSet = new Set(historyItems.map((item) => item.plan.localDate));
  const selectedDayItem = historyItems.find((item) => item.plan.localDate === selectedCalendarDate);

  if (loading) {
    return (
      <main className="flex-1 flex flex-col justify-center items-center py-20 animate-fade-in">
        <p className="text-sm font-serif text-paper-muted animate-pulse">
          Opening archive...
        </p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col space-y-8 animate-fade-in pb-12">
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-serif tracking-tight text-paper-text">
            Past Days
          </h1>
          <p className="text-sm text-paper-muted">
            A quiet chronological archive of previous days and journal reflections.
          </p>
        </div>

        {/* View mode toggle without breaking layout */}
        <div className="inline-flex rounded border border-paper-border/80 p-0.5 bg-paper-surface/50 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("list")}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded transition-all ${
              activeTab === "list"
                ? "bg-paper-text text-paper font-medium shadow-sm"
                : "text-paper-muted hover:text-paper-text"
            }`}
            aria-pressed={activeTab === "list"}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("calendar")}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded transition-all ${
              activeTab === "calendar"
                ? "bg-paper-text text-paper font-medium shadow-sm"
                : "text-paper-muted hover:text-paper-text"
            }`}
            aria-pressed={activeTab === "calendar"}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>
        </div>
      </section>

      {historyItems.length === 0 && activeTab === "list" ? (
        <section
          aria-labelledby="history-archive-heading"
          className="rounded border border-dashed border-paper-border/80 py-12 px-6 text-center space-y-3"
        >
          <Calendar className="w-6 h-6 stroke-[1.25] text-paper-muted mx-auto" />
          <h2 id="history-archive-heading" className="text-base font-serif text-paper-text">
            No days recorded yet
          </h2>
          <p className="text-sm text-paper-muted max-w-sm mx-auto leading-relaxed">
            As you plan priorities and write evening reflections, your archive will grow quietly here.
          </p>
        </section>
      ) : activeTab === "calendar" ? (
        <section className="flex flex-col md:flex-row gap-8 items-start animate-fade-in">
          {/* Calendar visual component matching reference */}
          <HistoryCalendarView
            loggedDates={loggedDatesSet}
            selectedDate={selectedCalendarDate}
            onSelectDate={(d) => setSelectedCalendarDate(d)}
          />

          {/* Details for selected date */}
          <div className="flex-1 w-full space-y-4 rounded border border-paper-border/80 p-5 bg-paper-surface/20">
            <header className="space-y-0.5 border-b border-paper-border/60 pb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-serif text-paper-text font-medium">
                  {formatEditorialDate(selectedCalendarDate)}
                </h2>
                {selectedCalendarDate === todayStr && (
                  <span className="text-[10px] tracking-wider uppercase font-mono px-1.5 py-0.5 rounded border border-paper-border text-paper-muted bg-paper-surface">
                    Today
                  </span>
                )}
              </div>
              <p className="text-xs text-paper-muted font-mono">
                {selectedDayItem
                  ? `${selectedDayItem.priorities.filter((p) => p.completedAt).length} of ${selectedDayItem.priorities.length} priorities completed`
                  : "No plan entry logged for this day"}
              </p>
            </header>

            {selectedDayItem ? (
              <div className="space-y-4 pt-1">
                {/* Priorities */}
                <div className="space-y-2">
                  <span className="text-[11px] uppercase tracking-wider text-paper-muted font-mono block">
                    Priorities
                  </span>
                  {selectedDayItem.priorities.length === 0 ? (
                    <p className="text-xs text-paper-muted/70 italic">No priorities entered</p>
                  ) : (
                    <div className="space-y-1.5 pl-0.5">
                      {selectedDayItem.priorities.map((p) => {
                        const isDone = Boolean(p.completedAt);
                        return (
                          <div
                            key={p.id}
                            className="flex items-center gap-2.5 text-xs sm:text-sm text-paper-text"
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-paper-muted shrink-0" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-paper-border shrink-0 stroke-[1.5]" />
                            )}
                            <span
                              className={
                                isDone
                                  ? "line-through text-paper-muted/70 decoration-paper-border"
                                  : "text-paper-text"
                              }
                            >
                              {p.title || "(Untitled priority)"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Journal */}
                <div className="space-y-1.5 pt-2 border-t border-paper-border/40">
                  <span className="text-[11px] uppercase tracking-wider text-paper-muted font-mono block">
                    Reflection Note
                  </span>
                  {selectedDayItem.plan.journalText.trim().length > 0 ? (
                    <div className="p-3.5 rounded bg-paper-surface/60 border border-paper-border/60 text-xs sm:text-sm text-paper-text font-serif leading-relaxed whitespace-pre-wrap">
                      {selectedDayItem.plan.journalText}
                    </div>
                  ) : (
                    <p className="text-xs text-paper-muted/60 italic">No reflection written</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-paper-muted font-serif italic">
                No archived priorities or journal entries found for this calendar day.
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="divide-y divide-paper-border/70 border-t border-b border-paper-border/70">
          {historyItems.map(({ plan, priorities }) => {
            const isToday = plan.localDate === todayStr;
            const completedCount = priorities.filter((p) => Boolean(p.completedAt)).length;
            const isExpanded = expandedPlanIds.has(plan.id);
            const hasJournal = plan.journalText.trim().length > 0;

            return (
              <article key={plan.id} className="py-4 space-y-3">
                <header className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-serif text-paper-text font-medium">
                        {formatEditorialDate(plan.localDate)}
                      </h2>
                      {isToday && (
                        <span className="text-[10px] tracking-wider uppercase font-mono px-1.5 py-0.5 rounded border border-paper-border text-paper-muted bg-paper-surface">
                          Today
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-paper-muted font-mono">
                      {completedCount} of {priorities.length} completed
                    </p>
                  </div>

                  {hasJournal && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(plan.id)}
                      className="inline-flex items-center gap-1 text-xs text-paper-muted hover:text-paper-text transition-colors p-1 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-paper-text/40"
                      aria-expanded={isExpanded}
                      aria-label={`${isExpanded ? "Collapse" : "Expand"} journal entry for ${plan.localDate}`}
                    >
                      <span>{isExpanded ? "Hide note" : "View note"}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </header>

                {/* 3 Priorities status */}
                <div className="space-y-1.5 pl-1">
                  {priorities.length === 0 ? (
                    <p className="text-xs text-paper-muted/60 italic">No priorities entered</p>
                  ) : (
                    priorities.map((p) => {
                      const isDone = Boolean(p.completedAt);
                      return (
                        <div
                          key={p.id}
                          className="flex items-center gap-2.5 text-xs sm:text-sm text-paper-text"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-paper-muted shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-paper-border shrink-0 stroke-[1.5]" />
                          )}
                          <span
                            className={
                              isDone
                                ? "line-through text-paper-muted/70 decoration-paper-border"
                                : "text-paper-text"
                            }
                          >
                            {p.title || "(Untitled priority)"}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Journal Accordion */}
                {isExpanded && hasJournal && (
                  <div className="mt-3 p-3.5 rounded bg-paper-surface/60 border border-paper-border/60 text-xs sm:text-sm text-paper-text font-serif leading-relaxed whitespace-pre-wrap animate-fade-in">
                    {plan.journalText}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
