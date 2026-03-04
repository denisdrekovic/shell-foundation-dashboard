"use client";

import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { FilterProvider } from "@/contexts/FilterContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FilterProvider>
      {/* Skip navigation link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-plum focus:text-white focus:px-4 focus:py-2 focus:rounded-[var(--radius-button)] focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>
      <div className="h-screen bg-background flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main id="main-content" className="flex-1 p-6 overflow-y-auto" role="main">
            {children}
          </main>
        </div>
      </div>
    </FilterProvider>
  );
}
