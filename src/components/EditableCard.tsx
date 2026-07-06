"use client";

import { X } from "@phosphor-icons/react/dist/ssr";

export default function EditableCard({
  onClick,
  onDelete,
  className = "",
  children,
}: {
  onClick?: () => void;
  onDelete?: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    // No overflow-hidden here, on purpose, so the corner delete button never
    // gets clipped. Image/cover content is clipped one level down instead.
    <div className={`editable-card glass-card relative cursor-pointer ${className}`} onClick={onClick}>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="card-delete-btn"
          aria-label="Remove"
        >
          <X size={13} weight="bold" />
        </button>
      )}
      <div className="overflow-hidden rounded-glass">{children}</div>
    </div>
  );
}
