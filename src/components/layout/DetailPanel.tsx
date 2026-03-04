"use client";

import { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

interface DetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function DetailPanel({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}: DetailPanelProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus the close button when panel opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => closeButtonRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Escape key to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel — sits at top-right of viewport, below the topbar */}
      <aside
        role="complementary"
        aria-label={`Details for ${title}`}
        aria-hidden={!isOpen}
        className={clsx(
          "fixed right-0 bg-white shadow-[var(--shadow-elevated)] z-50 transition-transform duration-300 ease-in-out overflow-y-auto border-l border-surface-alt",
          "w-[90vw] sm:w-[400px]",
          "top-14 h-[calc(100vh-56px)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-surface-alt px-5 py-4 flex items-start justify-between z-10">
          <div>
            <h2 className="text-base font-bold font-[var(--font-heading)] text-title">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-gray mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close detail panel"
            className="p-1.5 rounded-lg hover:bg-surface-alt transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-plum/40"
          >
            <X size={18} className="text-gray" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">{children}</div>
      </aside>
    </>
  );
}
