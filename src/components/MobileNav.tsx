"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { NAV_ITEMS, SETTINGS_ITEM } from "@/lib/nav-items";

export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const primaryItems = NAV_ITEMS.slice(0, 4); // Home, Goals, Workspace, Finance in the bar

  return (
    <>
      {/* Bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between border-t border-white/40 bg-white/70 px-2 py-2 backdrop-blur-glass lg:hidden">
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-glass-sm py-1.5 text-[11px] font-medium ${
                active ? "text-alc-rose" : "text-muted"
              }`}
            >
              <Icon size={22} weight="bold" />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={() => setOpen(true)}
          className="flex flex-1 flex-col items-center gap-0.5 rounded-glass-sm py-1.5 text-[11px] font-medium text-muted"
        >
          <List size={22} weight="bold" />
          More
        </button>
      </nav>

      {/* Slide-out drawer for the rest */}
      {open && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="absolute inset-0 bg-ink/30" onClick={() => setOpen(false)} />
          <div className="relative ml-auto flex h-full w-72 flex-col gap-1 bg-white/95 p-5 backdrop-blur-glass">
            <button onClick={() => setOpen(false)} className="mb-4 self-end text-muted">
              <X size={22} weight="bold" />
            </button>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`nav-item ${active ? "active" : ""}`}
                >
                  <Icon size={20} weight="bold" />
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-3 border-t border-alc-pink/40 pt-3">
              <Link
                href={SETTINGS_ITEM.href}
                onClick={() => setOpen(false)}
                className={`nav-item ${pathname?.startsWith(SETTINGS_ITEM.href) ? "active" : ""}`}
              >
                <SETTINGS_ITEM.icon size={20} weight="bold" />
                {SETTINGS_ITEM.label}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
