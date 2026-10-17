import type { Metadata } from "next";
import { PublicShell } from "@/components/site/public-shell";
import { ProductDetailContent } from "@/components/site/products-page";

export const metadata: Metadata = { title: "Sản Phẩm | S+ Coffee" };

export default function ProductDetailPage() {
  return (
    <PublicShell>
      <ProductDetailContent />
    </PublicShell>
  );
}
