import type { Metadata } from "next";
import { StoresListContent } from "@/components/site/stores-page";

export const metadata: Metadata = {
  title: "Cửa Hàng | S+ Coffee",
  description: "Hệ thống cửa hàng S+ Coffee.",
};

export default function StoresPage() {
  return <StoresListContent />;
}
