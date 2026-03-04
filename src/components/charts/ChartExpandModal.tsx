"use client";

import { useEffect, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ChartExpandModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export default function ChartExpandModal({
  title,
  children,
  onClose,
}: ChartExpandModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus the close button on mount
    closeRef.current?.focus();

    // Lock body scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // ESC to close
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-5xl max-h-[85vh] flex flex-col bg-white rounded-[var(--radius-card-lg)] shadow-[var(--shadow-elevated)] overflow-hidden animate-modal-enter"
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-surface-alt)",
          }}
        >
          <h2
            className="text-sm font-bold uppercase tracking-wider"
            style={{ color: "var(--color-title)" }}
          >
            {title}
          </h2>
          <button
            ref={closeRef}
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors hover:bg-surface-alt"
            aria-label="Close expanded view"
            style={{ color: "var(--color-gray)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="h-[60vh]">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
}
