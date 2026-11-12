"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { SidebarBrand, SidebarNav } from "@/components/layout/sidebar-nav";
import { getActiveNav } from "@/config/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const active = getActiveNav(pathname);

  return (
    <div className="flex min-h-dvh">
      <a
        href="#main-content"
        className="bg-primary text-primary-foreground sr-only z-50 rounded-md px-3 py-2 text-sm focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="bg-sidebar border-sidebar-border sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-6 border-r py-5 lg:flex">
        <SidebarBrand />
        <SidebarNav />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 gap-6 py-5">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">Main application sections</SheetDescription>
          <SidebarBrand />
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="bg-background/90 sticky top-0 z-30 flex h-14 items-center gap-3 border-b px-4 backdrop-blur sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <Menu />
          </Button>
          <nav aria-label="Breadcrumb" className="min-w-0 text-sm">
            <ol className="flex items-center gap-2">
              <li className="text-muted-foreground hidden sm:block">
                {active?.group ?? "Workspace"}
              </li>
              <li aria-hidden className="text-muted-foreground hidden sm:block">
                /
              </li>
              <li aria-current="page" className="truncate font-medium">
                {active?.item.title ?? "Publish Studio"}
              </li>
            </ol>
          </nav>
          <span className="bg-muted text-muted-foreground ml-auto hidden rounded-full px-3 py-1 text-xs sm:inline">
            Prototype · Mock data
          </span>
        </header>

        <main
          id="main-content"
          className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:py-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
