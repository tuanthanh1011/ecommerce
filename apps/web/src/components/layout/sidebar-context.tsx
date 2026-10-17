"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface SidebarState {
  collapsed: boolean;
  toggleCollapsed: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarState | null>(null);
const STORAGE_KEY = "st-cms:sidebar-collapsed";

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  // Mounted only after the client-side auth check, so reading storage here is safe.
  const [collapsed, setCollapsed] = useState(() => {
    // An explicit choice wins; otherwise start as a slim rail on tablets so
    // the content keeps its room.
    const tablet = window.matchMedia("(max-width: 1023px)").matches;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === null ? tablet : stored === "1";
    } catch {
      return tablet;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return (
    <SidebarContext.Provider
      value={{ collapsed, toggleCollapsed, mobileOpen, setMobileOpen }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used inside SidebarProvider");
  return ctx;
}
