"use client";

import { MENU_CONTENT, MENU_ITEM } from "./theme";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { ChevronDown, LayoutDashboard, LogOut, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type CurrentAdmin, useCurrentAdmin } from "@/hooks/use-auth";
import { apiClient } from "@/lib/api-client";
import { clearTokens, getAccessToken, getRefreshToken } from "@/lib/auth";
import { AdminRole } from "@/lib/constants";

const noopSubscribe = () => () => {};

export type SiteAccount =
  | { status: "guest" }
  | { status: "loading" }
  | { status: "user"; user: CurrentAdmin };

/**
 * Who is browsing the public site. Staff sign in once (same account as the
 * CMS); the header then shows their name instead of "Đăng nhập".
 */
export function useSiteAccount(): SiteAccount {
  // false while prerendering/hydrating so server and first client render match.
  const hasToken = useSyncExternalStore(
    noopSubscribe,
    () => !!getAccessToken(),
    () => false,
  );
  const { data, isPending, isError } = useCurrentAdmin(hasToken);

  if (!hasToken || isError) return { status: "guest" };
  if (isPending || !data) return { status: "loading" };
  return { status: "user", user: data };
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) await apiClient.post("/auth/logout", { refreshToken });
    } catch {
      // ignore network errors on logout
    } finally {
      clearTokens();
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
      router.replace("/");
    }
  };
}

const PILL =
  "font-ui hidden h-9 items-center gap-1.5 rounded-full border border-[#f3e9dc]/40 px-4 text-xs font-medium whitespace-nowrap text-[#f3e9dc] uppercase transition-colors hover:bg-[#f3e9dc]/10 sm:inline-flex";

/** Header button: "Đăng Nhập" for guests, the user's name + menu once signed in. */
export function AccountButton() {
  const account = useSiteAccount();
  const router = useRouter();
  const logout = useLogout();

  if (account.status === "loading") {
    return <span className={`${PILL} invisible`}>Đăng Nhập</span>;
  }
  if (account.status === "guest") {
    return (
      <Link href="/admin/login/" className={PILL}>
        Đăng Nhập
      </Link>
    );
  }

  const { user } = account;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        openOnHover
        delay={0}
        className={`${PILL} max-w-48 outline-none focus-visible:ring-2 focus-visible:ring-white/50`}
      >
        <span className="truncate normal-case">{user.fullName}</span>
        <ChevronDown className="size-3.5 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className={`${MENU_CONTENT} w-56 p-1.5`}>
        {/* Base UI requires a menu label to live inside a group. */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-2">
            <span className="block truncate text-sm font-semibold text-white">
              {user.fullName}
            </span>
            <span className="block truncate text-xs font-normal text-[#f3e9dc]/70">
              {user.email}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-white/15" />
        <DropdownMenuItem className={`${MENU_ITEM} px-2 py-1.5`} onClick={() => router.push("/internal/notices/")}>
          <Users />
          Nội bộ
        </DropdownMenuItem>
        {user.role === AdminRole.ADMIN && (
          <DropdownMenuItem
            className={`${MENU_ITEM} px-2 py-1.5`}
            onClick={() => router.push("/admin/dashboard/")}
          >
            <LayoutDashboard />
            Quản trị CMS
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className={`${MENU_ITEM} px-2 py-1.5`} onClick={logout}>
          <LogOut />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
