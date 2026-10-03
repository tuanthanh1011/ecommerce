"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { NAV_GROUPS, findNavItemForPath } from "./nav-items";
import { useSidebar } from "./sidebar-context";

function BrandMark({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link
      href="/admin/dashboard"
      className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
    >
      <span className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 via-amber-500 to-orange-600 text-white shadow-lg shadow-amber-900/40 ring-1 ring-white/20">
        <Coffee className="size-[18px]" strokeWidth={2.25} />
      </span>
      {!collapsed && (
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="text-[15px] font-semibold tracking-tight text-white">
            S.t CMS
          </span>
          <span className="text-[11px] text-sidebar-foreground/55">
            Content Studio
          </span>
        </span>
      )}
    </Link>
  );
}

function NavList({
  collapsed,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const activeItem = findNavItemForPath(pathname);

  return (
    <nav className="scrollbar-thin flex-1 space-y-6 overflow-y-auto px-3 py-4">
      {NAV_GROUPS.map((group) => (
        <div key={group.title}>
          {collapsed ? (
            <div className="mx-auto mb-2 h-px w-6 bg-sidebar-border first:hidden" />
          ) : (
            <p className="mb-2 px-3 text-[10.5px] font-semibold tracking-[0.08em] text-sidebar-foreground/40 uppercase">
              {group.title}
            </p>
          )}
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const active = activeItem?.href === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                    collapsed && "justify-center px-0",
                    active
                      ? "bg-linear-to-r from-amber-500/[0.16] to-amber-500/[0.04] text-white"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-white",
                  )}
                >
                  {active && (
                    <span className="absolute top-1.5 bottom-1.5 left-0 w-[3px] rounded-r-full bg-sidebar-primary shadow-[0_0_12px] shadow-amber-400/60" />
                  )}
                  <Icon
                    className={cn(
                      "size-[18px] shrink-0 transition-colors",
                      active
                        ? "text-sidebar-primary"
                        : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground",
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

const SIDEBAR_SURFACE =
  "relative bg-sidebar text-sidebar-foreground before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-48 before:bg-[radial-gradient(ellipse_at_top_left,rgb(245_158_11/0.14),transparent_70%)]";

export function Sidebar() {
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      <aside
        className={cn(
          SIDEBAR_SURFACE,
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border transition-[width] duration-200 md:flex",
          collapsed ? "w-[72px]" : "w-64",
        )}
      >
        <div
          className={cn(
            "relative flex h-16 items-center px-5",
            collapsed && "justify-center px-0",
          )}
        >
          <BrandMark collapsed={collapsed} />
        </div>
        <NavList collapsed={collapsed} />
        <div className="relative border-t border-sidebar-border p-3">
          <button
            type="button"
            onClick={toggleCollapsed}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-white",
              collapsed && "justify-center px-0",
            )}
            aria-label={collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
          >
            <ChevronsLeft
              className={cn(
                "size-4 transition-transform",
                collapsed && "rotate-180",
              )}
            />
            {!collapsed && <span>Thu gọn</span>}
          </button>
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className={cn(
            SIDEBAR_SURFACE,
            "w-72 gap-0 border-sidebar-border p-0 [&_[data-slot=sheet-close]]:text-sidebar-foreground [&_[data-slot=sheet-close]]:hover:bg-sidebar-accent",
          )}
        >
          <SheetTitle className="sr-only">Điều hướng</SheetTitle>
          <div className="relative flex h-16 items-center px-5">
            <BrandMark />
          </div>
          <NavList onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
