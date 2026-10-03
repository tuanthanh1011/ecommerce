"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";

export default function AdminIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace(getAccessToken() ? "/admin/dashboard/" : "/admin/login/");
  }, [router]);

  return null;
}
