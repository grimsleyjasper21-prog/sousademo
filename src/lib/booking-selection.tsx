"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { CategoryId } from "./services-data";

type Selection = { category: CategoryId | null; serviceId: string | null };
type Ctx = { selection: Selection; select: (category: CategoryId, serviceId: string) => void };

const BookingSelectionContext = createContext<Ctx | null>(null);

export function BookingSelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Selection>({ category: null, serviceId: null });
  const select = (category: CategoryId, serviceId: string) => setSelection({ category, serviceId });
  return (
    <BookingSelectionContext.Provider value={{ selection, select }}>
      {children}
    </BookingSelectionContext.Provider>
  );
}

export function useBookingSelection() {
  const ctx = useContext(BookingSelectionContext);
  if (!ctx) throw new Error("useBookingSelection must be used within BookingSelectionProvider");
  return ctx;
}
