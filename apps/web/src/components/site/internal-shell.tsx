"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { useSiteAccount } from "./account";

/** Staff-only pages under "Nội bộ" (shown in the header dropdown). */
export const INTERNAL_LINKS = [
  { href: "/internal/notices/", label: "Thông Báo" },
  { href: "/internal/people/", label: "Con người phù hợp" },
  // "Quy chuẩn chuyên môn" is hidden for now — add its page + entry here to bring it back.
];

/**
 * Staff only: guests are sent to sign in and come back to the same page.
 * Renders nothing until the account is known.
 */
export function InternalGate({ children }: { children: React.ReactNode }) {
  const account = useSiteAccount();
  const router = useRouter();

  useEffect(() => {
    if (account.status !== "guest") return;
    // Hydration renders as "guest" first; only a missing token means signed out
    // (an invalid one is already sent to the login page by the API client).
    if (getAccessToken()) return;
    const here = window.location.pathname + window.location.search;
    router.replace(`/admin/login/?next=${encodeURIComponent(here)}`);
  }, [account.status, router]);

  if (account.status !== "user") return <div className="min-h-[70vh]" aria-busy="true" />;
  return <>{children}</>;
}
