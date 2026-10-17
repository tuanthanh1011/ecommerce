"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BrandLogo } from "@/components/common/brand-logo";
import { getAccessToken } from "@/lib/auth";
import { useCurrentAdmin } from "@/hooks/use-auth";
import { homeHrefForRole, isPathAllowedForRole } from "@/components/layout/nav-items";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { SidebarProvider } from "@/components/layout/sidebar-context";

const noopSubscribe = () => () => {};

function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
      <BrandLogo className="animate-pulse text-3xl text-[#960000]" />
      Đang tải...
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  // false while prerendering/hydrating (so server and first client render
  // match), then true once a token is found in localStorage.
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => !!getAccessToken(),
    () => false,
  );
  const { data: currentAdmin, isLoading: adminLoading } = useCurrentAdmin();

  useEffect(() => {
    if (!getAccessToken()) router.replace("/admin/login/");
  }, [router]);

  // Defense-in-depth only — the API already rejects these requests for an
  // Employee token. This just avoids flashing a forbidden page client-side.
  useEffect(() => {
    if (!ready || adminLoading || !currentAdmin) return;
    if (!isPathAllowedForRole(pathname, currentAdmin.role)) {
      router.replace(homeHrefForRole(currentAdmin.role));
    }
  }, [ready, adminLoading, currentAdmin, pathname, router]);

  // Also hold the screen while a disallowed page is being redirected away
  // from, so its queries never fire (and 403) for this role.
  if (!ready || adminLoading || !isPathAllowedForRole(pathname, currentAdmin?.role)) {
    return <LoadingScreen />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-[1400px] animate-in duration-300 fade-in-0 slide-in-from-bottom-1">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
