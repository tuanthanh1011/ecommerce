import type { Metadata } from "next";
import { ProductsListContent } from "@/components/site/products-page";

export const metadata: Metadata = {
  title: "Sản Phẩm | S+ Coffee",
  description: "Đồ uống đặc trưng và vật phẩm của S+ Coffee.",
};

export default function ProductsPage() {
  return <ProductsListContent />;
}
