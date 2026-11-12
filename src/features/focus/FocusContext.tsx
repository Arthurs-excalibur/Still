"use client";

import React, { createContext, useContext } from "react";
import { useFocusSession } from "./useFocusSession";

type FocusContextType = ReturnType<typeof useFocusSession>;

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export function FocusProvider({ children }: { children: React.ReactNode }) {
  const focus = useFocusSession();
  return <FocusContext.Provider value={focus}>{children}</FocusContext.Provider>;
}

export function useFocus() {
  const ctx = useContext(FocusContext);
  if (!ctx) {
    throw new Error("useFocus must be used within a FocusProvider");
  }
  return ctx;
}

