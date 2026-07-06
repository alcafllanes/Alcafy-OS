"use client";

import { useEffect } from "react";

/**
 * Mounted once in the root layout. Listens for mouse movement over any
 * element with the `.btn-gradient` class and writes the cursor position
 * (relative to that button) into CSS variables the button's ::before blob
 * reads from. This avoids having to add extra markup to every single
 * gradient button across the app.
 */
export default function BlobHover() {
  useEffect(() => {
    function handleMove(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(".btn-gradient");
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      target.style.setProperty("--blob-x", `${e.clientX - rect.left}px`);
      target.style.setProperty("--blob-y", `${e.clientY - rect.top}px`);
      target.style.setProperty("--blob-size", `${size}px`);
    }
    document.addEventListener("mousemove", handleMove);
    return () => document.removeEventListener("mousemove", handleMove);
  }, []);

  return null;
}
