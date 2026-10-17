import type { Metadata } from "next";
import { StoreDetailContent } from "@/components/site/stores-page";

export const metadata: Metadata = { title: "Cửa Hàng | S+ Coffee" };

export default function StoreDetailPage() {
  return <StoreDetailContent />;
}
