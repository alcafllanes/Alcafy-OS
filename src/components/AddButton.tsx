"use client";

import { Plus } from "@phosphor-icons/react/dist/ssr";

export default function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="btn-gradient flex items-center gap-2 text-sm">
      <Plus size={16} weight="bold" /> {label}
    </button>
  );
}
