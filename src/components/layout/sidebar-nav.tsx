"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PackageCheck } from "lucide-react";

import { NAV_GROUPS, getActiveNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = getActiveNav(pathname)?.item;

  return (
    <nav aria-label="Main" className="flex flex-col gap-6 px-3">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          <p className="text-muted-foreground px-3 pb-1 text-[11px] font-medium tracking-wider uppercase">
            {group.label}
          </p>
          {group.items.map((item) => {
            const isActive = active?.href === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors outline-none",
                  "focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {item.title}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export function SidebarBrand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 rounded-md px-3 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <span
        aria-hidden
        className="bg-brand flex size-8 items-center justify-center rounded-md text-white"
      >
        <PackageCheck className="size-4.5" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-semibold">Publish Studio</span>
        <span className="text-muted-foreground text-xs">AI Product Publishing</span>
      </span>
    </Link>
  );
}
