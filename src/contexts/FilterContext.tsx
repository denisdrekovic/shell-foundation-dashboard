"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { FilterState } from "@/types/filters";

interface FilterContextValue {
  filters: FilterState;
  setLocation: (location: string | null) => void;
  setPartnerId: (partnerId: string | null) => void;
  setGender: (gender: "all" | "men" | "women") => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  location: null,
  partnerId: null,
  gender: "all",
};

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const setLocation = useCallback(
    (location: string | null) =>
      setFilters((prev) => ({ ...prev, location })),
    []
  );

  const setPartnerId = useCallback(
    (partnerId: string | null) =>
      setFilters((prev) => ({ ...prev, partnerId })),
    []
  );

  const setGender = useCallback(
    (gender: "all" | "men" | "women") =>
      setFilters((prev) => ({ ...prev, gender })),
    []
  );

  const resetFilters = useCallback(() => setFilters(defaultFilters), []);

  const value = useMemo(
    () => ({ filters, setLocation, setPartnerId, setGender, resetFilters }),
    [filters, setLocation, setPartnerId, setGender, resetFilters]
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used within FilterProvider");
  return ctx;
}
