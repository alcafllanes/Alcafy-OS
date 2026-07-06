"use client";

import { useEffect } from "react";
import { X } from "@phosphor-icons/react/dist/ssr";

export default function Modal({
  open,
  onClose,
  title,
  children,
  maxWidthClass = "max-w-md",
  headerActions,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidthClass?: string;
  headerActions?: React.ReactNode;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={onClose} />
      <div className={`glass-card relative z-10 max-h-[85vh] w-full overflow-y-auto p-6 backdrop-blur-2xl transition-all duration-300 ${maxWidthClass}`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink dark:text-white">{title}</h2>
          <div className="flex items-center gap-1">
            {headerActions}
            <button onClick={onClose} className="rounded-full p-1.5 text-muted hover:bg-alc-pink/20 hover:text-ink">
              <X size={18} weight="bold" />
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
