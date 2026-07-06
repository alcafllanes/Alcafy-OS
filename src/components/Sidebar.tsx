"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, SETTINGS_ITEM } from "@/lib/nav-items";

type SidebarProps = {
  avatarUrl: string | null;
  displayName: string | null;
};

export default function Sidebar({ avatarUrl, displayName }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/40 bg-white/60 p-5 backdrop-blur-glass lg:flex">
      {/* Logo */}
      <div className="mb-5 flex items-center gap-3 px-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-glass-sm bg-alc-gradient font-bold text-white">
          A
        </div>
        <span className="text-lg font-semibold tracking-tight text-ink">Alcafy</span>
      </div>

      {/* Profile block */}
      <Link
        href="/profile"
        className="mb-6 flex items-center gap-3 rounded-glass-sm px-2 py-2 transition-colors hover:bg-alc-pink/15"
      >
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-alc-pink bg-alc-cream">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={displayName ?? "Profile"} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-alc-rose">
              {displayName?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{displayName || "Your name"}</p>
          <span className="text-xs text-alc-rose">View profile</span>
        </div>
      </Link>

      {/* Main nav */}
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname?.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={`nav-item ${active ? "active" : ""}`}>
              <Icon size={20} weight="bold" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Settings, visually separated */}
      <div className="mt-4 border-t border-white/50 pt-4">
        <Link
          href={SETTINGS_ITEM.href}
          className={`nav-item ${pathname?.startsWith(SETTINGS_ITEM.href) ? "active" : ""}`}
        >
          <SETTINGS_ITEM.icon size={20} weight="bold" />
          {SETTINGS_ITEM.label}
        </Link>
      </div>
    </aside>
  );
}
