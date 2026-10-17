import type { Metadata } from "next";
import { ProductDetailContent } from "@/components/site/products-page";

export const metadata: Metadata = { title: "Sản Phẩm | S+ Coffee" };

export default function ProductDetailPage() {
  return <ProductDetailContent />;
}
