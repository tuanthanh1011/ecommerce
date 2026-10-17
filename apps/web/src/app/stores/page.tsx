import type { Metadata } from "next";
import { PublicShell } from "@/components/site/public-shell";
import { StoresListContent } from "@/components/site/stores-page";

export const metadata: Metadata = {
  title: "Cửa Hàng | S+ Coffee",
  description: "Hệ thống cửa hàng S+ Coffee.",
};

export default function StoresPage() {
  return (
    <PublicShell>
      <StoresListContent />
    </PublicShell>
  );
}
