"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronRight, LogOut, Menu, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentAdmin } from "@/hooks/use-auth";
import { apiClient } from "@/lib/api-client";
import { clearTokens, getRefreshToken } from "@/lib/auth";
import { initials } from "@/lib/format";
import { findNavItemForPath } from "./nav-items";
import { useSidebar } from "./sidebar-context";

function Breadcrumbs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const item = findNavItemForPath(pathname);
  const isForm = pathname?.includes("/form");
  const isHome = item?.href === "/admin/dashboard";

  const crumbs: { label: string; href?: string }[] = [
    { label: "S.t CMS", href: "/admin/dashboard" },
  ];
  if (item && !isHome) {
    crumbs.push({ label: item.label, href: isForm ? item.href : undefined });
  } else if (isHome) {
    crumbs.push({ label: "Tổng quan" });
  }
  if (isForm) {
    crumbs.push({ label: searchParams.get("id") ? "Chỉnh sửa" : "Tạo mới" });
  }

  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
      {crumbs.map((crumb, i) => {
        const last = i === crumbs.length - 1;
        return (
          <span key={i} className="flex min-w-0 items-center gap-1.5">
            {i > 0 && (
              <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/60" />
            )}
            {crumb.href && !last ? (
              <Link
                href={crumb.href}
                className="truncate text-muted-foreground transition-colors hover:text-foreground"
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                className={
                  last
                    ? "truncate font-medium text-foreground"
                    : "truncate text-muted-foreground"
                }
              >
                {crumb.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

function TodayChip() {
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return (
    <span className="hidden rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground capitalize shadow-xs lg:inline-flex">
      {today}
    </span>
  );
}

export function Topbar() {
  const router = useRouter();
  const { data: admin } = useCurrentAdmin();
  const { setMobileOpen } = useSidebar();

  const handleLogout = async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await apiClient.post("/auth/logout", { refreshToken });
      }
    } catch {
      // ignore network errors on logout
    } finally {
      clearTokens();
      router.replace("/admin/login/");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border/70 bg-background/80 px-4 backdrop-blur-md supports-backdrop-filter:bg-background/65 lg:px-8">
      <div className="flex min-w-0 items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Mở menu"
        >
          <Menu className="size-5" />
        </Button>
        <Suspense fallback={null}>
          <Breadcrumbs />
        </Suspense>
      </div>

      <div className="flex items-center gap-3">
        <TodayChip />
        {admin && (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-full border border-transparent py-1 pr-2.5 pl-1 transition-colors outline-none hover:border-border hover:bg-card focus-visible:ring-2 focus-visible:ring-ring/50 data-popup-open:border-border data-popup-open:bg-card">
              <Avatar className="size-8">
                <AvatarFallback className="bg-linear-to-br from-amber-400 to-orange-600 text-xs font-semibold text-white">
                  {initials(admin.fullName)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden flex-col items-start leading-tight sm:flex">
                <span className="text-sm font-medium text-foreground">
                  {admin.fullName}
                </span>
                <span className="text-[11px] text-muted-foreground">Quản trị viên</span>
              </span>
              <ChevronDown className="hidden size-3.5 text-muted-foreground sm:block" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 p-1.5">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="px-2 py-2">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {admin.fullName}
                  </span>
                  <span className="block truncate text-xs font-normal text-muted-foreground">
                    {admin.email}
                  </span>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="px-2 py-1.5"
                onClick={() => router.push("/admin/dashboard/admins/")}
              >
                <UserRound />
                Tài khoản Admin
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="px-2 py-1.5"
                onClick={handleLogout}
              >
                <LogOut />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
