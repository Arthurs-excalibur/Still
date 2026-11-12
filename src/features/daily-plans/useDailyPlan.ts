"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { DailyPlan, Priority } from "@/types";
import {
  getPlanByDate,
  savePlan,
  getPrioritiesForPlan,
  savePriority,
  updateJournalText,
} from "@/lib/database/db";

export type SaveState = "idle" | "saving" | "saved" | "error";

function createDefaultSlots(localDate: string): Priority[] {
  return [1, 2, 3].map((pos) => ({
    id: `priority_plan_${localDate}_${pos}`,
    planId: `plan_${localDate}`,
    title: "",
    position: pos,
    completedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

export function useDailyPlan(localDate: string) {
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [priorities, setPriorities] = useState<Priority[]>(() => createDefaultSlots(localDate));
  const [journalText, setJournalText] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [loading, setLoading] = useState(true);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const planRef = useRef<DailyPlan | null>(null);
  planRef.current = plan;

  // Load plan and priorities whenever localDate changes
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setPriorities(createDefaultSlots(localDate));

    async function loadData() {
      try {
        let currentPlan = await getPlanByDate(localDate);
        if (!currentPlan) {
          currentPlan = {
            id: `plan_${localDate}`,
            localDate,
            journalText: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }

        const currentPriorities = await getPrioritiesForPlan(currentPlan.id);

        // Guarantee 3 fixed slot positions
        const slots: Priority[] = [1, 2, 3].map((pos) => {
          const existing = currentPriorities.find((p) => p.position === pos);
          if (existing) return existing;
          return {
            id: `priority_${currentPlan!.id}_${pos}`,
            planId: currentPlan!.id,
            title: "",
            position: pos,
            completedAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        });

        if (mounted) {
          setPlan(currentPlan);
          setPriorities(slots);
          setJournalText(currentPlan.journalText || "");
          setSaveState("idle");
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load daily plan from IndexedDB:", err);
        if (mounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [localDate]);

  // Ensure plan is persisted in database before attaching child records
  const ensurePlanSaved = async (): Promise<DailyPlan> => {
    let current = planRef.current;
    if (!current) {
      current = {
        id: `plan_${localDate}`,
        localDate,
        journalText,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    const saved = await savePlan(current);
    setPlan(saved);
    return saved;
  };

  // Update a priority title
  const setPriorityTitle = useCallback(
    async (position: number, title: string) => {
      setPriorities((prev) =>
        prev.map((p) =>
          p.position === position
            ? { ...p, title, updatedAt: new Date().toISOString() }
            : p
        )
      );

      try {
        setSaveState("saving");
        const activePlan = await ensurePlanSaved();
        const target = priorities.find((p) => p.position === position) || {
          id: `priority_${activePlan.id}_${position}`,
          planId: activePlan.id,
          title,
          position,
          completedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const updated: Priority = {
          ...target,
          title,
          updatedAt: new Date().toISOString(),
        };

        await savePriority(updated);
        setSaveState("saved");
      } catch (err) {
        console.error("Failed to save priority:", err);
        setSaveState("error");
      }
    },
    [priorities, localDate]
  );

  // Toggle completion timestamp
  const togglePriorityCompleted = useCallback(
    async (position: number) => {
      const current = priorities.find((p) => p.position === position);
      if (!current || !current.title.trim()) return;

      const nextCompletedAt = current.completedAt ? null : new Date().toISOString();

      setPriorities((prev) =>
        prev.map((p) =>
          p.position === position ? { ...p, completedAt: nextCompletedAt } : p
        )
      );

      try {
        setSaveState("saving");
        const activePlan = await ensurePlanSaved();
        const updated: Priority = {
          ...current,
          completedAt: nextCompletedAt,
          updatedAt: new Date().toISOString(),
        };
        await savePriority(updated);
        setSaveState("saved");
      } catch (err) {
        console.error("Failed to toggle completion:", err);
        setSaveState("error");
      }
    },
    [priorities]
  );

  // Debounced journal autosave
  const handleJournalChange = useCallback(
    (newText: string) => {
      setJournalText(newText);
      setSaveState("saving");

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(async () => {
        try {
          const activePlan = await ensurePlanSaved();
          await updateJournalText(activePlan.id, newText);
          setSaveState("saved");
        } catch (err) {
          console.error("Failed to autosave journal:", err);
          setSaveState("error");
        }
      }, 500);
    },
    [localDate]
  );

  return {
    plan,
    priorities,
    journalText,
    saveState,
    loading,
    setPriorityTitle,
    togglePriorityCompleted,
    handleJournalChange,
  };
}
